// Navbar.tsx
import { SafeUser } from "@/app/types";


import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import WalletConnect from "../WalletConnect"

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser,
}) => {
  return ( 
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div
        className="
          py-2
          border-b-[1px]
        "
      >
      <Container>
        <div 
          className="
            flex 
            flex-row 
            items-center 
            justify-between
            gap-3
            md:gap-0
          "
        >
          <Logo />
          <Search />
          <div className="flex flex-col items-end mr-2 space-y-4"> {/* Wrap WalletConnect and UserMenu in a div */}
            <WalletConnect /> {/* WalletConnect is now above UserMenu */}
            <UserMenu currentUser={currentUser} />
          </div>
        </div>
      </Container>
    </div>
  </div>
  );
}

export default Navbar;
