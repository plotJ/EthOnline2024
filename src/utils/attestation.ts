import {
    SignProtocolClient,
    SpMode,
    EvmChains,
    delegateSignAttestation,
    delegateSignRevokeAttestation,
    delegateSignSchema,
    OnChainSchema,
    DataLocationOnChain,
} from '@ethsign/sp-sdk';
import { privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts';

function normalizePrivateKey(key: string): `0x${string}` {
    // Remove any whitespace
    key = key.trim();
    
    // If the key doesn't start with '0x', add it
    if (!key.startsWith('0x')) {
        key = '0x' + key;
    }
    
    // Ensure the key is the correct length (32 bytes = 64 characters + '0x')
    if (key.length !== 66) {
        throw new Error('Invalid private key length');
    }
    
    // Verify that the key only contains valid hexadecimal characters
    if (!/^0x[0-9a-fA-F]{64}$/.test(key)) {
        throw new Error('Invalid private key format');
    }
    
    return key as `0x${string}`;
}

const PRIVATE_KEY = normalizePrivateKey(process.env.WALLET_PRIVATE_KEY || '');
const CHAIN = process.env.CHAIN_ID as keyof typeof EvmChains;

if (!PRIVATE_KEY || !CHAIN) {
    throw new Error('WALLET_PRIVATE_KEY and CHAIN_ID must be set in environment variables');
}

const account = privateKeyToAccount(PRIVATE_KEY);

const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains[CHAIN],
    account: account,
});

let schemaId: string | null = null;

export async function createVoterAttestationSchema(delegationAccount?: PrivateKeyAccount) {
    if (schemaId) return schemaId;

    try {
        const schemaData: OnChainSchema = {
            name: "VoterAttestation",
            data: [
                { name: "walletAddress", type: "address" },
                { name: "eligibleToVote", type: "bool" },
                { name: "registrationTimestamp", type: "uint256" }
            ],
            registrant: account.address,
            dataLocation: DataLocationOnChain.ONCHAIN,
        };

        let schema;
        if (delegationAccount) {
            const delegationInfo = await delegateSignSchema(schemaData, {
                chain: EvmChains[CHAIN],
                delegationAccount: delegationAccount,
            });
            schema = await client.createSchema(delegationInfo.schema);
        } else {
            schema = await client.createSchema(schemaData);
        }

        console.log("Schema created successfully:", schema.schemaId);
        schemaId = schema.schemaId;
        return schemaId;
    } catch (error) {
        console.error("Error creating schema:", error);
        throw error;
    }
}

export async function createVoterAttestation(walletAddress: string, delegationAccount?: PrivateKeyAccount) {
    try {
        const schemaId = await createVoterAttestationSchema();
        const attestationData = {
            schemaId: schemaId,
            data: {
                walletAddress: walletAddress,
                eligibleToVote: true,
                registrationTimestamp: Math.floor(Date.now() / 1000)
            } as const,  // Use 'as const' to preserve literal types
            indexingValue: walletAddress.toLowerCase()
        };

        let attestation;
        if (delegationAccount) {
            const delegationInfo = await delegateSignAttestation(attestationData, {
                chain: EvmChains[CHAIN],
                delegationAccount: delegationAccount,
            });
            attestation = await client.createAttestation(delegationInfo.attestation);
        } else {
            attestation = await client.createAttestation(attestationData);
        }

        console.log("Voter attestation created successfully");
        console.log("Attestation ID:", attestation.attestationId);
        return attestation.attestationId;
    } catch (error) {
        console.error("Error creating voter attestation:", error);
        throw error;
    }
}

export async function verifyVoterAttestation(walletAddress: string) {
    try {
        const attestation = await client.getAttestation(walletAddress.toLowerCase());
        
        if (attestation && typeof attestation.data === 'object' && !Array.isArray(attestation.data)) {
            const data = attestation.data as { [key: string]: any };
            if ('eligibleToVote' in data && data.eligibleToVote === true && !attestation.revoked) {
                console.log("Voter attestation verified successfully");
                return true;
            }
        }
        console.log("Voter attestation not found or ineligible");
        return false;
    } catch (error) {
        console.error("Error verifying voter attestation:", error);
        return false;
    }
}

export async function revokeVoterAttestation(attestationId: string, delegationAccount?: PrivateKeyAccount) {
    try {
        let result;
        if (delegationAccount) {
            const delegationInfo = await delegateSignRevokeAttestation(attestationId, {
                chain: EvmChains[CHAIN],
                reason: "Voter eligibility revoked",
                delegationAccount: delegationAccount,
            });
            result = await client.revokeAttestation(delegationInfo.attestationId, {
                reason: delegationInfo.reason,
            });
        } else {
            result = await client.revokeAttestation(attestationId, {
                reason: "Voter eligibility revoked"
            });
        }
        console.log("Attestation revoked successfully:", result);
        return result;
    } catch (error) {
        console.error("Error revoking attestation:", error);
        throw error;
    }
}

export async function getVoteAttestations(walletAddress: string) {
    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
        throw new Error('Invalid walletAddress: must be a non-empty string');
    }

    try {
        const normalizedAddress = walletAddress.toLowerCase().trim();
        const attestations = await client.getAttestations({
            indexingValue: normalizedAddress
        });

        if (!attestations || attestations.length === 0) {
            console.log("No attestations found for the given wallet address");
            return [];
        }

        console.log(`Found ${attestations.length} attestation(s) for the wallet address`);
        return attestations;
    } catch (error) {
        console.error("Error fetching vote attestations:", error);
        throw error;
    }
}