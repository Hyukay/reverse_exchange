
// Imports
// ========================================================
import React from 'react';
import { WagmiConfig, createConfig, configureChains} from "wagmi";
import { getDefaultProvider } from 'ethers';
import { w3mProvider } from '@web3modal/ethereum';
import { arbitrum, mainnet, polygon, goerli, sepolia, localhost, hardhat } from 'wagmi/chains';
import { w3mConnectors } from '@web3modal/ethereum';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { env } from 'process';
 

const { chains, publicClient } = configureChains(
  [hardhat,localhost,sepolia],
  [infuraProvider({ apiKey: "172a07d206ba44ceaae66501806bd268" }), publicProvider()],
)
 
const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
})

// Chains
// ========================================================
const projectId = '7095620307efa91937271a9860d12dc3'

// Config
// ========================================================



// Provider
// ========================================================
const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
    return <WagmiConfig config={config}>{children}</WagmiConfig>
};

// Exports
// ========================================================
export default WagmiProvider;

