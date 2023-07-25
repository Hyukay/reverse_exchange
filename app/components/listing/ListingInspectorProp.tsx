import React, { useEffect, useState } from "react";
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { ESCROW_ADDRESS } from "@/app/libs/constant";
import Loader from "../Loader";


interface ListingInspectorProps {
    tokenId: number | null;
}

const ListingInspector: React.FC<ListingInspectorProps> = ({tokenId}) => {
  const { contract: escrow } = useContract(ESCROW_ADDRESS);
  const { mutateAsync: updateInspectionStatus } = useContractWrite(escrow, "updateInspectionStatus");
  const { data: inspectionStatus, isLoading } = useContractRead(
    escrow, 
    "inspections", 
    [tokenId]
  );

  const handleInspectionUpdate = async (newStatus: boolean) => {
    if (tokenId !== null) {
      try {
        await updateInspectionStatus({args: [tokenId, newStatus]});
      } catch (error) {
        console.error("Failed to update inspection status:", error);
      }
    }
  };

  return (
    <div>
      <h1>Inspector View</h1>
        <p>Property ID: {tokenId}</p>
        <h2>Inspection Status</h2>
      <p>
        Current inspection status: {isLoading ? <Loader></Loader> : inspectionStatus ? "Passed" : "Not Passed"}
      </p>
      <button onClick={() => handleInspectionUpdate(true)}>Mark as Passed</button>
      <button onClick={() => handleInspectionUpdate(false)}>Mark as Not Passed</button>
    </div>
  );
}

export default ListingInspector;