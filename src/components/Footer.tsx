import { useTranslations } from "next-intl";

/** Text-only 88x31 buttons, the way the format actually started. */
const badges = [
  { top: "BUILT WITH", bottom: "NEXT.JS" },
  { top: "TYPED IN", bottom: "TYPESCRIPT" },
  { top: "SHIPPED ON", bottom: "VERCEL" },
];

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-10">
      <div className="rule mb-6" />

      <div className="flex flex-col items-start gap-5 pb-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-chrome text-[10px] text-ink/60">
            {t("builtWith")}
          </span>
          {badges.map((badge) => (
            <span
              key={badge.bottom}
              className="bevel-btn flex h-[31px] w-[88px] flex-col items-center justify-center border-2 border-ink bg-shade leading-none"
            >
              <span className="font-chrome text-[7px] text-ink/60">
                {badge.top}
              </span>
              <span className="mt-0.5 font-chrome text-[8px]">
                {badge.bottom}
              </span>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 font-chrome text-[10px]">
          <a
            href="https://www.linkedin.com/in/lucia-m-adams/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 underline-offset-4 hover:bg-butter"
          >
            LINKEDIN
          </a>
          <a
            href="https://github.com/maledadams"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 underline-offset-4 hover:bg-butter"
          >
            GITHUB
          </a>
          <span className="text-ink/60">{t("rights")}</span>
        </div>
      </div>
    </footer>
  );
}
