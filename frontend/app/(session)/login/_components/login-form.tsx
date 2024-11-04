"use client";

import { logIn } from "@/app/_actions/auth-actions";
import { Button, TextField } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useProfileDispatch } from "../../_contexts/profile-context";

type FormValues = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const profileDispatch = useProfileDispatch()!;
  const searchParams = useSearchParams();
  const {
    handleSubmit,
    setError,
    control,
    resetField,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = handleSubmit(async (data, event) => {
    if (event == null) {
      throw new Error("Submit event is not available.");
    }

    event.preventDefault();

    try {
      const profile = await logIn(data.username, data.password);
      profileDispatch(profile);
      router.push(searchParams.get("from") || "reports/");
    } catch (error: unknown) {
      resetField("password");
      setError("password", { type: "server", message: (error as Error).message });
    }
  });

  return (
    <form onSubmit={onSubmit} className="border border-gray-300 shadow-lg rounded-lg p-8">
      <header>
        <hgroup>
          <h1 className="text-4xl text-center pt-10 px-6 font-black mb-2">Reporting App</h1>
          <p className="text-center px-6 text-gray-600 ">Sign in to get to your personal content.</p>
        </hgroup>
      </header>

      <main className="flex flex-col gap-2 my-10">
        <Controller
          name="username"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <TextField type="text" {...field} label="Username" required />}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <TextField type="password" {...field} label="Password" required />}
        />
        {errors.password && <p className="text-red-700">{errors.password.message}</p>}
      </main>

      <footer>
        <Button type="submit" variant="contained" className="w-full" disabled={isSubmitting || isSubmitSuccessful}>
          {isSubmitting || isSubmitSuccessful ? "Signing in..." : "Sign in"}
        </Button>
      </footer>
    </form>
  );
}
