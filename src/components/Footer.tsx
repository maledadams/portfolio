import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-6 py-6 font-mono text-[11px] tracking-[0.12em] text-dim sm:flex-row sm:items-center sm:justify-between">
        <span>{t("rights")}</span>
        <span>{t("builtBy")}</span>
        <div className="flex gap-5">
          <a
            href="https://www.linkedin.com/in/lucia-m-adams/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cyan"
          >
            LINKEDIN
          </a>
          <a
            href="https://github.com/maledadams"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cyan"
          >
            GITHUB
          </a>
        </div>
      </div>
    </footer>
  );
}
