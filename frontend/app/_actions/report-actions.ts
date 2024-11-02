"use server";

import { Report } from "../_lib/types";

export async function findReportById(id: string): Promise<Report> {
  return new Promise((resolve) => {
    resolve({
      id: id,
      title: "First Report",
      text: "This is first report.",
      createdAt: -1,
      files: [{ id: "file1", filename: "file1.txt" }],
      creator: { id: "c1", firstname: "Martin", lastname: "N", dateOfBirth: -1 },
    });
  });
}

export async function addReport() {
  return await createReport();
}

export async function alterReport() {
  return await updateReport();
}

export async function removeReport() {
  return await deleteReport();
}
