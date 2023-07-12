'use client';

import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";
import PropertyListingModal from "../components/modals/PropertyListingModal";
import SearchModal from "../components/modals/SearchModal";

const ModalsProvider = () => {
  return ( 
    <>
      <LoginModal />
      <RegisterModal />
      <SearchModal />
      <PropertyListingModal />
    </>
   );
}
 
export default ModalsProvider;