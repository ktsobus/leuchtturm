import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/smooth-scroll";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

// LT Institute — body / all normal text
const institute = localFont({
  src: "./fonts/LTInstitute-Regular.otf",
  variable: "--font-institute",
  display: "swap",
  weight: "400",
});

// Sunday Masthead — bold headings
const masthead = localFont({
  src: "./fonts/SundayMasthead-Regular.woff2",
  variable: "--font-masthead",
  display: "swap",
  weight: "700",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leuchtturm Media",
  description:
    "A one-person studio crafting hand-painted animated films and the worlds inside them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${institute.variable} ${masthead.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-fog">
        <SmoothScroll />
        <MotionProvider>{children}</MotionProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
