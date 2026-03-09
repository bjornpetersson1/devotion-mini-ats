"use client";

import { usePathname } from "next/navigation";
import TopBar from "./TopBar/TopBar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideTopBar = pathname === "/";

  return (
    <>
      {!hideTopBar && <TopBar />}
      {children}
    </>
  );
}
