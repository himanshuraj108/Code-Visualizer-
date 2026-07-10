import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata = {
  title: "CodeViz — World's Most Advanced Code Visualizer",
  description: "Visualize any code, any algorithm, any language. AI-powered step-by-step visualization with 150+ built-in algorithms. Free forever.",
  keywords: "code visualizer, algorithm visualization, data structures, sorting algorithms, graph algorithms, AI code analysis, free coding tool",
  openGraph: {
    title: "CodeViz — World's Most Advanced Code Visualizer",
    description: "Visualize any code, any algorithm, any language. Free forever.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f8fafc" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
