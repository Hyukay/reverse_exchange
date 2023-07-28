'use client'

import { useContractWrite, useContractRead, useContract, Web3Button, useAddress,  useCreateAuctionListing,
  useCreateDirectListing, 
  useCancelDirectListing,
  useCancelEnglishAuction,
  useValidDirectListings,

} from '@thirdweb-dev/react';
import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import Loader from '../Loader';
import Heading from '../Heading';
import { ESCROW_ADDRESS, REAL_ESTATE_ADDRESS } from "@/app/libs/constant";
import formatNumber from '@/app/libs/formatNumber';
import { NFT as NFTType } from '@thirdweb-dev/sdk'
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import toastStyle from "@/app/libs/toastConfig";
import styles from "../../styles/Sale.module.css";
import profileStyles from "../../styles/Profile.module.css";
import Input from "../inputs/Input";



interface sellerProps {

  id: string;
  tokenId: number | null;
  price: number;
  ipfsUri: string | null;
  nft?: NFTType | undefined;

}

type AuctionFormData = {
  nftContractAddress: string;
  tokenId: string;
  startDate: Date;
  endDate: Date;
  floorPrice: string;
  buyoutPrice: string;
};

type DirectFormData = {
  nftContractAddress: string;
  tokenId: string;
  price: string;
  startDate: Date;
  endDate: Date;
};

type UpdateFormData = {
  nftContractAddress: string;
  tokenId: string;
  price: string;
  startDate: Date;
  endDate: Date;
};



