import Image from "next/image";
import { Link } from "@/i18n/navigation";
import TiltCard from "./TiltCard";

type Props = {
  name: string;
  category: string;
  year: string;
  alt: string;
  image: string;
  featured?: boolean;
};

/**
 * Thumbnail above a caption row: title on the left, category and year
 * right-aligned in muted small type.
 */
export default function ProjectCard({
  name,
  category,
  year,
  alt,
  image,
  featured = false,
}: Props) {
  return (
    <li className={featured ? "sm:col-span-2" : undefined}>
      <Link href="/work" className="group block">
        <TiltCard maxTilt={6}>
          {/* Cropped to a banner so a featured card cannot tower over the grid. */}
          <div className="aspect-[1.9] overflow-hidden border border-line bg-surface">
            <Image
              src={image}
              alt={alt}
              width={1440}
              height={900}
              className="block h-full w-full object-cover object-top"
              sizes={
                featured
                  ? "(min-width: 640px) 788px, 100vw"
                  : "(min-width: 640px) 382px, 100vw"
              }
            />
          </div>
        </TiltCard>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h3 className="group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
            {name}
          </h3>
          <p className="shrink-0 font-mono text-[0.7em] text-muted">
            {category} {year}
          </p>
        </div>
      </Link>
    </li>
  );
}
