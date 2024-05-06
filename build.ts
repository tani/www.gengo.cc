import { PhpNode } from "php-wasm/PhpNode.mjs";
import { parse as toml_decode } from "@std/toml";
import { dirname } from "@std/path";
import * as io from "@cross/fs/io";
import * as ops from "@cross/fs/ops";

async function render(filename: string) {
    let body = "";
    const write = ({detail}: {detail: string}) => { body += detail;};
    const php = new PhpNode({ toml_decode, io });
    php.addEventListener("output", write);
    php.addEventListener("error", write);
    await php.run(`
      <?php
      function phpwasm_file_get_contents($file) {
        return vrzno_await(vrzno_env("io")->readFile('./src/'.$file, 'utf8'));
      }
      function phpwasm_include($file) {
        $content = vrzno_await(vrzno_env("io")->readFile('./src/'.$file, 'utf8'));
        $content = preg_replace('/include\\s*("[^"]*"|\\'[^\\']*\\'|(\\((?:[^()]++|(?2))*\\)))/', 'phpwasm_include($1)', $content);
        $content = preg_replace('/file_get_contents\\(([^()]*)\\)/', 'phpwasm_file_get_contents($1)', $content);
        eval('?>'.$content);
      }
      phpwasm_include('${filename}');
    `);
    return body;
}

async function generate(infile: string) {
    await ops.mkdir(dirname('dist/'+infile), { recursive: true })
    const outfile = 'dist/'+infile.replace(/\.php$/, '.html');
    await io.writeFile(outfile, await render(infile));
}

async function copy(infile: string) {
    await ops.mkdir(dirname('dist/'+infile), { recursive: true })
    await io.writeFile('dist/'+infile, await io.readFile('src/'+infile));
}

await generate('index.php');
await copy('static/portfolio_square_watercolor.jpg');
