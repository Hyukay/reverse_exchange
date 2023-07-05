import React from 'react';
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { hardhat } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { useNetwork } from 'wagmi';

const { chains, publicClient } = configureChains(
  [hardhat],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: 'http://127.0.0.1:8545',
      }),
    }),
  ]
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
