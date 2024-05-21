import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
  presetWebFonts,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        serif: ['Merriweather:400,700', 'Zen Old Mincho:400,700'],
        sans: ['Merriweather Sans:400,700', 'Zen Kaku Gothic New:400,700'],
        mono: ['M PLUS 1 Code:400,700'],
       },
    }),
  ]
});
