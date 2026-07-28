import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-function-type": "off",
    "vue/no-multiple-template-root": "off",
    "vue/no-v-html": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-dynamic-delete": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-empty": "off",
    "no-useless-catch": "off",
    "vue/html-self-closing": "off",
    "@typescript-eslint/consistent-type-imports": "off",
  },
});
