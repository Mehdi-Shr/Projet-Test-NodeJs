// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: { ...globals.node, ...globals.jest } } },
  pluginJs.configs.recommended,
  {
    files: ["**/*.test.js"],
    plugins: { jest: pluginJest },
    rules: pluginJest.configs.recommended.rules,
  },
];
