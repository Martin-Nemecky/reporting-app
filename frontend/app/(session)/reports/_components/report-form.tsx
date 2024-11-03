import { Button, FormControl, IconButton, InputLabel, List, ListItem, ListItemText, TextField } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/FileDownload";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { addReport } from "@/app/_actions/report-actions";
import { useProfile } from "../../_contexts/profile-context";
import { useReportsDispatch } from "../_contexts/reports-context";

type FormValues = {
  title: string;
  text: string;
  file: File;
};

type Props = {
  onClose: () => void;
};

export default function ReportForm({ onClose }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const reportsDispatch = useReportsDispatch()!;
  const profile = useProfile()!;

  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    defaultValues: { title: "", text: "" },
  });

  const onSubmit = handleSubmit(async (data, event) => {
    if (event == null) {
      throw new Error("Submit event is not available.");
    }

    event.preventDefault();
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file, file.name);
    });

    try {
      const addedReport = await addReport(
        { title: data.title, text: data.text, createdAt: new Date().getTime(), creatorId: profile.id },
        formData
      );

      reportsDispatch((prev) => [...prev, addedReport]);
      onClose();
    } catch (error: unknown) {
      const err = error as Error;
      console.log(err.message);
    }
  });

  return (
    <form onSubmit={onSubmit} className="p-8">
      <header>
        <hgroup>
          <h1 className="text-2xl font-black mb-2">Create New Report</h1>
          <p className="text-gray-600 ">Fill in the following form.</p>
        </hgroup>
      </header>

      <main className="flex flex-col gap-4 my-4">
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl>
              <InputLabel sx={{ backgroundColor: "white", paddingX: "5px" }} shrink required>
                Title
              </InputLabel>
              <TextField type="text" {...field} placeholder="Title of your report..." required />
            </FormControl>
          )}
        />
        <Controller
          name="text"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl>
              <InputLabel sx={{ backgroundColor: "white", paddingX: "5px" }} shrink required>
                Text
              </InputLabel>
              <TextField
                type="text"
                {...field}
                multiline
                rows={4}
                placeholder={"Please provide as much detail as possible..."}
                required
              />
            </FormControl>
          )}
        />

        <div className="border rounded-md">
          <label htmlFor="file-upload" className="flex gap-2 hover:bg-gray-100 hover:cursor-pointer p-2 border-b-[1px]">
            <AddCircleIcon />
            Add File
          </label>
          <input
            id="file-upload"
            {...register("file")}
            type="file"
            className="hidden"
            onChange={(e) => {
              const files = e.currentTarget.files;
              if (files != null) {
                setFiles((prev) => [...prev, ...files]);
              }
            }}
          />
          {files.length !== 0 && (
            <List dense={false}>
              {files.map((file) => (
                <ListItem
                  key={file.name}
                  secondaryAction={
                    <>
                      <a href={URL.createObjectURL(file)} download={file.name} className="relative top-[1.2px]">
                        <IconButton>
                          <DownloadIcon />
                        </IconButton>
                      </a>
                      <IconButton onClick={() => setFiles((prev) => prev.filter((f) => f.name !== file.name))}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          )}
        </div>
      </main>

      <footer className="h-full flex justify-end gap-2">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting || isSubmitSuccessful}>
          {isSubmitting || isSubmitSuccessful ? "Creating..." : "Create"}
        </Button>
      </footer>
    </form>
  );
}
