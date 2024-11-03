"use client";

import { useProfile } from "../_contexts/profile-context";
import AppBar from "./_components/app-bar";
import { ReportsProvider } from "./_contexts/reports-context";

type Props = {
  children: React.ReactNode;
};
export default function ReportsLayout({ children }: Props) {
  const profile = useProfile()!;
  console.log(`Reports layout profile: ${JSON.stringify(profile)}`);

  return (
    <ReportsProvider>
      <AppBar />
      <div className="my-8 mx-10 sm:mx-20 md:mx-32 2xl:mx-80">{children}</div>
    </ReportsProvider>
  );
}
