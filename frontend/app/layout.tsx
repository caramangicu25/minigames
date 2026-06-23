import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthBootstrapper } from "@/components/auth/AuthBootstrapper";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AchievementToast } from "@/components/ui/AchievementToast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "MiniGames | Play, Compete, Win",
  description:
    "Play classic mini games, track your scores, and compete on the global leaderboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${dmSerif.variable} bg-bg text-body antialiased`}
      >
        <ThemeProvider>
          <AuthBootstrapper />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <AchievementToast />
        </ThemeProvider>
      </body>
    </html>
  );
}
