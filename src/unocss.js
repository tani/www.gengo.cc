import "@unocss/runtime/preset-uno.global.js";
import "@unocss/runtime/preset-attributify.global.js";
import "@unocss/runtime/preset-typography.global.js";
import "@unocss/runtime/preset-web-fonts.global.js";
window.__unocss = {
    presets: [
    () => window.__unocss_runtime.presets.presetUno(),
    () => window.__unocss_runtime.presets.presetAttributify(),
    () => window.__unocss_runtime.presets.presetTypography(),
    () => window.__unocss_runtime.presets.presetWebFonts({
        provider: 'bunny',
        inlineImports: false,
        fonts: {
        sans: [{
            name: 'Hind',
            weights: ['300', '400', '500', '600', '700']
        }, {
            name: 'Zen Kaku Gothic New',
            weights: ['300', '400', '500', '700', '900']
        }],
        mono: [{
            name: 'M PLUS 1 Code',
            weights: ['100', '200', '300', '400', '500', '600', '700'],
        }]
        }
    }),
    ],
}
import("@unocss/runtime/core.global.js");
