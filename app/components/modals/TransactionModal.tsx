'use client';
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from "react-hook-form";
import { useRouter } from "next/navigation";

import useTransactionModal from "@/app/hooks/useTransactionModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";
import { useWeb3Modal } from '@web3modal/react'


const TransactionModal = () => {
  const router = useRouter();
  const transactionModal = useTransactionModal();
  const [isLoading, setIsLoading] = useState(false);
  const [customAction, setCustomAction] = useState(false);
  

  const { 
    register, 
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = 
  (data) => {
    setIsLoading(true);

    // Call your transaction function here (buying, selling, approving, inspecting)
    // Update state, call API, etc.

    setIsLoading(false);
    if (customAction) {
      toast.success('Transaction successful');
      router.refresh();
      transactionModal.onClose();
    } else {
      toast.error('Transaction failed');
    }
  }

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Transaction Title"
        subtitle="Transaction description!"
      />
      {/* You may need different inputs according to the transaction type */}
      <Input
        id= "id"
        label="Input Label"
        disabled={isLoading}
        register={register}  
        errors={errors}
        required
      />
      {/* ... additional inputs ... */}
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      {/* You can have different buttons according to the transaction type */}
      <Button 
        label="Confirm Transaction"
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={transactionModal.isOpen}
      title="Transaction Title"
      actionLabel="Confirm"
      onClose={transactionModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default TransactionModal;
