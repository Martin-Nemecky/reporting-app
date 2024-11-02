import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function MyModal({ children }: Props) {
  return (
    <>
      <div className="absolute inset-0 flex justify-center items-center z-20">
        <div className="w-[600px] bg-white">{children}</div>
      </div>
      <div className="flex justify-center items-center absolute inset-0 opacity-60 w-full min-h-screen bg-gray-500 z-10" />
    </>
  );
}
