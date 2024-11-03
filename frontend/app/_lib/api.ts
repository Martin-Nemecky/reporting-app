import { SaveReport, Report, Profile, FileReference } from "./types";

// ===========================
// Auth API
// ===========================
type AccessToken = { accessToken: string };

export async function signIn(username: string, password: string): Promise<AccessToken> {
  const result = await fetch("https://localhost:8080/api/auth", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
  });

  return await result.json();
}

export async function getProfile(token: string): Promise<Profile> {
  const profile = await fetch("https://localhost:8080/api/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return await profile.json();
}

// ===========================
// Reports API
// ===========================
export async function findAllReports(token: string): Promise<Report[]> {
  const reports = await fetch("https://localhost:8080/api/reports", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return await reports.json();
}

export async function findOneReport(token: string, reportId: string): Promise<Report> {
  const reports = await fetch(`https://localhost:8080/api/reports/${reportId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return await reports.json();
}

export async function saveReport(token: string, report: SaveReport, files: FormData): Promise<Report> {
  const savedReportPromise = await fetch("https://localhost:8080/api/reports", {
    method: "POST",
    body: JSON.stringify(report),
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const savedReport: Report = await savedReportPromise.json();
  const fileRefsPromise = await fetch(`https://localhost:8080/api/reports/${savedReport.id}/files`, {
    method: "POST",
    body: files,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fileRefs: FileReference[] = await fileRefsPromise.json();
  savedReport.fileRefs = fileRefs;

  return savedReport;
}

export async function updateReport(token: string, reportId: string, report: SaveReport): Promise<Report> {
  const updatedReportPromise = await fetch(`https://localhost:8080/api/reports/${reportId}`, {
    method: "PUT",
    body: JSON.stringify(report),
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const updatedReport = await updatedReportPromise.json();
  return updatedReport;
}

export async function saveReportFile(token: string, reportId: string, files: FormData): Promise<FileReference[]> {
  const fileRefsPromise = await fetch(`https://localhost:8080/api/reports/${reportId}/files`, {
    method: "POST",
    body: files,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fileRefs: FileReference[] = await fileRefsPromise.json();
  return fileRefs;
}

export async function deleteReport(token: string, reportId: string): Promise<Report> {
  const report = await fetch(`https://localhost:8080/api/reports/${reportId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await report.json();
}

export async function deleteReportFile(token: string, reportId: string, fileId: string): Promise<string> {
  const filename = await fetch(`https://localhost:8080/api/reports/${reportId}/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await filename.text();
}

export async function findReportFile(token: string, reportId: string, fileId: string): Promise<Blob> {
  const result = await fetch(`https://localhost:8080/api/reports/${reportId}/files/${fileId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/octet-stream",
    },
  });

  return await result.blob();
}
