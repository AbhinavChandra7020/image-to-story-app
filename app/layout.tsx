// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from './_components/ThemeProvider';
import { Header } from './_components/Header';
import { Footer } from './_components/Footer';

export const metadata: Metadata = {
  title: "ImageineIt - Turn Images Into Stories",
  description: "Upload any image and watch as our AI transforms it into captivating stories.",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}