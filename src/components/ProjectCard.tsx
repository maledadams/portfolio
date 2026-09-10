import TiltCard from "./TiltCard";
import ScrollingScreenshot from "./ScrollingScreenshot";
import CyclingScreenshot from "./CyclingScreenshot";

type Props = {
  name: string;
  category: string;
  year: string;
  alt: string;
  image: string;
  images?: string[];
  url: string;
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
  images,
  url,
  featured = false,
}: Props) {
  return (
    <li className={featured ? "sm:col-span-2" : undefined}>
      <a href={url} target="_blank" rel="noopener noreferrer" className="group block">
        <TiltCard maxTilt={6}>
          {/* Cropped to a banner so a featured card cannot tower over the grid. */}
          {images && images.length > 1 ? (
            <CyclingScreenshot
              images={images.map((src) => ({ src, alt }))}
              className="aspect-[1.9] border border-line bg-surface"
            />
          ) : (
            <ScrollingScreenshot
              src={image}
              alt={alt}
              className="aspect-[1.9] border border-line bg-surface"
            />
          )}
        </TiltCard>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h3 className="group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
            {name}
          </h3>
          <p className="shrink-0 font-mono text-[0.7em] text-muted">
            {category} {year}
          </p>
        </div>
      </a>
    </li>
  );
}
