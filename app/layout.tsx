import { Nunito } from 'next/font/google'

import Navbar from '@/app/components/navbar/Navbar';
import LoginModal from '@/app/components/modals/LoginModal';
import RegisterModal from '@/app/components/modals/RegisterModal';
import SearchModal from '@/app/components/modals/SearchModal';
import PropertyListingModal from '@/app/components/modals/PropertyListingModal';

import ToasterProvider from '@/app/providers/ToasterProvider';

import './globals.css'
import ClientOnly from './components/ClientOnly';
import getCurrentUser from './actions/getCurrentUser';
import RootProvider from './providers';

export const metadata = {
  title: 'REverse',
  description: 'REverse',
}

const font = Nunito({ 
  subsets: ['latin'], 
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <RootProvider>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <SearchModal />
          <PropertyListingModal />
          <Navbar currentUser={currentUser} />
          </RootProvider>
          </ClientOnly>
        <div className="pb-20 pt-36">
          {children}
        </div>
      </body>
    </html>
  )
}