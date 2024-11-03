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
  console.log(`Sending report: ${JSON.stringify(report)} and token: ${token}`);

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

  console.log(`Form data from api: ${JSON.stringify(files)}`);
  console.log(...files);

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

  const result = await filename.text();
  console.log(`Remove file json: ${result}`);

  return result;
}

export async function findReportFile(token: string, reportId: string, fileId: string): Promise<Blob> {
  const result = await fetch(`https://localhost:8080/api/reports/${reportId}/files/${fileId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/octet-stream",
    },
  });

  return await result.blob();
  // console.log()
  // return new File([blob], "f.txt");

  // console.log("----");

  // console.log(JSON.stringify(await file.text()));

  // const result = await file.json();
  // console.log(JSON.stringify(result));

  throw new Error();
  //return result;
}

/* 
https://localhost:8080/api/auth
https://localhost:8080/api/auth/profile

https://localhost:8080/api/reports
https://localhost:8080/api/reports/:id
https://localhost:8080/api/reports/:id/files
https://localhost:8080/api/reports/:id/files/:fileId
*/
