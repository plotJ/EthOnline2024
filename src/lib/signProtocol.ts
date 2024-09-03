import {
    SignProtocolClient,
    SpMode,
    EvmChains,
    delegateSignAttestation,
    delegateSignRevokeAttestation,
    delegateSignSchema,
} from "@ethsign/sp-sdk";
import { privateKeyToAccount } from 'viem/accounts';

const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
});

console.log("Sign Protocol client initialized");

export default client;
