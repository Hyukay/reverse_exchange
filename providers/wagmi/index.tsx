import React from 'react';
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { hardhat, mainnet, optimism, polygon, sepolia, goerli, avalancheFuji } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { useNetwork } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'



const { chains, publicClient } = configureChains(
  [sepolia, goerli],
  [infuraProvider({ apiKey: "172a07d206ba44ceaae66501806bd268" })],
)

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
})

const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  const network = useNetwork();
  console.log(network);
  return <WagmiConfig config={config}>{children}</WagmiConfig>
};

export default WagmiProvider;
