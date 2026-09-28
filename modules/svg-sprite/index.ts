import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { addComponent, defineNuxtModule } from "nuxt/kit";
import { buildSprite } from "./sprite";

// Спрайт — отдельный файл с хешем в `/_nuxt/`, а не строка во входном чанке:
// `<use href="…/icons.<hash>.svg#id">` из SSR рисует иконку до всякого JS, и
// файл кешируется между страницами. Пишется настоящим файлом, а не шаблоном
// Nuxt: шаблон в `#build` Vite видит виртуальным модулем и `?url` из него
// ассет не выпускает. `<svg-icon>` остаётся глобальным, как при
// nuxt-svg-sprite-icon, — вызовы в шаблонах не менялись.
export default defineNuxtModule({
  meta: { name: "svg-sprite" },
  setup(_options, nuxt) {
    const iconsDir = join(nuxt.options.srcDir, "assets/icons");
    const outputDir = join(nuxt.options.srcDir, "assets/icons-gen");
    const writeSprite = () => {
      const icons = readdirSync(iconsDir, { recursive: true, encoding: "utf8" })
        .filter((path) => path.endsWith(".svg"))
        .map((path) => ({
          path,
          svg: readFileSync(join(iconsDir, path), "utf8"),
        }));

      mkdirSync(outputDir, { recursive: true });
      writeFileSync(join(outputDir, "icons.svg"), buildSprite(icons));
    };

    writeSprite();

    addComponent({
      name: "SvgIcon",
      filePath: join(nuxt.options.srcDir, "components/common/SvgIcon.vue"),
      global: true,
    });

    nuxt.hook("builder:watch", (_event, path) => {
      if (/(^|\/)assets\/icons\//.test(path)) {
        writeSprite();
      }
    });
  },
});
