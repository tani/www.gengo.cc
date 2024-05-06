import { PhpNode } from "php-wasm/PhpNode.mjs";
import { parse as toml_decode } from "@std/toml";
import * as path from "@std/path";
import * as io from "@cross/fs/io";
import * as ops from "@cross/fs/ops";

async function render(filename: string) {
    let body = "";
    const write = ({detail}: {detail: string}) => { body += detail;};
    const php = new PhpNode({ toml_decode, io, path });
    php.addEventListener("output", write);
    php.addEventListener("error", write);
    await php.run(`
      <?php
      function phpwasm_file_get_contents($file) {
        return vrzno_await(vrzno_env("io")->readFile($file, 'utf8'));
      }
      function phpwasm_include($file) {
        $root = dirname($file);
        $content = vrzno_await(vrzno_env("io")->readFile($file, 'utf8'));
        $content = preg_replace('/include\\s*("[^"]*"|\\'[^\\']*\\'|(\\((?:[^()]++|(?2))*\\)))/', 'phpwasm_include("'.$root.'/".$1)', $content);
        $content = preg_replace('/file_get_contents\\(([^()]*)\\)/', 'phpwasm_file_get_contents("'.$root.'/".$1)', $content);
        eval('?>'.$content);
      }
      phpwasm_include('${filename}');
    `);
    return body;
}

async function generate(infile: string) {
    const outfile = infile.replace(/src\//,'dist/').replace(/\.php$/, '.html');
    await ops.mkdir(path.dirname(outfile), { recursive: true })
    await io.writeFile(outfile, await render(infile));
}

async function copy(infile: string) {
    const outfile = infile.replace(/static\//,'dist/');
    await ops.mkdir(path.dirname(outfile), { recursive: true })
    await io.writeFile(outfile, await io.readFile(infile));
}

await generate('src/index.php');
await copy('src/static/portfolio_square_watercolor.jpg');
