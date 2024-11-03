import { Profile } from "@/app/_lib/types";
import { Dispatch, createContext, ReactNode, SetStateAction, useState, useContext } from "react";

const ProfileContext = createContext<Profile | null>(null);
const ProfileDispatchContext = createContext<Dispatch<SetStateAction<Profile | null>> | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  return (
    <ProfileContext.Provider value={profile}>
      <ProfileDispatchContext.Provider value={setProfile}>{children}</ProfileDispatchContext.Provider>
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}

export function useProfileDispatch() {
  return useContext(ProfileDispatchContext);
}
