import { useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import W3Button from "../W3Button";
import Heading from "../Heading";
import Loader from "../Loader";
import { useForm } from "react-hook-form";
import { ESCROW_ADDRESS } from "@/app/libs/constant";
import Input from "../inputs/Input";
import { get } from "http";

interface ListingBuyerProp {
  propertyID: number | null;
}

type PriceForm = {
  price: string;
}

const ListingBuyer: React.FC<ListingBuyerProp> = ({ propertyID }) => {


  const { contract: escrow } = useContract(ESCROW_ADDRESS);
  
  const { data: propertyData, isLoading: propertyLoading } = useContractRead(escrow, "properties", [propertyID]);
  const { mutateAsync: makeOffer, isLoading: offerLoading } = useContractWrite(escrow, "makeOffer");
  const price = propertyData ? parseInt(ethers.utils.formatEther(propertyData.price.toString())) : 0;
  const makeOfferHandler = async () => {
    const { price } = getValues();
    try {
      const data = await makeOffer({ args: [propertyID, { value: ethers.utils.formatEther(price.toString()) }] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }
  //convert a price from ether to wei

  const { register: registerPrice, getValues} = useForm<PriceForm>()




  if (propertyLoading) {
    return <Loader/>;
  }

  // Check if the property is listed
  if (!propertyData.seller || propertyData.seller === ethers.constants.AddressZero) {
    return <Heading
      title="Property not listed"
      subtitle="This property is not listed for sale."
    />

  }

  return (
    <div>
      <h2>Property ID: {propertyID}</h2>
      <p>Seller: {propertyData.seller}</p>
      {/**Let the buy make an offer (has to be 20% of the initial price minimum) its the down payment 
      */}
      <p>Down Payment: {price * 0.2}</p>
      <p>Price: {price}</p>
      <form>
      <input
        {...registerPrice("price", { required: true })}
      />
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
      </form>
    </div>
  );
}

export default ListingBuyer;


