
// Imports
// ========================================================
import React from 'react';
import { WagmiConfig, createConfig, configureChains} from "wagmi";
import { getDefaultProvider } from 'ethers';
import { w3mProvider } from '@web3modal/ethereum';
import { arbitrum, mainnet, polygon, goerli, sepolia, localhost, hardhat } from 'wagmi/chains';
import { w3mConnectors } from '@web3modal/ethereum';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { InjectedConnector } from '@wagmi/connectors/injected';

// Chains
// ========================================================
const chains = [arbitrum, mainnet, polygon, goerli, sepolia, localhost, hardhat]
const projectId = '7095620307efa91937271a9860d12dc3'

// Config
// ========================================================
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])



const client = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    publicClient
});

// Provider
// ========================================================
const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
    return <WagmiConfig config={client}>{children}</WagmiConfig>
};

// Exports
// ========================================================
export default WagmiProvider;

