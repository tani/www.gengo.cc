import { Hono } from "https://lib.deno.dev/x/hono@v3/mod.ts";
import { serveStatic } from "https://lib.deno.dev/x/hono@v3/middleware.ts";
import { serve } from "https://deno.land/std@0.191.0/http/server.ts";
import * as pod from "./pod.ts";

const app = new Hono();

app.get("/", (ctx) => ctx.redirect("/index.html") );

app.get("/:file{.*\\.html}", (ctx) => {
  const file = ctx.req.param("file").replace(".html", ".pod");
  const source = Deno.readTextFileSync(`./pages/${file}`);
  const result = pod.process(source);
  return ctx.html(result);
})

app.get("/*", serveStatic({ root: './static' }));

serve(app.fetch);
