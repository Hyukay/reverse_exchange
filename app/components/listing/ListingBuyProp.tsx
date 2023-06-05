import { useState } from "react";

import Button from "../Button";

interface ListingBuyProps {
  price: number;
  onMakeOffer: (offer: number) => void;
}

const ListingBuy: React.FC<ListingBuyProps> = ({
  price,
  onMakeOffer
}) => {
  const [offer, setOffer] = useState<number>(price);

  return ( 
    <div 
      className="
      bg-white 
        rounded-xl 
        border-[1px]
      border-neutral-200 
        overflow-hidden
      "
    >
      <div className="
      flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">
          Asking Price: $ {price}
        </div>
      </div>
      <hr />
      <div className="p-4">
        <label>
          Your Offer: 
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
          label="Make Offer" 
          onClick={() => onMakeOffer(offer)}
        />
      </div>
    </div>
   );
}
 
export default ListingBuy;
