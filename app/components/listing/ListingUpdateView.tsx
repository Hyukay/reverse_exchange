'use client'

import { useContractWrite, useContractRead, useContract, Web3Button, useAddress,  useCreateAuctionListing,
  useCreateDirectListing, 
  useCancelDirectListing,
  useCancelEnglishAuction,
  useValidDirectListings,
  useValidEnglishAuctions,

} from '@thirdweb-dev/react';
import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import Loader from '../Loader';
import Heading from '../Heading';
import { ESCROW_ADDRESS, REAL_ESTATE_ADDRESS } from "@/app/libs/constant";
import formatNumber from '@/app/libs/formatNumber';
import { NFT as NFTType, MarketplaceV3 } from '@thirdweb-dev/sdk'
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import toastStyle from "@/app/libs/toastConfig";
import styles from "../../styles/Sale.module.css";
import profileStyles from "../../styles/Profile.module.css";
import Input from "../inputs/Input";
import { useCheckAndProvideApproval } from '@/app/hooks/useCheckAndProvideApproval';


interface ListingUpdateViewProp {
    listingId: string | undefined;
    auctionId: string | undefined;
    realTokenId: string | undefined;
    nft?: NFTType;
    escrow: MarketplaceV3 | undefined;
}

type UpdateFormData = {
    nftContractAddress: string;
    tokenId: string;
    price: string;
    startDate: Date;
    endDate: Date;
    };


const ListingUpdateView: React.FC<ListingUpdateViewProp> = ({realTokenId, nft, escrow, listingId, auctionId}) => {
 
        
    const { checkAndProvideApproval } = useCheckAndProvideApproval(nft?.owner);

    const { contract: noHooksEscrow} = useContract(ESCROW_ADDRESS)

       // Hook provides an async function to update a listing
       const { mutateAsync: updateListing, isLoading }
       = useContractWrite(noHooksEscrow, "updateListing")
    
    // Manage form values using react-hook-form library: Direct form
        // Manage form values using react-hook-form library: Update form
        const { register: registerUpdate, handleSubmit: handleSubmitUpdate, formState: {errors: updateErrors} } =
        useForm<UpdateFormData>({
          defaultValues: {
            nftContractAddress: REAL_ESTATE_ADDRESS,
            tokenId: realTokenId,
            startDate: new Date(),
            endDate: new Date(),
            price: '0',
          },
        });     


        async function handleSubmissionUpdate(data: UpdateFormData) {

            await checkAndProvideApproval();
      
            const txResult = await updateListing({ args: [
              auctionId,
              {
              assetContractAddress: data.nftContractAddress,
              tokenId: data.tokenId,
              pricePerToken: data.price,
              startTimestamp: new Date(data.startDate),
              endTimestamp: new Date(data.endDate),
            }
            ]});
            return txResult;
          }

return (
    <div>
         <>
        <Heading
          title='Update Listing'
          subtitle=''
        />
      {/* Update listing fields */}
      <div
        className={`${
            styles.activeTabContent
        }`}
        style={{ flexDirection: "column" }}
      >
        {/* Input field for auction start date */}
        <legend className={styles.legend}>New Start Date</legend>
        <Input<UpdateFormData>
          id="startDate"
          type="datetime-local"
          register={registerUpdate}
          errors = {updateErrors}
          label="Listing Start Date"
        />

        {/* Input field for auction end date */}
        <legend className={styles.legend}> Listing Ends on </legend>
        <Input<UpdateFormData>
          id="endDate"
          type="datetime-local"
          register={registerUpdate}
          errors = {updateErrors}
          label="Listing End Date"
        />
        <h4 className={styles.formSectionTitle}>New Price</h4>

        {/* Input field for buyout price */}
        <legend className={styles.legend}>Price</legend>
        <Input<UpdateFormData>
          id="price"
          type="number"
          register={registerUpdate}
          errors = {updateErrors}
          label = "Your Price"
        />

        <Web3Button
          contractAddress={ESCROW_ADDRESS}
          action={async () => {
            await handleSubmitUpdate(handleSubmissionUpdate)();
          }}
          onError={(error) => {
            toast(`Updating Listing Failed! Reason: ${error.cause}`, {
              icon: "❌",
              style: toastStyle,
              position: "bottom-center",
            });
          }}
          onSuccess={(txResult) => {
            toast("Listing Updated Successfully!", {
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
          Update Listing
        </Web3Button>
      </div>
      </>
    </div>
    )
}

export default ListingUpdateView;