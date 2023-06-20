import { useState, useEffect } from "react";
import Button from "../Button";

interface ListingBuyProps {
  price: number;
  buyer: string;
  lender: string;
  inspector: string;
  seller: string;
  account: string;
  buyHandler: () => void;
  lendHandler: () => void;
  inspectHandler: () => void;
  sellHandler: () => void;
}

const ListingBuy: React.FC<ListingBuyProps> = ({
  price,
  buyer,
  lender,
  inspector,
  seller,
  account,
  buyHandler,
  lendHandler,
  inspectHandler,
  sellHandler
}) => {
  const [offer, setOffer] = useState<number>(price);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price);

  const [buttonLabel, setButtonLabel] = useState("Make Offer");
  const [buttonAction, setButtonAction] = useState(() => () => {});

  useEffect(() => {
    if (account === buyer) {
      setButtonLabel("Buy");
      setButtonAction(() => buyHandler);
    } else if (account === lender) {
      setButtonLabel("Lend");
      setButtonAction(() => lendHandler);
    } else if (account === inspector) {
      setButtonLabel("Inspect");
      setButtonAction(() => inspectHandler);
    } else if (account === seller) {
      setButtonLabel("Sell");
      setButtonAction(() => sellHandler);
    }
  }, [account, buyer, lender, inspector, seller, buyHandler, lendHandler, inspectHandler, sellHandler]);

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">
          Asking Price: {formattedPrice}
        </div>
      </div>
      <hr />
      <div className="p-4">
        <label>
          Current Offer: 
          <input 
            type="number" 
            value={offer} 
            onChange={e => setOffer(Number(e.target.value))} 
          />
        </label>
      </div>
      <hr />
      <div className="p-4">
        <Button 
          label={buttonLabel} 
          onClick={buttonAction}
        />
      </div>
    </div>
  ); 
}
 
export default ListingBuy;
