<template>
  <div class="ribbon text-surface-text absolute left-0 top-0">
    <span> <slot></slot> <span class="pl-1">🏆</span></span>
  </div>
</template>
<style>
.ribbon {
  font-size: 28px;
  font-weight: 600;
}
.ribbon {
  --r: 0.8em; /* control the cutout */

  padding-right: calc(var(--r) + 0.15em);
  padding-left: calc(var(--r) + 0.15em);
  line-height: 1.8;
  font-size: 14px;
  clip-path: polygon(
    -100vw 0,
    calc(100% - var(--r)) 0,
    100% 50%,
    calc(100% - var(--r)) 100%,
    -100vw 100%
  );
  border-image: conic-gradient(var(--color-accent-300) 0 0) fill 0;
  width: fit-content;
}
</style>
