"use client";

import React from "react";
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";



const RootProvider = ({ children }: { children: React.ReactNode }) => {


  return (
      <ThirdwebProvider 

      clientId={process.env.NEXT_PUBLIC_THIRDWEB_API_KEY || ''}

      sdkOptions={
        {
          secretKey: process.env.NEXT_PUBLIC_THIRDWEB_API_SECRET || '',
        }
      }
      
      supportedWallets={[metamaskWallet()]}
      activeChain={Sepolia}
      >
        {children}
      </ThirdwebProvider>
  );
};

export default RootProvider;
