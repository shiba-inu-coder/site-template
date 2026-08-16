import { initialClientStatePost } from "#shared/constants/initial-states";
import deepClone from "rfdc/default";
import "dayjs/locale/cs";

export const usePost = <E>() => {
  const { $api } = useNuxtApp();

  const state = useState<{
    currentPost: IPostBySlug<E>;
  }>("post", () => shallowRef({ currentPost: { ...initialClientStatePost } }));

  const title = computed(() => state.value.currentPost.title);
  const metaTags = computed(() => state.value.currentPost.metaTag);
  const content = computed(() => state.value.currentPost.content);
  const sections = computed(() => state.value.currentPost.sections ?? []);
  const isActive = computed(() => state.value.currentPost.isActive);
  const slug = computed(() => state.value.currentPost.slug);
  const tableContent = computed(() =>
    state.value.currentPost.shortcodesConfig.tableContent.data.filter(
      (item) => item.isActive,
    ),
  );
  const banner = computed(() => state.value.currentPost.banner);
  const introImg = computed(() => state.value.currentPost.introImg);
  const createdAt = computed(() => state.value.currentPost.createdAt);
  const updatedAt = computed(() => state.value.currentPost.updatedAt);
  const entity = computed(() => state.value.currentPost.entity);
  const faq = computed(() => state.value.currentPost.shortcodesConfig.faq);
  const intro = computed(() => state.value.currentPost.intro);
  const breadcrumbs = computed(() => state.value.currentPost.breadcrumbs);
  const entityBonus = computed(() => state.value.currentPost.entityBonus);
  const postDated = computed(
    () =>
      state.value.currentPost.datePosted || state.value.currentPost.updatedAt,
  );
  function getShortcode(params: {
    uniqId: string;
    shortcode: "gridCards";
  }): IPostBySlug["shortcodesConfig"]["gridCards"][number] | undefined;
  function getShortcode(params: {
    uniqId: string;
    shortcode: "casinoRatings";
  }): IPostBySlug["shortcodesConfig"]["casinoRatings"][number] | undefined;
  function getShortcode(params: {
    uniqId: string;
    shortcode: "bookmakerRatings";
  }): IPostBySlug["shortcodesConfig"]["bookmakerRatings"][number] | undefined;
  function getShortcode(params: {
    uniqId: string;
    shortcode: "casinoBonuses";
  }): IPostBySlug["shortcodesConfig"]["casinoBonuses"][number] | undefined;
  function getShortcode(params: {
    uniqId: string;
    shortcode: "bookmakerBonuses";
  }): IPostBySlug["shortcodesConfig"]["bookmakerBonuses"][number] | undefined;
  function getShortcode(params: {
    uniqId: string;
    shortcode: "prosConsPosts";
  }): IPostBySlug["shortcodesConfig"]["prosConsPosts"][number] | undefined;
  function getShortcode(params: {
    uniqId: string;
    shortcode: "biographyWriters";
  }): IPostBySlug["shortcodesConfig"]["biographyWriters"][number] | undefined;
  function getShortcode(params: {
    uniqId: string;
    shortcode: "dataTables";
  }): IPostBySlug["shortcodesConfig"]["dataTables"][number] | undefined;
  function getShortcode(params: {
    uniqId: string;
    shortcode: "miniBookmakerReviews";
  }):
    | IPostBySlug["shortcodesConfig"]["miniBookmakerReviews"][number]
    | undefined;
  function getShortcode(params: {
    uniqId: string;
    shortcode: "miniCasinoReviews";
  }): IPostBySlug["shortcodesConfig"]["miniCasinoReviews"][number] | undefined;
  function getShortcode(params: {
    uniqId: string;
    shortcode: "textImages";
  }): IPostBySlug["shortcodesConfig"]["textImages"][number] | undefined;
  function getShortcode({
    uniqId,
    shortcode,
  }: {
    uniqId: string;
    shortcode: Extract<
      keyof IPostBySlug["shortcodesConfig"],
      | "gridCards"
      | "listsCards"
      | "gridCardsWithButton"
      | "sliders"
      | "bookmakerRatings"
      | "casinoRatings"
      | "casinoBonuses"
      | "bookmakerBonuses"
      | "imgBlocks"
      | "prosConsPosts"
      | "biographyWriters"
      | "dataTables"
      | "miniCasinoReviews"
      | "miniBookmakerReviews"
      | "textImages"
    >;
  }) {
    const post = state.value.currentPost as IPostBySlug;
    return post.shortcodesConfig[shortcode].find(
      (table) => table.data.uniqId === uniqId,
    );
  }

  const setPost = (post: ObjectIdToStr<IPostBySlug<E>>) => {
    const { _id: _, isDeleted: ___, ...restPost } = post;

    state.value.currentPost =
      deepClone<ObjectIdToStr<IPostBySlug<E>>>(restPost);
  };

  // preview — токен из адреса страницы. Сам он сюда не долетает: $api это
  // голый $fetch без переноса запроса, и параметр надо передать руками.
  // Пустой в query не кладём, иначе у обычного посетителя ключ кеша nginx
  // отличался бы от того же адреса без него.
  const GET_POST_BY_SLUG = <E>(slug: string, preview = "") => {
    return $api()<ObjectIdToStr<IPostBySlug<E>>>("/api/v1/public/posts/slug", {
      query: preview ? { slug, preview } : { slug },
    });
  };

  return {
    GET_POST_BY_SLUG,
    introImg,
    entityBonus,
    setPost,
    entity,
    postDated,
    isActive,
    sections,
    intro,
    breadcrumbs,
    getShortcode,
    faq,
    title,
    updatedAt,
    createdAt,
    banner,
    tableContent,
    slug,
    content,
    metaTags,
  };
};
