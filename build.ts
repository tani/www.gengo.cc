import { PhpNode } from "php-wasm/PhpNode.mjs";
import { parse as toml_decode } from "@std/toml";
import { FileTask, run } from "@tani/shake";
import * as fs from "fs/promises";
import * as path from "path";
import { globSync } from "glob";
import { $ } from "zx";

async function render(filename: string) {
  let body = "";
  const write = ({ detail }: { detail: string }) => {
    body += detail;
  };
  const php = new PhpNode({ toml_decode, fs });
  php.addEventListener("output", write);
  php.addEventListener("error", write);
  await php.run(`
    <?php
    function phpwasm_file_get_contents($file) {
      return vrzno_await(vrzno_env("fs")->readFile($file, 'utf8'));
    }
    function phpwasm_include($file) {
      $root = dirname($file);
      $content = vrzno_await(vrzno_env("fs")->readFile($file, 'utf8'));
      $content = preg_replace('/include\\s*("[^"]*"|\\'[^\\']*\\'|(\\((?:[^()]++|(?2))*\\)))/', 'phpwasm_include("'.$root.'/".$1)', $content);
      $content = preg_replace('/file_get_contents\\(([^()]*)\\)/', 'phpwasm_file_get_contents("'.$root.'/".$1)', $content);
      eval('?>'.$content);
    }
    phpwasm_include('${filename}');
  `);
  return body;
}

const index_php = new FileTask(
  "dist/index.html",
  globSync("src/*").map((file: string) => new FileTask(file)),
  async () => {
    const infile = "src/index.php";
    const outfile = `dist/index.html`;
    await $`mkdir -p ${path.dirname(outfile)}`;
    await fs.writeFile(outfile, await render(infile));
  },
);

const publications_php = new FileTask(
  "dist/publications.html",
  globSync("src/*").map((file: string) => new FileTask(file)),
  async () => {
    const infile = "src/publications.php";
    const outfile = `dist/publications.html`;
    await $`mkdir -p ${path.dirname(outfile)}`;
    await fs.writeFile(outfile, await render(infile));
  },
);

const links_php = new FileTask(
  "dist/links.html",
  globSync("src/*").map((file: string) => new FileTask(file)),
  async () => {
    const infile = "src/links.php";
    const outfile = `dist/links.html`;
    await $`mkdir -p ${path.dirname(outfile)}`;
    await fs.writeFile(outfile, await render(infile));
  },
);
const webp = new FileTask("dist/static/portfolio.avif", [
  new FileTask("src/static/portfolio.avif"),
], async () => {
  await $`mkdir -p dist/static`;
  await $`cp src/static/portfolio.avif dist/static/`;
});

const css = new FileTask(
  "dist/static/uno.css",
  [new FileTask("src/index.php")],
  async () => {
    await $`mkdir -p dist/static`;
    await $`unocss src/*.php -o dist/static/uno.css`;
  },
);

run(index_php, publications_php, links_php, webp, css);
