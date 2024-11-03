"use client";

import { ProfileProvider } from "./_contexts/profile-context";

type Props = {
  children: React.ReactNode;
};

export default function SessionLayout({ children }: Props) {
  return <ProfileProvider>{children}</ProfileProvider>;
}
