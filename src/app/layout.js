import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ThemeProvider from "./components/Theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zen Arcadia",
  description:
    "ZenArcadia is a modern, minimalist, anime-inspired productivity app designed to help you enter deep focus.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
