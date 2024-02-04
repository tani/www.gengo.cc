customElements.define("x-math", class extends HTMLElement {
    async connectedCallback() {
        const { default: build } = await import("https://esm.sh/build");
        const mod = await build({
            dependencies: {
                "mathjax-full": "^3.2.2"
            },
            code: `
                export {TeX} from "npm:mathjax-full/js/input/tex.js";
                export {SVG} from "npm:mathjax-full/js/output/svg.js";
                export {browserAdaptor} from "npm:mathjax-full/js/adaptors/browserAdaptor.js";
                export {RegisterHTMLHandler} from "npm:mathjax-full/js/handlers/html.js";
                export {AssistiveMmlHandler} from "npm:mathjax-full/js/a11y/assistive-mml.js";
                export {AllPackages} from "npm:mathjax-full/js/input/tex/AllPackages.js";
                export {mathjax} from "npm:mathjax-full/js/mathjax.js";
            `
        });
        const MathJax = await import(mod.bundleUrl);
        const tex = new MathJax.TeX({ packages: MathJax.AllPackages });
        const svg = new MathJax.SVG({ fontCache: "local" });
        const adaptor = MathJax.browserAdaptor();
        const handler = MathJax.RegisterHTMLHandler(adaptor);
        MathJax.AssistiveMmlHandler(handler);
        const html = MathJax.mathjax.document(document, { InputJax: tex, OutputJax: svg });
        const CSS = `
            svg a { fill: blue; stroke: blue; }
            [data-mml-node="merror"] > g { fill: red; stroke: red; }
            [data-mml-node="merror"] > rect[data-background] { fill: yellow; stroke: none; }
            [data-frame], [data-line] { stroke-width: 70px; fill: none; }
            .mjx-dashed { stroke-dasharray: 140; }
            .mjx-dotted { stroke-linecap: round; stroke-dasharray: 0, 140; }
            use[data-c] { stroke-width: 3px; }
        `;
        const node = html.convert(this.innerHTML, { display: this.attributes.display });
        let output = adaptor.outerHTML(node);
        output = output.replace(/<defs>/, '<defs><style>' + CSS + '</style>');
        output += '<style>' + adaptor.textContent(svg.styleSheet(html)) + '</style>';
        const shadow = this.attachShadow({ mode: "closed" });
        shadow.innerHTML = output;
    }
});
customElements.define("x-abbr", class extends HTMLElement {
    connectedCallback() {
        const abbr = this.getAttribute("abbr") ?? this.innerHTML.replace(/[^A-Z]/g, "");
        const title = this.innerHTML.trim();
        const shadow = this.attachShadow({ mode: "closed" });
        shadow.innerHTML = `<abbr title="${title}">${abbr}</abbr>`;
    }
});
customElements.define("x-code", class extends HTMLElement {
    async connectedCallback() {
        const { codeToHtml } = await import("https://esm.sh/shiki@1.0.0-beta.5");
        const shadow = this.attachShadow({ mode: "closed" });
        shadow.innerHTML = await codeToHtml(this.innerHTML, {
            theme: this.getAttribute("theme") ?? "vitesse-light",
            lang: this.getAttribute("lang") ?? "text",
        });
    }
});