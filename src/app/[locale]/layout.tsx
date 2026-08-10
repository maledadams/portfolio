import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { routing } from "@/i18n/routing";
import SheetNav from "@/components/SheetNav";
import SpineTrace from "@/components/SpineTrace";
import Footer from "@/components/Footer";
import "../globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${grotesk.variable} ${plexMono.variable} antialiased`}
    >
      <body className="min-h-[100dvh]">
        <NextIntlClientProvider>
          <div className="ambient-grid" aria-hidden="true" />
          <SheetNav />
          <div className="relative">
            <SpineTrace />
            <main className="mx-auto max-w-[1240px] px-6 pt-16 md:pl-24 md:pr-10">
              {children}
            </main>
          </div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
