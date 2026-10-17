import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const external = [
  { label: "linkedin", href: "https://www.linkedin.com/in/lucia-m-adams/" },
  { label: "github", href: "https://github.com/maledadams" },
];

export default function Footer() {
  const nav = useTranslations("nav");

  const internal = [
    { label: nav("home"), href: "/" },
    { label: nav("work"), href: "/work" },
    { label: nav("contact"), href: "/contact" },
  ] as const;

  return (
    <footer className="mt-10">
      <div className="center flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-line py-14 font-mono text-[0.8em]">
        {internal.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="navlink text-muted transition-colors hover:text-fg"
          >
            <span className="slash">/</span>
            {item.label}
          </Link>
        ))}

        {external.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="navlink text-muted transition-colors hover:text-fg"
          >
            <span className="slash">/</span>
            {item.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
