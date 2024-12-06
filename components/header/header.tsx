import React from "react";
import WalletComponent from "./wallet";
import Link from "next/link";
import Networkbadge from "../network-badge";

const Header = () => {
  return (
    <div className="flex items-center justify-between w-full px-12 py-4 gap-4 ">
      <Link className="font-medium text-3xl cursor-pointer" href={"/"}>
        TD UX-INDEXER
      </Link>
      <div className="flex flex-row items-center space-x-4">
        <Networkbadge />
        <WalletComponent />
      </div>
    </div>
  );
};

export default Header;
