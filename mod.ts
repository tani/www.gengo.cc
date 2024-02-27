import { Hono } from "https://deno.land/x/hono@v4.0.7/mod.ts";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import { PhpNode } from "npm:php-wasm@0.0.8/PhpNode.mjs";
import * as TOML from "npm:smol-toml@1.1.4";

const app = new Hono();

app.get('/', (c) => c.redirect('/index.php'));
app.get('/static/*', serveStatic({ root: './src' }));
app.get('/:filename{.+\\.php$}', async (context) => {
  const filename = context.req.param('filename');
  let body = "";
  const write = ({detail}) => { body += detail;};
  const php = new PhpNode({TOML});
  php.addEventListener("output", write);
  php.addEventListener("error", write);
  await php.run(`
    <?php
    function phpwasm_include($file) {
      $window = new Vrzno;
      $content = $window->Deno->readTextFileSync('./src/'.$file);
      $content = preg_replace('/include\\s*("[^"]*"|\\'[^\\']*\\'|(\\((?:[^()]++|(?2))*\\)))/', 'phpwasm_include($1)', $content);
      eval('?>'.$content);
    }
    phpwasm_include('${filename}');
  `);
  return context.html(body);
});

Deno.serve(app.fetch);
