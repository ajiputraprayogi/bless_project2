import { Outfit } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import BackendProviders from "./Providers";

const outfit = Outfit({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <BackendProviders session={session}>{children}</BackendProviders>
      </body>
    </html>
  );
}
