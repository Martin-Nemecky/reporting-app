"use client";

import { Button, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { signOut } from "@/app/_actions/auth-actions";

export default function AppBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPending, setIsPending] = useState(false);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    setIsPending(true);
    await signOut();
    handleClose();
  };

  return (
    <div className="flex justify-end border-b-2 px-8 py-3">
      <Button
        variant="outlined"
        endIcon={<AccountCircleIcon id="basic-button" />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Profile
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ "aria-labelledby": "basic-button" }}>
        <MenuItem onClick={handleSignOut}>{isPending ? "Signing Out..." : "Sign Out"}</MenuItem>
      </Menu>
    </div>
  );
}
