import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Libre_Franklin, Space_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SITE_URL, localizedUrl, languageAlternates } from "@/lib/seo";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import RevealObserver from "@/components/RevealObserver";
import "../globals.css";

const franklin = Libre_Franklin({
  variable: "--font-franklin",
  subsets: ["latin", "latin-ext"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
});

/**
 * Marks the document as scripted so the reveal animation may hide content.
 * Without this running, every section stays visible (the safe default).
 */
const bootScript = `document.documentElement.classList.add('js');`;

export const viewport: Viewport = {
  themeColor: "#191919",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const url = localizedUrl(locale as "es" | "en", "/");

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s · ${t("title")}` },
    description: t("description"),
    alternates: {
      canonical: url,
      languages: languageAlternates("/"),
    },
    openGraph: {
      type: "website",
      siteName: t("title"),
      title: t("title"),
      description: t("description"),
      url,
      locale: locale === "es" ? "es_DO" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
    },
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

  const t = await getTranslations({ locale, namespace: "meta" });

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Lucia Adams",
    url: SITE_URL,
    image: `${SITE_URL}/icon-512.png`,
    jobTitle: locale === "es" ? "Estudiante de ingeniería" : "Engineering student",
    description: t("description"),
    sameAs: [
      "https://www.linkedin.com/in/lucia-m-adams/",
      "https://github.com/maledadams",
    ],
  };

  return (
    <html
      lang={locale}
      className={`${franklin.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="flex min-h-[100dvh] flex-col">
        <NextIntlClientProvider>
          <Nav />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <RevealObserver />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
