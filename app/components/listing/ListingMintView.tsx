'use client'


/**
 * @author Khalil Anis Zabat
 */

import { useContractWrite, Web3Button, useAddress,
  
  } from '@thirdweb-dev/react';
  import React, {useCallback } from "react";
  import axios from 'axios';
  import Heading from '../Heading';
  import { REAL_ESTATE_ADDRESS } from "@/app/libs/constant";
  import { NFT as NFTType } from '@thirdweb-dev/sdk'
  import toast from "react-hot-toast";
  import toastStyle from "@/app/libs/toastConfig";
  import styles from "../../styles/Sale.module.css";
  import { useCheckAndProvideApproval } from '@/app/hooks/useCheckAndProvideApproval';
  import { SmartContract } from '@thirdweb-dev/sdk';
  import { useRouter } from 'next/navigation';

interface ListingMintViewProps {

    id: string;
    tokenId: number | null;
    ipfsUri: string | null;
    nft?: NFTType | undefined;
    realEstate:  SmartContract<BaseContract> | undefined

}

const ListingMintView: React.FC<ListingMintViewProps> = ({id, tokenId, ipfsUri, nft, realEstate }) => {

    const account = useAddress();

    const router = useRouter();

    
    const { mutateAsync: mintTo, isLoading: mintLoading } = useContractWrite(realEstate, "mintTo");
   
    const setListingTokenId = useCallback(async (_tokenId: string) => {

      const tokenId = parseInt(_tokenId);
      try {
        await axios.patch(`/api/listings/${id}`, { tokenId });
        console.log('listing updated');
        toast.success('Listing updated');
      } catch (error) {
        console.log('Error:', error);
        toast.error('Error updating listing');
      }
    }, [id]);

  
      const mintProperty = useCallback(async () => {

        try {

          const data = await mintTo({ args: [account,ipfsUri] });
          const bigNumberTokenId = data.receipt?.logs[0].topics[3];
          setListingTokenId(bigNumberTokenId);
          console.info('contract call successs', data);
          toast.success('Property minted successfully');

      } catch (err) {
          console.error("contract call failure", err);
          toast.error( "An error occurred while minting the property");
      }
      
      }, [mintTo, ipfsUri, setListingTokenId, account]);
    


    return(
    <>
      <Heading
        title='You Can Mint Your Property Now!'
        subtitle=''
      />
      <div
        className={`${
          styles.activeTabContent
        }`}
        style={{ flexDirection: "column" }}
      >
        <Web3Button
          contractAddress={REAL_ESTATE_ADDRESS}
          action={async () => { 
            await mintProperty()
            }
          }
          isDisabled={mintLoading}
          onError={(error) => {
            toast(`Minting property failed! Reason: ${error.cause}`, {
              icon: "❌",
              style: toastStyle,
              position: "bottom-center",
            });
          }}
          onSuccess={() => {
            toast("Your Property Got Minted Successfully!", {
              icon: "🥳",
              style: toastStyle,
              position: "bottom-center",
            });
            //if mintLoading is false, refresh router()
            if (!mintLoading) {
              router.refresh();
            }
            
            
            /*
            router.push(
              `/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`
            );*/
          }}
        >
          Mint Property
        </Web3Button>
      </div>
    </>
    )

}

export default ListingMintView;

import { BaseContract } from 'ethers';

