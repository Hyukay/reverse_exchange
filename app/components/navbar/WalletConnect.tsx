'use client';

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal, Web3Button } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig, useAccount } from 'wagmi';
import { arbitrum, mainnet, polygon, goerli } from 'wagmi/chains';

const chains = [arbitrum, mainnet, polygon, goerli]
const projectId = '7095620307efa91937271a9860d12dc3'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

const WalletConnect = () => {
  const  account  = useAccount();
  return (
    <div className="flex items-center gap-3"> {/* Add your custom styling here */}
      <WagmiConfig config={wagmiConfig}>
        <Web3Button/>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </WagmiConfig>
    </div>
  );
}

export default WalletConnect;
