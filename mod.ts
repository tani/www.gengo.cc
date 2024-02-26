import { Hono } from "https://deno.land/x/hono@v4.0.7/mod.ts";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import { PhpNode } from "npm:php-wasm@0.0.8/PhpNode.mjs";

const app = new Hono();

app.use('/static/*', serveStatic({ root: './src/static/' }));
app.get('/:filename{.+\\.php$}', async (context) => {
  const filename = context.req.param('filename');
  let body = "";
  const write = ({detail}) => { body += detail;};
  const php = new PhpNode();
  php.addEventListener("output", write);
  php.addEventListener("error", write);
  await php.run(`
    <?php
    function phpwasm_include($file) {
      $window = new Vrzno;
      eval('?>'.$window->Deno->readTextFileSync('./src/'.$file));
    }
    phpwasm_include('${filename}');
  `);
  return context.html(body);
});

Deno.serve(app.fetch);