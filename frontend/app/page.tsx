"use client";

import { Button } from "@mui/material";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Button type="button" variant="contained" className="w-60 p-4" onClick={() => redirect("/login")}>Login</Button>
    </div>
  );
}
