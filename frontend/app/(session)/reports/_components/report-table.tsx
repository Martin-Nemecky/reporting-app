"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useReports } from "../_contexts/reports-context";
import { formatDate } from "@/app/_lib/utils";

type Column = {
  id: "title" | "text" | "createdAt" | "numberOfFiles";
  label: string;
};

const columns: Column[] = [
  { id: "title", label: "Title" },
  { id: "text", label: "Text" },
  { id: "createdAt", label: "Created At" },
  { id: "numberOfFiles", label: "Number Of Files" },
];

export default function ReportTable() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const reports = useReports()!;

  const rows = reports.map((report) => ({
    id: report.id,
    title: report.title,
    text: report.text,
    createdAt: formatDate(report.createdAt),
    numberOfFiles: report.fileRefs.length,
  }));

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} className="bg-gray-100 font-semibold hover:bg-gray-100">
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  className="hover:cursor-pointer"
                  tabIndex={-1}
                  key={row.id}
                  onClick={() => router.push(`/reports/${row.id}`)}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id}>
                        <p className="line-clamp-1">{value}</p>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
