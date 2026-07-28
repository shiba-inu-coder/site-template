export const useFakeRefLink = ({
  type,
  slug,
}: {
  type: RefLinkType;
  slug?: string;
}) => {
  if (!slug) {
    return `/`;
  } else {
    if (type === "bookmaker") {
      return `/go/sazkove-kancelare/${slug}`;
    } else {
      return `/go/casino/${slug}`;
    }
  }
};
