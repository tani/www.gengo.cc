import { PhpNode } from "npm:php-wasm@0.0.8/PhpNode.mjs";
import { parse as toml_decode } from "jsr:@std/toml@0.224.0";
import { dirname } from "jsr:@std/path@0.224.0";

async function render(filename: string) {
    let body = "";
    const write = ({detail}) => { body += detail;};
    const php = new PhpNode({ toml_decode });
    php.addEventListener("output", write);
    php.addEventListener("error", write);
    await php.run(`
      <?php
      function phpwasm_include($file) {
        $window = new Vrzno;
        $content = vrzno_await($window->Deno->readTextFile('./src/'.$file));
        $content = preg_replace('/include\\s*("[^"]*"|\\'[^\\']*\\'|(\\((?:[^()]++|(?2))*\\)))/', 'phpwasm_include($1)', $content);
        eval('?>'.$content);
      }
      phpwasm_include('${filename}');
    `);
    return body;
}

async function generate(infile: string) {
    await Deno.mkdir(dirname('dist/'+infile), { recursive: true })
    let outfile = 'dist/'+infile.replace(/\.php$/, '.html');
    await Deno.writeTextFile(outfile, await render(infile));
}

async function copy(infile: string) {
    await Deno.mkdir(dirname('dist/'+infile), { recursive: true })
    await Deno.writeFile('dist/'+infile, await Deno.readFile('src/'+infile));
}

await generate('index.php');
await copy('static/portfolio_square_watercolor.jpg');