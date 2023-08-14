'use client'


/**
 * @author Khalil Anis Zabat
 */


import { Web3Button, useCreateDirectListing } from '@thirdweb-dev/react';
import React, { useState, useCallback, useEffect } from "react";
import { ESCROW_ADDRESS, REAL_ESTATE_ADDRESS } from "@/app/libs/constant";
import { MarketplaceV3, NFT as NFTType } from '@thirdweb-dev/sdk'
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import toastStyle from "@/app/libs/toastConfig";
import styles from "../../styles/Sale.module.css";
import Input from "../inputs/Input";
import { useCheckAndProvideApproval } from '@/app/hooks/useCheckAndProvideApproval';


interface ListingDirectViewProps {
    tokenId: number | null;
    nft?: NFTType;
    escrow: MarketplaceV3 | undefined;
    }

type DirectFormData = {
    nftContractAddress: string;
    tokenId: string;
    price: string;
    startDate: Date;
    endDate: Date;
    };


const ListingDirectView: React.FC<ListingDirectViewProps> = ({tokenId, nft, escrow}) => {


  
    
    // Hook provides an async function to create a new direct listing
    const { mutateAsync: createDirectListing } =
      useCreateDirectListing(escrow);

    

    const { checkAndProvideApproval } = useCheckAndProvideApproval(nft?.owner);


    // Manage form values using react-hook-form library: Direct form
    let { register: registerDirect, handleSubmit: handleSubmitDirect, formState: {errors: directErrors} } =
      useForm<DirectFormData>({
        defaultValues: {
          nftContractAddress: REAL_ESTATE_ADDRESS,
          tokenId: nft?.metadata.id,
          startDate: new Date(),
          endDate: new Date(),
          price: '0',
        },
      });
  
    async function handleSubmissionDirect(data: DirectFormData) {
      await checkAndProvideApproval();

      const txResult = await createDirectListing({
        assetContractAddress: data.nftContractAddress,
        tokenId: data.tokenId,
        pricePerToken: data.price,
        startTimestamp: new Date(data.startDate),
        endTimestamp: new Date(data.endDate),
      });
  
      return txResult;
    }


return (
    
        <>
           {/* Direct listing fields */}
            <h4 className={styles.formSectionTitle}>Listing Duration</h4>

            {/* Input field for auction start date */}
            <legend className={styles.legend}> Start Date and Time</legend>
            <Input<DirectFormData>
            id="startDate"
            type="datetime-local"
            register={registerDirect}
            errors = {directErrors}
            label="Start of Listing"
            />

            {/* Input field for auction end date */}
            <legend className={styles.legend}> Listing Ends on </legend>
            <Input<DirectFormData>
            id="endDate"
            type="datetime-local"
            register={registerDirect}
            errors = {directErrors}
            label="End of Listing"
            />
            <h4 className={styles.formSectionTitle}>Price </h4>

            {/* Input field for buyout price */}
            <legend className={styles.legend}>Your Price</legend>
            <Input<DirectFormData>
            id="price"
            type="number"
            register={registerDirect}
            errors = {directErrors}
            label = "Price"
            />

            <Web3Button
            contractAddress={ESCROW_ADDRESS}
            action={async () => {
                await handleSubmitDirect(handleSubmissionDirect)();
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
                /*
                router.push(
                `/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`
                );*/
            }}
            >
            Create Listing
            </Web3Button>
                </>
    
);

}


export default ListingDirectView;
