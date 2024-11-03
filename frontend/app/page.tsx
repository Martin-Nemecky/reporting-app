"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import WavingHandIcon from "@mui/icons-material/WavingHand";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col gap-2 justify-center items-center">
      <div className="flex gap-2 items-center justify-center">
        <h1>Welcome to the Reporting App</h1>
        <WavingHandIcon fontSize="large" color="primary" />
      </div>
      <p className="text-2xl text-gray-600">Please proceed to the login page...</p>
      <Button type="button" variant="contained" className="w-60 mt-10 p-4" onClick={() => router.push("/login")}>
        Login
      </Button>
    </div>
  );
}
