'use client';
import RootProvider from "@/app/providers";
import wagmiConfig from "@/wagmi.config";
import { ThirdwebProvider, ConnectWallet, metamaskWallet, walletConnect } from "@thirdweb-dev/react";

const WalletConnect = () => {

  return (
    <div className="flex items-center gap-3"> {/* Add your custom styling here */}
      <RootProvider>
        <ConnectWallet theme="light"/>
      </RootProvider>
    </div>
  );
}

export default WalletConnect;
