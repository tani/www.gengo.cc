 customElements.define("x-math", class extends HTMLElement {
     async connectedCallback() {
         const { TeX } = await import("mathjax-full/mjs/input/tex.js");
         const { CHTML } = await import("mathjax-full/mjs/output/chtml.js");
         const { browserAdaptor } = await import("mathjax-full/mjs/adaptors/browserAdaptor.js");
         const { RegisterHTMLHandler } = await import("mathjax-full/mjs/handlers/html.js");
         const { AssistiveMmlHandler } = await import("mathjax-full/mjs/a11y/assistive-mml.js");
         const { AllPackages } = await import("mathjax-full/mjs/input/tex/AllPackages.js");
         const { mathjax } = await import("mathjax-full/mjs/mathjax.js");
         const tex = new TeX({ packages: AllPackages });
         const chtml = new CHTML()
         const adaptor = browserAdaptor();
         const handler = RegisterHTMLHandler(adaptor);
         AssistiveMmlHandler(handler);
         const html = mathjax.document(document, { InputJax: tex, OutputJax: chtml });
         const shadow = this.attachShadow({ mode: "closed" });
         console.log(this.attributes.display)
         shadow.appendChild(html.convert(this.innerHTML, { display: this.attributes.display ?? false }));
         shadow.appendChild(chtml.styleSheet(html));
     }
 });
customElements.define("x-abbr", class extends HTMLElement {
    connectedCallback() {
        // check if the device is a mobile
        if (!globalThis.matchMedia("(max-width: 768px)").matches) {
          const abbr = this.getAttribute("abbr") ?? this.innerHTML.replace(/[^A-Z]/g, "");
          const title = this.innerHTML.trim();
          const shadow = this.attachShadow({ mode: "closed" });
          shadow.innerHTML = `<abbr title="${title}">${abbr}</abbr>`;
        }
    }
});
customElements.define("x-code", class extends HTMLElement {
    async connectedCallback() {
        const { codeToHtml } = await import("shiki");
        const shadow = this.attachShadow({ mode: "closed" });
        shadow.innerHTML = await codeToHtml(this.innerHTML, {
            theme: this.getAttribute("theme") ?? "vitesse-light",
            lang: this.getAttribute("lang") ?? "text",
        });
    }
});
