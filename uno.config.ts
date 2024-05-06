import { defineConfig, presetUno, presetAttributify, presetTypography, presetWebFonts } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetWebFonts({
      provider: 'bunny',
      inlineImports: false,
      fonts: {
        sans: [{
          name: 'M PLUS 2',
          weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
        }],
        mono: [{
          name: 'M PLUS 1 Code',
          weights: ['100', '200', '300', '400', '500', '600', '700']
        }]
      }
    })
  ]
})
