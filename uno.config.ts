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
      provider: 'none',
      fonts: {
        serif: [{
          name: 'Merriweather',
          weights: ['400','700'],
        }, {
          name: 'Zen Old Mincho',
          weights: ['400','700'],
        }],
        sans: [{
          name: 'Merriweather Sans',
          weights: ['400','700'],
        }, {
          name: 'Zen Kaku Gothic New',
          weights: ['400','700'],
        }],
        mono: [{
          name: 'M PLUS 1 Code',
          weights: ['400','700'],
        }],
       },
    }),
  ]
});
