"use client";

import AppBar from "./_components/app-bar";
import { ReportsProvider } from "./_contexts/reports-context";

type Props = {
  children: React.ReactNode;
};
export default function ReportsLayout({ children }: Props) {
  return (
    <ReportsProvider>
      <AppBar />
      <div className="my-8 mx-10 sm:mx-20 md:mx-32 2xl:mx-80">{children}</div>
    </ReportsProvider>
  );
}
