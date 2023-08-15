'use client';

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  FieldValues, 
  SubmitHandler,
  useForm
} from "react-hook-form";
import { ESCROW_ADDRESS, REAL_ESTATE_ADDRESS } from "@/app/libs/constant";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { useAddress, useConnect, metamaskWallet, useContract, useContractRead, useContractWrite, useGrantRole } from "@thirdweb-dev/react";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";
import { use } from "chai";


const RegisterModal= () => {

  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const metamaskConfig = metamaskWallet();
  const account = useAddress();
  const  connect  = useConnect();
  const { contract: escrow } = useContract(ESCROW_ADDRESS, "marketplace-v3");
  const { contract: realEstate } = useContract(REAL_ESTATE_ADDRESS);
  const { data: isMinter, isLoading: isHasRoleLoading } = useContractRead(realEstate,"hasRole" ,["minter", account])
  const { mutateAsync: grantRole, isLoading: isGrantMinterRoleLoading } = useContractWrite(realEstate, "grantRole") 
 
 
  const { 
    register, 
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (data.role === "") {
      toast.error("Please select a role");
      return;
    }

    if(!account) {
      toast.error("Please connect your wallet");
      connect(metamaskConfig).then(() => {
        setIsLoading(false);
      })
    }

    axios.post('/api/register', data)
    .then(() => {
      toast.success('Registered!');
      if(data.role !== "notary" || data.role !== "inspector"){
      grantMinterRole();
      }
      registerModal.onClose();
      loginModal.onOpen();
    })
    .catch((error) => {
      toast.error(error);
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  const grantMinterRole = async () => {
    try {
      const data = await grantRole({ args: ["minter", account] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }


  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome to REverse"
        subtitle="Create an account!"
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <fieldset className="border border-gray-400 p-4 my-4">
        <legend>Role</legend>
        <select
          id="role"
          {...register("role", { required: true })}
          disabled={isLoading}
          style={{ width: '100%' }}
        >
          <option value="">Select Role</option>
          <option value="buyer/seller">Im looking to buy/sell</option>
          <option value="notary">Notary</option>
          <option value="inspector">Inspector</option>
        </select>
      </fieldset>
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button 
        outline 
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn('google')} 
      />
      <Button 
        outline 
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn('github')}
      />
      <div 
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>Already have an account?
          <span 
            onClick={onToggle} 
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
            > Log in</span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;