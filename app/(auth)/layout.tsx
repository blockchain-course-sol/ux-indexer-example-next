import React, { ReactNode } from "react";

type AuthLayout = {
  children: ReactNode;
};
const AuthLayout = ({ children }: AuthLayout) => {
  return (
    <div className="flex items-center justify-center h-full ">{children}</div>
  );
};

export default AuthLayout;
