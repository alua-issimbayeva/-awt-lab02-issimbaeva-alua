import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AWT Course Catalog",
  description: "Course catalog for the Advanced Web Technologies course.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <nav className="flex gap-4 px-6 py-4 border-b border-slate-200">
          <Link href="/" className="px-3 py-2 rounded-md hover:bg-slate-100">
            Home
          </Link>
          <Link
            href="/courses"
            className="px-3 py-2 rounded-md hover:bg-slate-100"
          >
            Courses
          </Link>
          <Link
            href="/about"
            className="px-3 py-2 rounded-md hover:bg-slate-100"
          >
            About
          </Link>
        </nav>
        <main className="px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
