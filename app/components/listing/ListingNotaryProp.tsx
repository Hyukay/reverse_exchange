import { useContractWrite, useContract, useContractRead } from "@thirdweb-dev/react";
import W3Button from "../W3Button";
import { toast } from "react-hot-toast";
import Loader from "../Loader";
import {ethers} from "ethers";
import { ESCROW_ADDRESS } from "@/app/libs/constant";
import Heading from "../Heading";
import NoListing from "./NoListing";
interface NotaryProps {
  tokenId: number | null;
}



const NotaryView: React.FC<NotaryProps> = ({tokenId}) => {

  const { contract: escrow } = useContract(ESCROW_ADDRESS);
  const { mutateAsync: finalizeSale, isLoading: finalizeSaleLoading } = useContractWrite(escrow, "finalizeSale");
  const { data: propertyData, isLoading: propertyLoading } = useContractRead(escrow, "properties", [tokenId]);

  // convert BigNumber to string then convert to ETH using ethers
  const price = propertyData ? ethers.utils.formatEther(propertyData.price.toString()) : 0;


  const finalizePropertySale = async () => {
    try {
      const data = await finalizeSale({ args: [tokenId] });
      console.info("Sale finalized successfully", data);
      toast.success("Sale finalized successfully");
    } catch (err) {
      console.error("Error finalizing sale", err);
      toast.error("Error finalizing sale");
    }
  };

  if (propertyLoading) {
    return <Loader/>
  }

  if (!propertyData?.seller || propertyData?.seller === ethers.constants.AddressZero) {
    return <NoListing/>;
  }

  return (
    <div className="notary-view">
      <h2>Notary View</h2>
      <Heading
        title = {`Property ID: ${tokenId}`}
        subtitle = {`Property Price: ${price} ETH`}
      />
      <W3Button
        outline
        label={"Finalize Sale"}
        contractAddress={ESCROW_ADDRESS}
        action={finalizePropertySale}
        isDisabled={finalizeSaleLoading}
        onSuccess={(result) => console.log("Transaction successful", result)}
        onError={(error) => console.error("Transaction error", error)}
        onSubmit={() => console.log("Transaction pending...")}
      />
    </div>
  );
};

export default NotaryView;
