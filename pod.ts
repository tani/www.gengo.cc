import { LuaFactory } from "https://jspm.dev/wasmoon@1.15.0"

const rawCode = await fetch("https://pod.deno.dev/podium.lua")
  .then(r => r.text())
  .then(r => r.replace("#!/usr/bin/env lua", ""))
const luaFactory = new LuaFactory('https://unpkg.com/wasmoon@1.15.0/dist/glue.wasm')
const lua = await luaFactory.createEngine()
const podium = await lua.doString(rawCode)

podium.PodiumBackend.registerSimpleFormattingCode("html", "P", argument => {
  const [short, long] = argument.split("|");
  return `<span class="text-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="${long}">${short}</span>`
})

podium.PodiumBackend.registerSimple("html", "preamble", source => {
  const title = source.match(/^=head1(.*?)$/m)?.[1] ?? "Untitled";
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="author" content="Masaya Taniguchi">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - M. Taniguchi's Website</title>
  <link rel="icon" href="/lambdasurge_min.png">
  <link rel="preconnect" href="https://cdn.jsdelivr.net">
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
  <link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@4/400.min.css">
  <link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@4/700.min.css">
  <link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="https://cdn.jsdelivr.net/npm/@fontsource/fira-sans@4/400.min.css">
  <link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="https://cdn.jsdelivr.net/npm/@fontsource/fira-sans@4/700.min.css">
  <link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="https://cdn.jsdelivr.net/npm/@fontsource/fira-sans-extra-condensed@4/400.min.css">
  <link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="https://cdn.jsdelivr.net/npm/@fontsource/fira-sans-condensed@4/500.min.css">
  <link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="https://cdn.jsdelivr.net/npm/@fontsource/fira-code@4/400.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tocbot@4/dist/tocbot.min.css">
<!--
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap-reboot.min.css">
-->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="/base.css">
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/startup.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/js/bootstrap.bundle.min.js"></script>
  <script type="module" src="/tocbot.js"></script>
  <script src="/mathjax.js"></script>
</head>
<body>
  <header>
    <h1>M. Taniguchi's Website</h1>
    <nav>
      <ul>
        <li><a href="/index.html">Home</a></li>
        <li><a href="/publications.html">Publications</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <div>
      <nav class="toc"></nav>
    </div>
    <div>
      <article class="content">
  `
})

podium.PodiumBackend.registerSimple("html", "postamble", source => {
  return `
      </article>
    </div>
  </main>
  <footer>
    <p>Copyright 2023 TANIGUCHI Masaya</p>
  </footer>
</body>
</html>
  `
})

export function process(source: string): string {
  return podium.process("html", source)
}
