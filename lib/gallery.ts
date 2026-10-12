import fs from "fs";
import path from "path";

/**
 * Drop photos in public/images. The filename becomes the caption:
 * hand_holding_samples_in_tube.png → "Hand holding samples in tube".
 * A trailing _1 or _2 is ignored. UUID exports stay in the gallery with a
 * generic caption until they are renamed.
 *
 * To show a photo on a health topic as well, start the filename with that
 * topic's prefix, for example breast_cancer_, prostate_cancer_, or hiv_.
 */

const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type GalleryPhoto = {
  src: string;
  file: string;
  alt: string;
};

function captionFromStem(stem: string) {
  if (UUID.test(stem)) return "StreamTrust Diagnostics";

  const words = stem.replace(/[_-]+/g, " ").replace(/\s+\d+$/, "").trim();
  if (!words) return "StreamTrust Diagnostics";
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function listGalleryPhotos(): GalleryPhoto[] {
  const dir = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXT.test(file))
    .map((file) => {
      const stem = file.replace(/\.[^.]+$/, "");
      return {
        src: `/images/${file}`,
        file,
        alt: captionFromStem(stem),
        uuid: UUID.test(stem),
      };
    })
    .sort((a, b) => {
      if (a.uuid !== b.uuid) return a.uuid ? 1 : -1;
      return a.file.localeCompare(b.file);
    })
    .map(({ src, file, alt }) => ({ src, file, alt }));
}

const HERO_COPY: Record<string, { alt: string; line: string }> = {
  "breast_cancer_1.png": {
    alt: "Staff member holding a breast cancer screening sign",
    line: "Breast cancer screening in Uyo",
  },
  "hand_holding_samples_in_tube.png": {
    alt: "Gloved hands holding blood sample tubes in the laboratory",
    line: "Samples prepared for the laboratory",
  },
  "hand_holding_tubes.png": {
    alt: "Gloved hands holding laboratory sample tubes",
    line: "Care in every collection",
  },
  "lab_scientsit_at_work.png": {
    alt: "Laboratory scientist at work",
    line: "Scientists at the bench",
  },
  "lab_tech_possing.png": {
    alt: "StreamTrust staff member in the centre waiting area",
    line: "A calm welcome at the centre",
  },
  "med_lab_scienties.png": {
    alt: "Medical laboratory scientists at StreamTrust",
    line: "The team behind your results",
  },
  "scientist_using_machine.png": {
    alt: "Laboratory scientist using an analyser",
    line: "Automated analysers on the bench",
  },
};

export type HeroSlide = GalleryPhoto & { line: string };

export function listHeroSlides(): HeroSlide[] {
  return listGalleryPhotos()
    .filter((photo) => photo.alt !== "StreamTrust Diagnostics")
    .map((photo) => {
      const copy = HERO_COPY[photo.file];
      if (!copy) return { ...photo, line: photo.alt };
      return { ...photo, alt: copy.alt, line: copy.line };
    });
}

export function photosForTopicPrefix(prefix: string) {
  const key = prefix.toLowerCase();
  return listGalleryPhotos().filter((photo) => {
    const stem = photo.file.replace(/\.[^.]+$/, "").toLowerCase();
    return stem === key || stem.startsWith(`${key}_`);
  });
}
