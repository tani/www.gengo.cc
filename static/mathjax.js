MathJax = {
  loader: {
    load: ['input/tex', 'ui/menu']
  },
  startup: {
    pageReady() {
      MathJax.startup.document.menu.menu.findID('Accessibility', 'AssistiveMml').disable();
      MathJax._.mathjax.mathjax.handleRetriesFor(() => MathJax.startup.document.render());
    }
  },
  options: {
    renderActions: {
      assistiveMml: [],
      typeset: [
        150,
        (doc) => {for (math of doc.math) {MathJax.config.renderMathML(math, doc)}},
          (math, doc) => MathJax.config.renderMathML(math, doc)
      ]
    },
    menuOptions: {
      settings: {
        assistiveMml: false
      }
    }
  },
  renderMathML(math, doc) {
    math.typesetRoot = document.createElement('mjx-container');
    math.typesetRoot.innerHTML = MathJax.startup.toMML(math.root);
    math.display && math.typesetRoot.setAttribute('display', 'block');
  }
};
