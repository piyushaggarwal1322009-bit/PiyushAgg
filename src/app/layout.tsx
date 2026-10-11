import type { Metadata } from "next";
import Script from "next/script";
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
    <html lang="en" data-theme="system" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try { const stored = localStorage.getItem("piyush-theme"); const theme = stored === "light" || stored === "dark" ? stored : (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"); document.documentElement.dataset.theme = theme; } catch { document.documentElement.dataset.theme = "dark"; }`}
        </Script>
      </head>
      <body className={spaceGrotesk.variable}>{children}</body>
    </html>
  );
}