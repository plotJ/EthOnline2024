import {
    SignProtocolClient,
    SpMode,
    EvmChains,
    delegateSignAttestation,
    delegateSignRevokeAttestation,
    delegateSignSchema,
} from '@ethsign/sp-sdk';
//import { privateKeyToAccount } from 'viem/accounts'; // Ensure this is imported
import { VoterAttestation } from "../schemas/voterAttestationSchema";
import client from '@/lib/signProtocol'; // Ensure this imports the correct client

const signClient = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.sepolia,
//    account: privateKeyToAccount('your-private-key'), // optional
});

export async function generateVoterAttestation(walletAddress: string, ballotId: number): Promise<VoterAttestation> {
    const attestation = await signClient.createAttestation({
        subject: walletAddress,
        data: { ballotId, timestamp: Date.now() },
    });
    return attestation;
}

export async function verifyVoterAttestation(walletAddress: string) {
    try {
        const response = await client.getAttestation(walletAddress.toLowerCase());
        if (response && response.data && response.data.eligibleToVote) {
            console.log("Voter attestation verified successfully");
            return true;
        }
        console.log("Voter attestation not found or ineligible");
        return false;
    } catch (error) {
        console.error("Error verifying voter attestation:", error);
        return false;
    }
}

export async function fetchAttestation(walletAddress: string): Promise<VoterAttestation | null> {
    const attestation = await signClient.getAttestation(walletAddress);
    return attestation ? attestation.data : null; // Assuming the data contains the schema
}

export async function createVoterAttestationSchema() {
    const schema = await client.createSchema({
        name: "VoterAttestation",
        data: [
            { name: "walletAddress", type: "address" },
            { name: "eligibleToVote", type: "bool" },
            { name: "registrationTimestamp", type: "uint256" }
        ]
    });
    return schema.schemaId;
}

export async function createVoterAttestation(walletAddress: string) {
    try {
        const schemaId = await createVoterAttestationSchema(); // Ensure schema is created
        const attestation = await signClient.createAttestation({
            schemaId: schemaId,
            data: {
                walletAddress: walletAddress,
                eligibleToVote: true,
                registrationTimestamp: Math.floor(Date.now() / 1000)
            },
            indexingValue: walletAddress.toLowerCase()
        });
        console.log("Voter attestation created successfully");
        console.log("Attestation ID:", attestation.attestationId);
        return attestation.attestationId;
    } catch (error) {
        console.error("Error creating voter attestation:", error);
    }
}

export async function attestVote(ballotId: number, choice: number, walletAddress: string) {
    const voteAttestation = await client.createAttestation({
        schemaId: "voteSchemaId", // Create a new schema for votes
        data: {
            ballotId: ballotId,
            choice: choice,
            voterAddress: walletAddress
        },
        indexingValue: `${ballotId}-${walletAddress}`
    });
    return voteAttestation.attestationId;
}

export async function getVoteAttestations(ballotId: number) {
    const response = await client.getAttestations({
        schemaId: "voteSchemaId", // Ensure this schema is created
        indexingValue: ballotId
    });
    return response.data;
}
