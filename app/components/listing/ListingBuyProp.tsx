'use client'

import { useContractWrite, useContractRead, useContract, Web3Button, useAddress,  useCreateAuctionListing,
  useCreateDirectListing, 
  useCancelDirectListing,
  useCancelEnglishAuction,
  useValidDirectListings,
  useValidEnglishAuctions,

} from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import W3Button from "../W3Button";
import Heading from "../Heading";
import Loader from "../Loader";
import { ESCROW_ADDRESS, REAL_ESTATE_ADDRESS} from "@/app/libs/constant";
import Input from "../inputs/Input";
import { EnglishAuction, DirectListingV3, NFT as NFTType} from '@thirdweb-dev/sdk'
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import toastStyle from "@/app/libs/toastConfig";
import styles from "../../styles/Token.module.css";
import profileStyles from "../../styles/Profile.module.css";
import Button from "../Button";
import { useMemo, useState } from "react";
import formatNumber  from "@/app/libs/formatNumber";
import Placeholder from "../Placeholder";
import { useRouter } from "next/navigation";
import axios from "axios";
import NoListing from "./NoListing";

interface ListingBuyerProp {
  account : string | undefined
  id : string;
  tokenId: number | null;
  nft?: NFTType;
}



const ListingBuyer: React.FC<ListingBuyerProp> = ({id, tokenId, nft }) => {

  
  const [bidValue, setBidValue] = useState<string>();
  const router = useRouter();

  // Connect to escrow contract
  const { contract: escrow, isLoading: loadingContract} = useContract(
    ESCROW_ADDRESS,
    "marketplace-v3"
  );

  const { contract: noHooksEscrow} = useContract(ESCROW_ADDRESS)
    
  // useContract is a React hook that returns an object with the contract key.
  // The value of the contract key is an instance of an REAL_ESTATE_ADDRESS on the blockchain.
  // This instance is created from the contract address (REAL_ESTATE_ADDRESS)
  const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);



  const { data: directListingHook, isLoading: loadingValidDirect, isError: errorValidDirect } =
  useValidDirectListings(escrow, {
    tokenContract: REAL_ESTATE_ADDRESS,
    tokenId: nft?.metadata.id,
  });

  const { data: auctionListingHook, isLoading: loadingValidAuction, isError: errorValidAuction } =
  useValidEnglishAuctions(escrow, {
    tokenContract: REAL_ESTATE_ADDRESS,
    tokenId: nft?.metadata.id,
  });

  const directListing = useMemo(() => {directListingHook}, [directListingHook]) as DirectListingV3[] | undefined;
  const auctionListing = useMemo(() => {auctionListingHook}, [auctionListingHook]) as EnglishAuction[] | undefined;

  console.log('auctionListing', auctionListing)
  async function createBidOrOffer() {
    let txResult;
    if (!bidValue) {
      toast(`Please enter a bid value`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
      return;
    }

    if (auctionListing?.[0]) {
      txResult = await escrow?.englishAuctions.makeBid(
        auctionListing[0].id,
        bidValue
      );
    } else if (directListing?.[0]) {
      txResult = await escrow?.offers.makeOffer({
        assetContractAddress: ESCROW_ADDRESS,
        tokenId: nft?.metadata.id ||'0',
        totalPrice: bidValue,
      });
    } else {
      throw new Error("No valid listing found for this NFT");
    }

    return txResult;
  }

  async function buyListing() {
    let txResult;

    if (auctionListing?.[0]) {
      txResult = await escrow?.englishAuctions.buyoutAuction(
        auctionListing[0].id
      );
    } else if (directListing?.[0]) {
      txResult = await escrow?.directListings.buyFromListing(
        directListing[0].id,
        1
      );
    } else {
      throw new Error("No valid listing found for this NFT");
    }
    return txResult;
  }
  // return NoListing if there is no auction or direct listing
  // if (!auctionListing?.[0] && !directListing?.[0]) {
  //   return <NoListing />;
  // }
  
return (
  <div className={styles.pricingContainer}>
    <div className={styles.pricingInfo}>
      <p className={styles.label}>Price</p>
      <div className={styles.pricingValue}>
        {
          loadingContract || loadingValidDirect || loadingValidAuction ? (
            <Placeholder width="120" height="24" />
          ) : (
            <>
              {
                directListing && directListing[0] ? (
                  <>
                    {directListing[0]?.currencyValuePerToken.displayValue}
                    {" " + directListing[0]?.currencyValuePerToken.symbol}
                  </>
                ) : auctionListing && auctionListing[0] ? (
                  <>
                    {auctionListing[0]?.buyoutCurrencyValue.displayValue}
                    {" " + auctionListing[0]?.buyoutCurrencyValue.symbol}
                  </>
                )
                : (
                  <Placeholder width="120" height="24" />
                )
              }
            </>
          )
        }
      </div>
      <div>
        {
          loadingValidAuction ? (
            <Placeholder width="120" height="24" />
          ) : (
            <>
              {
                auctionListing && auctionListing[0] && (
                  <>
                    <p className={styles.label} style={{ marginTop: 12 }}>
                      Bids starting from
                    </p>
                    <div className={styles.pricingValue}>
                      {
                        auctionListing[0]?.minimumBidCurrencyValue.displayValue
                      }
                      {" " + auctionListing[0]?.minimumBidCurrencyValue.symbol}
                    </div>
                  </>
                )
              }
            </>
          )
        }
      </div>
    </div>

  {
    loadingContract || loadingValidDirect || loadingValidAuction ? (
      <Placeholder width="100%" height="164" />
    ) : (
      <>
        <Web3Button
          contractAddress={ESCROW_ADDRESS}
          action={async () => await buyListing()}
          className={styles.btn}
          onSuccess={() => {
            try {
            axios.patch(`/api/listings/${id}`, {
              status: "SOLD",
            });
          } catch (error) {
            console.log(error);
          }
            toast(`Purchase success!`, {
              icon: "✅",
              style: toastStyle,
              position: "bottom-center",
            });

            router.refresh();
          }}
          onError={(e) => {
            toast(`Purchase failed! Reason: ${e.message}`, {
              icon: "❌",
              style: toastStyle,
              position: "bottom-center",
            });
          }}
        >
          Buy at asking price
        </Web3Button>

        <div className={`${styles.listingTimeContainer} ${styles.or}`}>
          <p className={styles.listingTime}>or</p>
        </div>

        <input
          className={styles.input}
          defaultValue={
            auctionListing?.[0]?.minimumBidCurrencyValue?.displayValue || 0
          }
          type="number"
          onChange={(e) => setBidValue(e.target.value)}
        />

        <Web3Button
          contractAddress={ESCROW_ADDRESS}
          action={async () => await createBidOrOffer()}
          className={styles.btn}
          onSuccess={() => {
            //change the owner in the db to the new owner
            toast(`Bid success!`, {
              icon: "✅",
              style: toastStyle,
              position: "bottom-center",
            });
            router.refresh();
          }}
          onError={(e) => {
            console.log(e);
            toast(`Bid failed! Reason: ${e.message}`, {
              icon: "❌",
              style: toastStyle,
              position: "bottom-center",
            });
          }}
        >
          Place bid
        </Web3Button>
      </>
    )
  }

  </div>
);
}




export default ListingBuyer;


