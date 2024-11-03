import { Report } from "@/app/_lib/types";
import { Dispatch, createContext, ReactNode, SetStateAction, useState, useContext } from "react";

const ReportsContext = createContext<Report[]>([]);
const ReportsDispatchContext = createContext<Dispatch<SetStateAction<Report[]>> | null>(null);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);

  return (
    <ReportsContext.Provider value={reports}>
      <ReportsDispatchContext.Provider value={setReports}>{children}</ReportsDispatchContext.Provider>
    </ReportsContext.Provider>
  );
}

export function useReports() {
  return useContext(ReportsContext);
}

export function useReportsDispatch() {
  return useContext(ReportsDispatchContext);
}
