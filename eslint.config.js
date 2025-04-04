import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import oxlint from 'eslint-plugin-oxlint'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/rand.js', '**/fingerprint.js'],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  ...oxlint.configs['flat/recommended'],
  skipFormatting,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/block-lang': ['off'],
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
])
