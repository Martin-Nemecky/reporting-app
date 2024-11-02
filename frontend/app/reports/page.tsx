"use client";

import { Button } from "@mui/material";
import ReportTable from "./_components/report-table";
import { useState } from "react";
import MyModal from "../_components/my-modal";
import ReportForm from "./_components/report-form";

export default function Reports() {
  
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1>Reports</h1>
        <p className="mt-1 text-gray-600">Review all of your submitted reports.</p>
      </header>

      <main className="flex flex-col gap-2">
        <div className="flex justify-end">
          <Button variant="contained" onClick={handleOpen}>
            Add Report
          </Button>
        </div>
        <ReportTable />
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>

      {open && (
        <MyModal>
          <ReportForm onClose={handleClose} />
        </MyModal>
      )}
    </div>
  );
}
