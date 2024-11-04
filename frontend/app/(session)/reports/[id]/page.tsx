"use client";

import { useParams, useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DownloadIcon from "@mui/icons-material/FileDownload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { useReports, useReportsDispatch } from "../_contexts/reports-context";
import { addReportFile, getReportFile, removeReport, removeReportFile } from "@/app/_actions/report-actions";
import * as lodash from "lodash";
import { calculateAge, formatDate } from "@/app/_lib/utils";
import { ChangeEvent, useRef, useState } from "react";
import { useProfile } from "../../_contexts/profile-context";
import MyModal from "@/app/_components/my-modal";
import ReportForm from "../_components/report-form";

export default function ReportDetail() {
  const [open, setOpen] = useState(false);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const profile = useProfile()!;
  const downloadAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const reportsDispatch = useReportsDispatch()!;
  const report = useReports().find((r) => r.id === params.id)!;
  const userAge = calculateAge(new Date(profile.dateOfBirth));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function handleFileRemove(fileId: string) {
    reportsDispatch((prev) => {
      return prev.map((rep) => {
        if (rep.id === report.id) {
          const repClone = lodash.cloneDeep(rep);
          repClone.fileRefs = repClone.fileRefs.filter((ref) => ref.fileId !== fileId);
          return repClone;
        } else {
          return lodash.cloneDeep(rep);
        }
      });
    });
    report.fileRefs = report.fileRefs.filter((ref) => ref.fileId !== fileId);
    await removeReportFile(report.id, fileId);
  }

  async function handleFileDownload(fileId: string, originalFilename: string) {
    if (downloadAnchorRef.current == null) {
      return;
    }

    const blob = await getReportFile(report.id, fileId);
    const file = new File([blob], originalFilename);
    const url = URL.createObjectURL(file);
    downloadAnchorRef.current.href = url;
    downloadAnchorRef.current.download = originalFilename;
    downloadAnchorRef.current.click();
    URL.revokeObjectURL(url);
  }

  async function handleReportRemove() {
    await removeReport(report.id);
    router.push("/reports");
  }

  async function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (files != null) {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files.item(i)!, files.item(i)!.name);
      }

      const fileRefs = await addReportFile(report.id, formData);
      reportsDispatch((prev) => {
        return prev.map((rep) => {
          if (rep.id === report.id) {
            const repClone = lodash.cloneDeep(rep);
            repClone.fileRefs.push(...fileRefs);
            return repClone;
          } else {
            return lodash.cloneDeep(rep);
          }
        });
      });
    }
  }

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
          <div className="flex flex-col gap-2 lg:flex-row items-start justify-between">
            <h1>{report.title}</h1>
            <div className="flex gap-2">
              <Button endIcon={<EditIcon />} color="primary" variant="outlined" onClick={handleOpen}>
                Update
              </Button>
              <Button endIcon={<DeleteIcon />} color="error" variant="outlined" onClick={handleReportRemove}>
                Delete
              </Button>
            </div>
          </div>

          <p className="mt-4">{report.text}</p>

          <div className="flex flex-col gap-2 justify-between">
            <h4 className="mt-4">Files:</h4>
            <div className="border rounded-md">
              <label htmlFor="file-upload" className="flex gap-2 hover:bg-gray-100 hover:cursor-pointer p-2">
                <AddCircleIcon />
                Add File
              </label>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileInputChange} />
            </div>
          </div>

          {/* LIST OF FILES */}
          <List dense={false}>
            {report.fileRefs.map((file) => (
              <ListItem
                key={file.fileId}
                className="border"
                secondaryAction={
                  <>
                    <IconButton onClick={() => handleFileDownload(file.fileId, file.originalFilename)}>
                      <DownloadIcon />
                    </IconButton>

                    <IconButton onClick={async () => await handleFileRemove(file.fileId)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={file.originalFilename} />
              </ListItem>
            ))}
          </List>
        </main>
        <footer className="bg-gray-100 p-4">
          <p className="text-center">
            Created on <strong>{formatDate(report.createdAt)}</strong> by{" "}
            <strong>{profile.firstname + " " + profile.lastname}</strong> ({userAge} y. o.)
          </p>
        </footer>
        <a ref={downloadAnchorRef} className="hidden" />
      </div>

      {open && (
        <MyModal>
          <ReportForm type={"update"} defaultReport={report} onClose={handleClose} />
        </MyModal>
      )}
    </article>
  );
}
