import type { Metadata } from "next";
import { Contrail_One, } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";

const contrail = Contrail_One({
  subsets: ["latin"],
  variable: "--font-contrail-one",
  weight: "400",
});

export const metadata: Metadata = {
  title: "ANY_WATCH",
  description: "ANY_WATCH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={` ${contrail.variable} h-full antialiased`}
    >
      <body className=" min-h-full flex flex-col">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
