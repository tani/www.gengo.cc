import slug from "https://cdn.jsdelivr.net/npm/slug@8/+esm";
import tocbot from "https://cdn.jsdelivr.net/npm/tocbot@4/+esm";
document.querySelectorAll(".content :is(h1, h2, h3, h4, h5)").forEach((e) => {
  e.id = slug(e.textContent, {lower: true})
});
tocbot.init({
  tocSelector: '.toc',
  contentSelector: '.content',
  headingSelector: 'h1, h2, h3, h4, h5',
  hasInnerContainers: true,
});
