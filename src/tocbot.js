import slugify from "slugify";
import tocbot from "tocbot";
document.querySelectorAll("article :is(h2, h3, h4, h5)").forEach((e) => {
  e.id = slugify(e.textContent);
});
tocbot.init({
  tocSelector: "aside",
  contentSelector: "article",
  headingSelector: "h2, h3, h4, h5",
  hasInnerContainers: true,
  listClass: "toc-list",
});
