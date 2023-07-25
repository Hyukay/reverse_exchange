import React, { useEffect, useState } from "react";
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { ESCROW_ADDRESS } from "@/app/libs/constant";
import Loader from "../Loader";
import Button from "../Button";


interface ListingInspectorProps {
    tokenId: number | null;
}

const ListingInspector: React.FC<ListingInspectorProps> = ({tokenId}) => {
  const { contract: escrow } = useContract(ESCROW_ADDRESS);
  const { mutateAsync: updateInspectionStatus, isLoading: inspectorLoading} = useContractWrite(escrow, "updateInspectionStatus");
  const { data: inspectionStatus, isLoading: inspectionIsLoading } = useContractRead(
    escrow, 
    "inspections", 
    [tokenId]
  );

  const handleInspectionUpdate: (newStatus: boolean) => Promise<void> = async (newStatus: boolean) => {
    if (tokenId !== null) {
      try {
        await updateInspectionStatus({args: [tokenId, newStatus]});
      } catch (error) {
        console.error("Failed to update inspection status:", error);
      }
    }
  };
  
  const renderInspectionStatus = () => {
    if(inspectionIsLoading){
      return <Loader />;
    }else{
      return inspectionStatus ? "Passed" : "Not Passed";
    }
  }

  return (
    <div>
      <h1>Inspector View</h1>
      <p>Property ID: {tokenId}</p>
      <h2>Inspection Status</h2>
      <p>Current inspection status: {renderInspectionStatus()}</p>
      {inspectionStatus ? (
        <Button 
            label="Mark as Not Passed" 
            onClick={() => handleInspectionUpdate(false)} 
            disabled={inspectorLoading}
          /> 
      ) : (
        <Button 
          label="Mark as Passed" 
          onClick={() => handleInspectionUpdate(true)}
          disabled={inspectorLoading}
        />
      )}
    </div>
  );
}

export default ListingInspector;
