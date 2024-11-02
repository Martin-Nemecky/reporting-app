"use client";

import { useParams, useRouter } from "next/navigation";
import { Report } from "@/app/_lib/types";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import AdjustIcon from "@mui/icons-material/Adjust";
import { findReportById } from "@/app/_actions/report-actions";
import { Button, List, ListItem, ListItemText } from "@mui/material";

const defaultReport: Report = {
  id: "",
  title: "",
  text: "",
  createdAt: -1,
  creator: {
    id: "",
    firstname: "",
    lastname: "",
    dateOfBirth: -1,
  },
  files: [],
};

export default function ReportDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<Report>(defaultReport);

  useEffect(() => {
    async function getReport() {
      const report = await findReportById(params.id);
      setReport(report);
    }

    getReport();
  }, [params.id]);

  return (
    <article className="flex flex-col gap-2">
      <header>
        <div className="flex justify-between">
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </header>
      <div className="border rounded-md shadow-lg">
        <main className="mt-2 p-8">
          <div className="flex items-start justify-between">
            <h1>{report.title}</h1>
            <div className="flex gap-2">
              <Button endIcon={<AdjustIcon />} color="primary" variant="contained">
                Update
              </Button>
              <Button endIcon={<DeleteIcon />} color="error" variant="contained">
                Delete
              </Button>
            </div>
          </div>

          <p className="mt-4">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </p>

          <h4 className="mt-4">Files:</h4>
          <List dense={false}>
            {report.files.map((file) => (
              <ListItem key={file.id} className="border">
                <ListItemText primary={file.filename} />
              </ListItem>
            ))}
          </List>
        </main>
        <footer className="bg-gray-100 p-4">
          <p className="text-center">
            Created on <strong>2023/11/04</strong> by <strong>Martin N</strong> (20 y. o.)
          </p>
        </footer>
      </div>
    </article>
  );
}
