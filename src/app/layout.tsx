import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProfPilot - Find Your Perfect Research Match",
  description: "Connect with professors who align with your research interests. Generate personalized cold emails to start meaningful academic relationships.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
