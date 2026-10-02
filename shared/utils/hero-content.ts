import {
  findShortcodeMarkers,
  removeShortcodeMarkers,
} from "./shortcode-markers.ts";
import type { ShortcodeMarker } from "./shortcode-markers.ts";
import { sectionAnchorId } from "./section-anchor.ts";

export type HeroStyle = "none" | "band" | "photo";

export interface HeroImage {
  path: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface HeroInput {
  style: string | undefined;
  sections: { uid?: string; anchor?: string; title?: string; body?: string }[];
  textImages: { data: { uniqId: string; img: HeroImage | null } }[] | undefined;
  headerCtaLabel: string;
}

export interface HeroContent {
  enabled: boolean;
  style: HeroStyle;
  title: string;
  // Оглавление и сайдбар ведут на `#<uid>` первой секции, а её заголовок в
  // хиро рисует уже не PostSections.
  titleId: string;
  biography: ShortcodeMarker | null;
  button: ShortcodeMarker | null;
  photo: { uniqId: string; img: HeroImage } | null;
  leadBody: string;
}

const firstPhoto = (
  markers: ShortcodeMarker[],
  textImages: NonNullable<HeroInput["textImages"]>,
): HeroContent["photo"] => {
  for (const marker of markers) {
    if (marker.name !== "text-image") {
      continue;
    }

    const img = textImages.find((entry) => entry.data.uniqId === marker.uniqId)
      ?.data.img;

    if (img?.path) {
      return { uniqId: marker.uniqId, img };
    }
  }

  return null;
};

/**
 * Что из лида статьи уезжает в хиро-полосу. Автор и кнопка переезжают
 * маркером целиком — первый экземпляр, остальные остаются в лиде. Из блока
 * «картинка + текст» уезжает только картинка: маркер остаётся в лиде, и
 * PostTextImage рисует там текст и кнопку без неё.
 */
export const resolveHeroContent = ({
  style,
  sections,
  textImages,
  headerCtaLabel,
}: HeroInput): HeroContent => {
  const heroStyle: HeroStyle =
    style === "band" || style === "photo" ? style : "none";
  const lead = sections[0];
  const body = lead?.body || "";

  const base: HeroContent = {
    enabled: false,
    style: heroStyle,
    title: lead?.title || "",
    titleId: sectionAnchorId(lead),
    biography: null,
    button: null,
    photo: null,
    leadBody: body,
  };

  if (heroStyle === "none" || !lead) {
    return base;
  }

  const markers = findShortcodeMarkers(body);
  const first = (name: string) =>
    markers.find((marker) => marker.name === name) || null;

  const biography = first("biography-writer");
  // Кнопка шапки старше статейной: она есть на каждой странице сайта, а
  // `button-ref` лида — только там, где его поставил редактор.
  const button = headerCtaLabel ? null : first("button-ref");
  const moved = [biography, button].filter(
    (marker): marker is ShortcodeMarker => Boolean(marker),
  );

  return {
    ...base,
    enabled: true,
    biography,
    button,
    photo: heroStyle === "photo" ? firstPhoto(markers, textImages || []) : null,
    leadBody: removeShortcodeMarkers(body, moved),
  };
};
