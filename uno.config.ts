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
      provider: 'bunny',
      fonts: {
        serif: ['Merriweather', 'Zen Old Mincho'],
        sans: ['Merriweather Sans', 'Zen Kaku Gothic New'],
        mono: ['M PLUS 1 Code']
      },
    }),
  ]
});
