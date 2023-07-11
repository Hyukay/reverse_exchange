"use client";

import React from "react";
import { ThirdwebProvider, metamaskWallet, ThirdwebSDKProvider,coinbaseWallet } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const RootProvider = ({ children }: { children: React.ReactNode }) => {

    

  return (
      <ThirdwebProvider 
      supportedWallets={[metamaskWallet()]}
      activeChain={Sepolia}
      >
        {children}
      </ThirdwebProvider>
  );
};

export default RootProvider;
