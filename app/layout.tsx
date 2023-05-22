"use client"
import { Nunito } from 'next/font/google'

import Navbar from '@/app/components/navbar/Navbar';
import LoginModal from '@/app/components/modals/LoginModal';
import RegisterModal from '@/app/components/modals/RegisterModal';
import SearchModal from '@/app/components/modals/SearchModal';
import RentModal from '@/app/components/modals/RentModal';

import ToasterProvider from '@/app/providers/ToasterProvider';

import './globals.css'
import ClientOnly from './components/ClientOnly';
import getCurrentUser from './actions/getCurrentUser';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {goerli, localhost } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';


// export const metadata = {
//   title: 'REverse',
//   description: 'REverse',
// }

const font = Nunito({ 
  subsets: ['latin'], 
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { chains, publicClient } = configureChains(
    [goerli, localhost],
    [
      infuraProvider({ apiKey: process.env.INFURA_API_KEY!}),
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'REverse',
    projectId: '0c53e71e09c0adc5d8339ed289ae0035',
    chains
  });
  
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
        <ClientOnly>
          <ConnectButton />
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <SearchModal />
          <RentModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">
          {children}
        </div>
        </RainbowKitProvider>
      </WagmiConfig>
      </body>
    </html>
  )
}
