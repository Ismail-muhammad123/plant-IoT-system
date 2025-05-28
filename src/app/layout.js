import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "IoT Plant monitorig System",
  description: "IoT monitoring system with esp32, firebase, AI and NextJs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
        style={{ backgroundColor: "#fff", color: "#111" }}
      >
        {children}
      </body>
    </html>
  );
}
