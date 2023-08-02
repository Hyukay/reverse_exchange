import { useContract } from '@thirdweb-dev/react';
import { REAL_ESTATE_ADDRESS, ESCROW_ADDRESS } from "@/app/libs/constant";
import toast from "react-hot-toast";
import toastStyle from "@/app/libs/toastConfig";
import { useEffect, useState } from 'react';

export const useCheckAndProvideApproval = (owner: string | undefined) => {

    const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);
    const [isLoading, setIsLoading] = useState(false);

    const checkAndProvideApproval = async () => {
        setIsLoading(true);
        try {
            // Check if approval is required
            const hasApproval = await realEstate?.call("isApprovedForAll", [
                owner,
                ESCROW_ADDRESS,
            ]);

            // If it is, provide approval
            if (!hasApproval) {
                const txResult = await realEstate?.call("setApprovalForAll", [
                    ESCROW_ADDRESS,
                    true,
                ]);

                if (txResult) {
                    toast.success("Exchange approval granted", {
                        icon: "✅",
                        style: toastStyle,
                        position: "bottom-center",
                    });
                }
            }
            setIsLoading(false);
            return true;
        } catch (error) {
            console.error('Failed to check or provide approval', error);
            setIsLoading(false);
            return false;
        }
    }

    return { checkAndProvideApproval, isLoading };
}
