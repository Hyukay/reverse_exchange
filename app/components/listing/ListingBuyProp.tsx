'use client'
import { useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import W3Button from "../W3Button";
import Heading from "../Heading";
import Loader from "../Loader";
import { useForm, FieldError } from "react-hook-form";
import { ESCROW_ADDRESS } from "@/app/libs/constant";
import Input from "../inputs/Input";

import Button from "../Button";
import { useAddress } from "@thirdweb-dev/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ListingBuyerProp {
  propertyID: number | null;
}



const ListingBuyer: React.FC<ListingBuyerProp> = ({ propertyID }) => {

  const address = useAddress();

  const { contract: escrow } = useContract(ESCROW_ADDRESS);
  
  const { data: propertyData, isLoading: propertyLoading } = useContractRead(escrow, "properties", [propertyID]);
  const { mutateAsync: makeOffer, isLoading: offerLoading, isError: offerError } = useContractWrite(escrow, "makeOffer");
  const price = propertyData ? parseInt(ethers.utils.formatEther(propertyData.price.toString())) : 0;
  const { mutateAsync: completePayment, isLoading: paymentLoading } = useContractWrite(escrow, "completePayment");

  //set a state for when the payment is completed
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const makeOfferHandler = async () => {
    const { price } = getValues();
    const priceInWei = ethers.utils.parseEther(price);
    try {
      const data = await makeOffer({ args: [propertyID, priceInWei] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const completePaymentHandler = async () => {

    const { price } = getValues();
    const priceInWei = ethers.utils.parseEther(price.toString());      

    try {
      const data = await completePayment({ args: [propertyID], overrides: {
        value: priceInWei
      } }); 
      console.log("contract call success", data);
      toast.success("Payment completed successfully");
      setPaymentCompleted(true)
    } catch (err) {
      console.error("contract call failure", err);
      toast.error("Error completing payment");
    }
  }

  const { register, handleSubmit, getValues, formState: {errors} } = useForm();

  if (propertyLoading) {
    return <Loader/>;
  }

  // Check if the property is listed
  if (!propertyData?.seller || propertyData?.seller === ethers.constants.AddressZero) {
    return <Heading
      title="Property not listed"
      subtitle="This property is not listed for sale."
    />
  }

  if(paymentCompleted) {
    return <Heading
      title="Waiting for approval come back later"
      subtitle="The payment has been completed and we are waiting for approval from the notary."
    />
  }

  
  let button;
  //If the property's buyer is equal to the connected address, then show the completePayment button
  // show loader if the property is loading or the payment is loading or the offer is loading
  if(propertyLoading) {
    return <div>Loading...<Loader/></div>
      }
  if (propertyData?.buyer === address) {
    button = <Button
      onClick={handleSubmit(completePaymentHandler)}
      label="Complete Payment"
      disabled={paymentLoading}
    />
  }
  else {
    button = <Button
      onClick={handleSubmit(makeOfferHandler)}
      label="Make Offer"
      disabled={offerLoading}
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
      <Input
        id="price"
        label="Amount"
        type="number"
        register={register}
        errors={errors}
        required
      />
      {button}
    </div>
  );
}

export default ListingBuyer;


