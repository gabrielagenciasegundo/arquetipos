import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });


export const metadata: Metadata = {
  metadataBase: new URL("https://arquetipos.agenciasegundo.com"),

  title: {
    default: "Teste de Arquétipos | Agência Segundo",
    template: "%s | Agência Segundo",
  },

  description:
    "Descubra seus arquétipos dominantes e entenda como eles influenciam seu comportamento, decisões e posicionamento pessoal e profissional. Um teste desenvolvido pela Agência Segundo.",

  applicationName: "Teste de Arquétipos - Agência Segundo",
  generator: "Agência Segundo",
  authors: [{ name: "Agência Segundo" }],
  creator: "Agência Segundo",
  publisher: "Agência Segundo",

  keywords: [
    "arquétipos",
    "teste de arquétipos",
    "arquétipos de personalidade",
    "branding pessoal",
    "autoconhecimento",
    "posicionamento de marca",
    "agência segundo",
    "marketing estratégico",
  ],

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "Teste de Arquétipos | Agência Segundo",
    description:
      "Um teste estratégico para identificar seus arquétipos dominantes e transformar autoconhecimento em posicionamento.",
    url: "/",
    siteName: "Agência Segundo",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/agencia-segundo_cut.png",
        width: 1200,
        height: 630,
        alt: "Teste de Arquétipos – Agência Segundo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Teste de Arquétipos | Agência Segundo",
    description:
      "Descubra seus arquétipos dominantes e use isso para evoluir seu posicionamento pessoal e profissional.",
    images: ["/agencia-segundo_cut.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "Marketing, Branding e Autoconhecimento",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
