customElements.define("x-math", class extends HTMLElement {
    async connectedCallback() {
        const { TeX } = await import("mathjax-full/js/input/tex.js");
        const { SVG } = await import("mathjax-full/js/output/svg.js");
        const { browserAdaptor } = await import("mathjax-full/js/adaptors/browserAdaptor.js");
        const { RegisterHTMLHandler } = await import("mathjax-full/js/handlers/html.js");
        const { AssistiveMmlHandler } = await import("mathjax-full/js/a11y/assistive-mml.js");
        const { AllPackages } = await import("mathjax-full/js/input/tex/AllPackages.js");
        const { mathjax } = await import("mathjax-full/js/mathjax.js");
        const tex = new TeX({ packages: AllPackages });
        const svg = new SVG({ fontCache: "local" });
        const adaptor = browserAdaptor();
        const handler = RegisterHTMLHandler(adaptor);
        AssistiveMmlHandler(handler);
        const html = mathjax.document(document, { InputJax: tex, OutputJax: svg });
        const CSS = `
            svg a { fill: blue; stroke: blue; }
            [data-mml-node="merror"] > g { fill: red; stroke: red; }
            [data-mml-node="merror"] > rect[data-background] { fill: yellow; stroke: none; }
            [data-frame], [data-line] { stroke-width: 70px; fill: none; }
            .mjx-dashed { stroke-dasharray: 140; }
            .mjx-dotted { stroke-linecap: round; stroke-dasharray: 0, 140; }
            use[data-c] { stroke-width: 3px; }
        `;
        const shadow = this.attachShadow({ mode: "closed" });
        shadow.appendChild(html.convert(this.innerHTML, { display: this.attributes.display }));
        shadow.appendChild(svg.styleSheet(html));
        shadow.innerHTML += `<style>${CSS}</style>`;
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