const ListingSellerProp: React.FC<sellerProps> = ({id, tokenId, price, ipfsUri, nft}) => {

    const  account  = useAddress();
    

    // Connect to marketplace contract
    const { contract: escrow } = useContract(
      ESCROW_ADDRESS,
      "marketplace-v3"
    );

    const { contract: noHooksEscrow} = useContract(ESCROW_ADDRESS)
      
    // useContract is a React hook that returns an object with the contract key.
    // The value of the contract key is an instance of an REAL_ESTATE_ADDRESS on the blockchain.
    // This instance is created from the contract address (REAL_ESTATE_ADDRESS)
    const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);

    // Hook provides an async function to create a new auction listing
    const { mutateAsync: createAuctionListing } =
      useCreateAuctionListing(escrow);
  
    // Hook provides an async function to create a new direct listing
    const { mutateAsync: createDirectListing } =
      useCreateDirectListing(escrow);

    // Hook provides an async function to update a listing
    const { mutateAsync: updateListing, isLoading }
     = useContractWrite(noHooksEscrow, "updateListing")
      
    // Hook provides an async function to cancel a direct listing
    const { mutateAsync: cancelListing } =
      useCancelDirectListing(escrow);
    
    const { data: directListing, isLoading: loadingDirect } =
      useValidDirectListings(escrow, {
        tokenContract: REAL_ESTATE_ADDRESS,
        tokenId: nft?.metadata.id,
      });

    const listingId = directListing?.[0]?.id;

    // Manage form submission state using tabs and conditional rendering
    const [tab, setTab] = useState<"direct" | "auction">("direct");
      
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
  
    // Manage form values using react-hook-form library: Direct form
    let { register: registerDirect, handleSubmit: handleSubmitDirect, formState: {errors: directErrors} } =
      useForm<DirectFormData>({
        defaultValues: {
          nftContractAddress: REAL_ESTATE_ADDRESS,
          tokenId: nft?.metadata.id,
          startDate: new Date(),
          endDate: new Date(),
          price: "0",
        },
      });

    // Manage form values using react-hook-form library: Update form
    const { register: registerUpdate, handleSubmit: handleSubmitUpdate, formState: {errors: updateErrors} } =
      useForm<UpdateFormData>({
        defaultValues: {
          nftContractAddress: REAL_ESTATE_ADDRESS,
          tokenId: nft?.metadata.id,
          startDate: new Date(),
          endDate: new Date(),
          price: "0",
        },
      });


    // User requires to set escrow approval before listing
    async function checkAndProvideApproval() {
      // Check if approval is required
      const hasApproval = await realEstate?.call("isApprovedForAll", [
        nft?.owner,
        ESCROW_ADDRESS,
      ]);
  
      // If it is, provide approval
      if (!hasApproval) {
        const txResult = await realEstate?.call("setApprovalForAll", [
          ESCROW_ADDRESS,
          true,
        ]);
  
        if (txResult) {
          toast.success("Marketplace approval granted", {
            icon: "👍",
            style: toastStyle,
            position: "bottom-center",
          });
        }
      }
  
      return true;
    }
  
    async function handleSubmissionAuction(data: AuctionFormData) {

      await checkAndProvideApproval();
      const txResult = await createAuctionListing({
        assetContractAddress: data.nftContractAddress,
        tokenId: data.tokenId,
        buyoutBidAmount: data.buyoutPrice,
        minimumBidAmount: data.floorPrice,
        startTimestamp: new Date(data.startDate),
        endTimestamp: new Date(data.endDate),
      });
  
      return txResult;
    }
  
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

    async function handleSubmissionUpdate(data: UpdateFormData) {

      await checkAndProvideApproval();

      const txResult = await updateListing({ args: [
        listingId,
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

  
    const [hasLoaded, setHasLoaded] = useState(false);
    
    const [tokenIdd, setTokenIdd] = useState<number | null>(null);
    
    const { data: tokenURI, isLoading: tokenURILoading } = useContractRead(realEstate, "tokenURI", [tokenIdd]);
    

    const { mutateAsync: approve, isLoading: approveLoading } = useContractWrite(realEstate, "approve");
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
      setTokenIdd(tokenId);
    }, [id, setTokenIdd]);

  
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



    // Then, in your useEffect
    useEffect(() => {
      if (!tokenURILoading) {
        setHasLoaded(true);
      }
      if(tokenId!==null) {
        setTokenIdd(tokenId)
      }
    }, [tokenURILoading, tokenId]);



let bodyContent;
if (!hasLoaded || tokenURILoading) {
  bodyContent = <div>Loading...<Loader /></div>;
} else if (tokenURI) {
  bodyContent = (
  <>
      <div className={profileStyles.tabs}>
        <h3
          className={`${profileStyles.tab} 
      ${tab === "direct" ? profileStyles.activeTab : ""}`}
          onClick={() => setTab("direct")}
        >
          Direct
        </h3>
        <h3
          className={`${profileStyles.tab} 
      ${tab === "auction" ? profileStyles.activeTab : ""}`}
          onClick={() => setTab("auction")}
        >
          Auction
        </h3>
      </div>

      {/* Direct listing fields */}
      <div
        className={`${
          tab === "direct"
            ? styles.activeTabContent
            : profileStyles.tabContent
        }`}
        style={{ flexDirection: "column" }}
      >
        <h4 className={styles.formSectionTitle}>When </h4>

        {/* Input field for auction start date */}
        <legend className={styles.legend}> Listing Starts on </legend>
        <Input<DirectFormData>
          id="startDate"
          type="datetime-local"
          register={registerDirect}
          errors = {directErrors}
          label="Auction Start Date"
        />

        {/* Input field for auction end date */}
        <legend className={styles.legend}> Listing Ends on </legend>
        <Input<DirectFormData>
          id="endDate"
          type="datetime-local"
          register={registerDirect}
          errors = {directErrors}
          label="Auction End Date"
        />
        <h4 className={styles.formSectionTitle}>Price </h4>

        {/* Input field for buyout price */}
        <legend className={styles.legend}> Price per token</legend>
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
          Create Direct Listing
        </Web3Button>
      </div>

      {/* Auction listing fields */}
      <div
        className={`${
          tab === "auction"
            ? styles.activeTabContent
            : profileStyles.tabContent
        }`}
        style={{ flexDirection: "column" }}
      >
        <h4 className={styles.formSectionTitle}>When </h4>

        {/* Input field for auction start date */}
        <legend className={styles.legend}> Auction Starts on </legend>
        <Input<AuctionFormData>
          id = 'startDate'
          type="datetime-local"
          register = {registerAuction}
          errors={auctionErrors}
          label="Auction Start Date"
        />

        {/* Input field for auction end date */}
        <legend className={styles.legend}> Auction Ends on </legend>
        <Input<AuctionFormData>
          id = 'endDate'
          type="datetime-local"
          register={registerAuction}
          errors={auctionErrors}
          label="Auction End Date"
        />
        <h4 className={styles.formSectionTitle}>Price </h4>

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
           /*router.push(
              `/token/${REAL_ESTATE_ADDRESS}/${nft.metadata.id}`
            );*/
          }}
        >
          Create Auction Listing
        </Web3Button>
      </div>
    </>
    );
}
// If the NFT has a tokenURI and is listed for sale, show the option to update the listing
else if (tokenURI && directListing) {
  bodyContent = (
    <>
        <h3>
          Update Listing
        </h3>
      {/* Update listing fields */}
      <div
        className={`${
            styles.activeTabContent
        }`}
        style={{ flexDirection: "column" }}
      >
        <h4 className={styles.formSectionTitle}>When </h4>

        {/* Input field for auction start date */}
        <legend className={styles.legend}> Listing Starts on </legend>
        <Input<UpdateFormData>
          id="startDate"
          type="datetime-local"
          register={registerUpdate}
          errors = {updateErrors}
          label="Auction Start Date"
        />

        {/* Input field for auction end date */}
        <legend className={styles.legend}> Listing Ends on </legend>
        <Input<UpdateFormData>
          id="endDate"
          type="datetime-local"
          register={registerUpdate}
          errors = {updateErrors}
          label="Auction End Date"
        />
        <h4 className={styles.formSectionTitle}>Price </h4>

        {/* Input field for buyout price */}
        <legend className={styles.legend}> Price per token</legend>
        <Input<UpdateFormData>
          id="price"
          type="number"
          register={registerUpdate}
          errors = {updateErrors}
          label = "Price"
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
  );
}

  return (
    <div>
        {bodyContent}
    </div>
)
  }

export default React.memo(ListingSellerProp);
