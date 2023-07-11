'use client';
import { ThirdwebProvider, ConnectWallet, metamaskWallet } from "@thirdweb-dev/react";

const WalletConnect = () => {

  return (
    <div className="flex items-center gap-3"> {/* Add your custom styling here */}
        <ConnectWallet theme="light"/>
    </div>
  );
}

export default WalletConnect;
