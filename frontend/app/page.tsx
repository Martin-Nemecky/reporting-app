"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Button type="button" variant="contained" className="w-60 p-4" onClick={() => router.push("/login")}>
        Login
      </Button>
    </div>
  );
}
