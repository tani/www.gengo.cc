<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="author" content="Masaya Taniguchi" />
<meta name="description" content="Masaya Taniguchi's profile" />
<title><?php $title ?></title>
<link rel="icon" href="https://cdn.jsdelivr.net/npm/@twemoji/svg@15/1f363.svg" />

<script type="importmap">
    <?php phpwasm_include("importmap.json"); ?>
</script>

<script type="module">
    <?php phpwasm_include("unocss.js") ?>
</script>

<script type="module">
    <?php phpwasm_include("elements.js") ?>
</script>

<script type="module">
import Alpine from "alpinejs";
import * as TOML from "smol-toml";
const response = await fetch("/static/publications.toml");
const text = await response.text();
const { publications } = TOML.parse(text);
publications.sort((a, b) => ((b.year - a.year) || (b.month ?? 0) - (a.month ?? 0)));
Alpine.data("app", () => ({ publications }));
Alpine.start();
</script>

<script type="module">
import slugify from "slugify";
import tocbot from "tocbot";
document.querySelectorAll("article :is(h2, h3, h4, h5)").forEach((e) => {
    e.id = slugify(e.textContent)
});
tocbot.init({
    tocSelector: 'aside',
    contentSelector: 'article',
    headingSelector: 'h2, h3, h4, h5',
    hasInnerContainers: true,
    listClass: "toc-list"
});
</script>