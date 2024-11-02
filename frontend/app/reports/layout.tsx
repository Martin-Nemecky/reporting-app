import AppBar from "./_components/app-bar";

export default function ReportsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <AppBar />
      <div className="my-8 mx-80">{children}</div>
    </section>
  );
}
