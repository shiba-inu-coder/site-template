<template>
  <div v-show="isShow">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    scrollY?: number;
    hide?: boolean;
  }>(),
  {
    scrollY: 0,
    hide: true,
  },
);

const isShow = ref(false);

let observer: IntersectionObserver | undefined;
let markers: HTMLElement[] = [];

const addMarker = (style: string) => {
  const marker = document.createElement("div");

  marker.setAttribute("aria-hidden", "true");
  marker.style.cssText = `pointer-events:none;visibility:hidden;${style}`;
  document.body.append(marker);

  return marker;
};

// Две метки под IntersectionObserver вместо обработчика scroll, который на
// каждом кадре прокрутки читал `offsetHeight`: браузер сам сообщает, когда
// страница ушла ниже порога и когда показался её низ. Метки живут в конце
// `body`, а не в шаблоне: нижняя обязана стоять после подвала, а верхняя —
// отсчитываться от начала документа, а не от ближайшего `relative`.
onMounted(() => {
  // Нулевая высота при пороге 0 законна: пересечение, касающееся края
  // экрана, наблюдатель тоже считает пересечением.
  const top = addMarker(
    `position:absolute;top:0;left:0;width:1px;height:${props.scrollY}px`,
  );
  // Последние 5 px документа — та же зона, что раньше `offsetHeight - 5`.
  const bottom = addMarker("height:5px;margin-top:-5px");
  let pastThreshold = false;
  let atBottom = false;

  markers = [top, bottom];
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === top) {
        pastThreshold = !entry.isIntersecting;
      } else {
        atBottom = entry.isIntersecting;
      }
    }

    isShow.value = pastThreshold && !(props.hide && atBottom);
  });
  observer.observe(top);
  observer.observe(bottom);
});

onUnmounted(() => {
  observer?.disconnect();
  markers.forEach((marker) => marker.remove());
});
</script>
