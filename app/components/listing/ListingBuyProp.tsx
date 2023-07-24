'use client'
import { useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import W3Button from "../W3Button";

const ESCROW_ADDRESS = "0x20D026Ed02d945d8456b8Fa5393F1FcCb78e8218";
const REAL_ESTATE_ADDRESS = "0xAd44cA225473B69022FEd05dE921b810B81a5ab0";

interface ListingBuyerProp {
  propertyID: number | null;
}

const ListingBuyer: React.FC<ListingBuyerProp> = ({ propertyID }) => {
  const { contract: escrow } = useContract(ESCROW_ADDRESS);
  const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);
  
  const { data: propertyData, isLoading: propertyLoading } = useContractRead(escrow, "properties", [propertyID]);
  const { mutateAsync: makeOffer, isLoading: offerLoading } = useContractWrite(escrow, "makeOffer");
  const price = propertyData ? ethers.utils.formatEther(propertyData.price.toString()) : 0;
  const {data: seller, isLoading: sellerLoading} = useContractRead(realEstate, "ownerOf", [propertyID]);
  const makeOfferHandler = async () => {
    try {
      const data = await makeOffer({ args: [propertyID, { value: ethers.utils.parseEther(propertyData.price.toString()) }] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  if (propertyLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Property ID: {propertyID}</h2>
      <p>Seller: {seller}</p>
      <p>Price: {price}</p>
      <W3Button 
        outline
        label={"Make Offer"}
        contractAddress={ESCROW_ADDRESS}
        action={async () => await makeOfferHandler()}
        isDisabled={offerLoading}
        onSuccess={(result) => console.log("Transaction successful", result)}
        onError={(error) => console.error("Transaction error", error)}
        onSubmit={() => console.log("Transaction pending...")}
      />
    </div>
  );
}

export default ListingBuyer;
