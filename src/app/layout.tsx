import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Piyush Aggarwal — Developer & Builder",
  description:
    "Personal portfolio of Piyush Aggarwal — student developer, builder and technology enthusiast based in Delhi.",
  metadataBase: new URL("https://piyushaggarwal1322009-bit.github.io"),
  openGraph: {
    title: "Piyush Aggarwal — Developer & Builder",
    description: "Projects, technology and the journey of Piyush Aggarwal.",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.variable}>{children}</body>
    </html>
  );
}