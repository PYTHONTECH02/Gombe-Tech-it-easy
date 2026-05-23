import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full">
      <Navbar />
      <main className="flex-1 w-full flex flex-col relative z-0">
        {children}
      </main>
    </div>
  );
}
