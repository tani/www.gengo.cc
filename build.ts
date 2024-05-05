import { PhpNode } from "php-wasm/PhpNode.mjs";
import { parse as toml_decode } from "@std/toml";
import { dirname } from "@std/path";
import * as fs from "fs/promises";

async function render(filename: string) {
    let body = "";
    const write = ({detail}) => { body += detail;};
    const php = new PhpNode({ toml_decode, readTextFile: (filename) => fs.readFile(filename, { encoding: "utf-8" }) });
    php.addEventListener("output", write);
    php.addEventListener("error", write);
    await php.run(`
      <?php
      function phpwasm_include($file) {
        $window = new Vrzno;
        $readTextFile = vrzno_env('readTextFile');
        $content = vrzno_await($readTextFile('./src/'.$file));
        $content = preg_replace('/include\\s*("[^"]*"|\\'[^\\']*\\'|(\\((?:[^()]++|(?2))*\\)))/', 'phpwasm_include($1)', $content);
        eval('?>'.$content);
      }
      phpwasm_include('${filename}');
    `);
    return body;
}

async function generate(infile: string) {
    await fs.mkdir(dirname('dist/'+infile), { recursive: true })
    let outfile = 'dist/'+infile.replace(/\.php$/, '.html');
    await fs.writeFile(outfile, await render(infile));
}

async function copy(infile: string) {
    await fs.mkdir(dirname('dist/'+infile), { recursive: true })
    await fs.writeFile('dist/'+infile, await fs.readFile('src/'+infile));
}

await generate('index.php');
await copy('static/portfolio_square_watercolor.jpg');