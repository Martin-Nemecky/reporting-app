"use server";

import {
  deleteReport,
  deleteReportFile,
  findAllReports,
  findOneReport,
  findReportFile,
  saveReport,
  saveReportFile,
  updateReport,
} from "../_lib/api";
import { FileReference, Report, SaveReport } from "../_lib/types";
import { getSessionData } from "./session-actions";

export async function getReportById(id: string): Promise<Report> {
  const sessionData = await getSessionData();
  if (sessionData == null) {
    throw new Error("Session data are not available.");
  }

  return await findOneReport(sessionData.accessToken, id);
}

export async function getAllReports(): Promise<Report[]> {
  const sessionData = await getSessionData();
  if (sessionData == null) {
    throw new Error("Session data are not available.");
  }

  return await findAllReports(sessionData.accessToken);
}

export async function addReport(report: SaveReport, files: FormData): Promise<Report> {
  const sessionData = await getSessionData();
  if (sessionData == null) {
    throw new Error("Session data are not available.");
  }

  return await saveReport(sessionData.accessToken, report, files);
}

export async function alterReport(reportId: string, report: SaveReport): Promise<Report> {
  const sessionData = await getSessionData();
  if (sessionData == null) {
    throw new Error("Session data are not available.");
  }

  return await updateReport(sessionData.accessToken, reportId, report);
}

export async function addReportFile(reportId: string, files: FormData): Promise<FileReference[]> {
  const sessionData = await getSessionData();
  if (sessionData == null) {
    throw new Error("Session data are not available.");
  }

  return await saveReportFile(sessionData.accessToken, reportId, files);
}

export async function removeReportFile(reportId: string, fileId: string) {
  const sessionData = await getSessionData();
  if (sessionData == null) {
    throw new Error("Session data are not available.");
  }

  return await deleteReportFile(sessionData.accessToken, reportId, fileId);
}

export async function removeReport(reportId: string): Promise<Report> {
  const sessionData = await getSessionData();
  if (sessionData == null) {
    throw new Error("Session data are not available.");
  }

  return await deleteReport(sessionData.accessToken, reportId);
}

export async function getReportFile(reportId: string, fileId: string): Promise<Blob> {
  const sessionData = await getSessionData();
  if (sessionData == null) {
    throw new Error("Session data are not available.");
  }

  return await findReportFile(sessionData.accessToken, reportId, fileId);
}
