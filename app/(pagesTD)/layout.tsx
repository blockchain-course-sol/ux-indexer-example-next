import Header from "@/components/header/header";
import React from "react";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <div className="h-full relative">
        <main className="overflow-hidden h-full flex flex-col">
          <Header />

          <div className="flex-1">{children}</div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
