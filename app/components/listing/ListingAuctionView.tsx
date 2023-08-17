'use client'


/**
 * @author Khalil Anis Zabat
 */



import {  Web3Button, useCreateAuctionListing } from '@thirdweb-dev/react';
import React from "react";
import { ESCROW_ADDRESS, REAL_ESTATE_ADDRESS } from "@/app/libs/constant";
import { NFT as NFTType, MarketplaceV3 } from '@thirdweb-dev/sdk'
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import toastStyle from "@/app/libs/toastConfig";
import styles from "../../styles/Sale.module.css";
import Input from "../inputs/Input";
import { useCheckAndProvideApproval } from '@/app/hooks/useCheckAndProvideApproval';
import { useRouter } from 'next/navigation';


interface ListingAuctionViewProp {
    tokenId: number | null;
    nft?: NFTType;
    escrow: MarketplaceV3 | undefined;
    }
type AuctionFormData = {

nftContractAddress: string;
tokenId: string;
startDate: Date;
endDate: Date;
floorPrice: string;
buyoutPrice: string;
};






const ListingAuctionView: React.FC<ListingAuctionViewProp> = ({tokenId, nft, escrow}) => {

    const router = useRouter();
        
    // Hook provides an async function to create a new auction listing
    const { mutateAsync: createAuctionListing } =
    useCreateAuctionListing(escrow);

    const { checkAndProvideApproval } = useCheckAndProvideApproval(nft?.owner);

    // Manage form values using react-hook-form library: Auction form
    let { register: registerAuction, handleSubmit: handleSubmitAuction, formState: {errors: auctionErrors}} =
    useForm<AuctionFormData>({
        defaultValues: {
        nftContractAddress: REAL_ESTATE_ADDRESS,
        tokenId: nft?.metadata.id,
        startDate: new Date(),
        endDate: new Date(),
        floorPrice: "0",
        buyoutPrice: "0",
        },
    });

    async function handleSubmissionAuction(data: AuctionFormData) {

        await checkAndProvideApproval();
        const txResult = await createAuctionListing({
          tokenId: data.tokenId,
          assetContractAddress: data.nftContractAddress,
          buyoutBidAmount: data.buyoutPrice,
          minimumBidAmount: data.floorPrice,
          startTimestamp: new Date(data.startDate),
          endTimestamp: new Date(data.endDate),
        });
    
        return txResult;
      }



return (

        <>
         {/* Auction listing fields */}
       
          <h4 className={styles.formSectionTitle}>Auction It</h4>
  
          {/* Input field for auction start date */}
          <legend className={styles.legend}>Begin</legend>
          <Input<AuctionFormData>
            id = 'startDate'
            type="datetime-local"
            register = {registerAuction}
            errors={auctionErrors}
            label="Auction Start Date"
          />
  
          {/* Input field for auction end date */}
          <legend className={styles.legend}>End</legend>
          <Input<AuctionFormData>
            id = 'endDate'
            type="datetime-local"
            register={registerAuction}
            errors={auctionErrors}
            label="Auction End Date"
          />
          <h4 className={styles.formSectionTitle}>Set the Prices </h4>
  
          {/* Input field for minimum bid price */}
          <legend className={styles.legend}> Allow bids starting from </legend>
          <Input<AuctionFormData>
            id="floorPrice"
            type="number"
            register={registerAuction}
            errors={auctionErrors}
            label='Minimum bid price'
          />
  
          {/* Input field for buyout price */}
          <legend className={styles.legend}> Buyout price </legend>
          <Input<AuctionFormData>
            id = 'buyoutPrice'
            type="number"
            register={registerAuction}
            errors={auctionErrors}
            label="Buyout price"
          />
  
          <Web3Button
            contractAddress={ESCROW_ADDRESS}
            isDisabled={!nft}
            action={async () => {
              return await handleSubmitAuction(handleSubmissionAuction)();
            }}
            onError={(error) => {
              toast(`Listed Failed! Reason: ${error.cause}`, {
                icon: "❌",
                style: toastStyle,
                position: "bottom-center",
              });
            }}
            onSuccess={(txResult) => {
              toast("Listed Successfully!", {
                icon: "🥳",
                style: toastStyle,
                position: "bottom-center",
              });
              router.refresh();
             /*router.push(
                `/token/${REAL_ESTATE_ADDRESS}/${nft.metadata.id}`
              );*/
            }}
          >
            Create Auction Listing
          </Web3Button>
          
      </>
    
);

}


export default ListingAuctionView
