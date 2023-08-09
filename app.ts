import { Hono, Context } from "https://lib.deno.dev/x/hono@v3/mod.ts";
import { serveStatic } from "https://lib.deno.dev/x/hono@v3/middleware.ts";
import { serve } from "https://deno.land/std@0.191.0/http/server.ts";
import * as pod from "./pod.ts";

const app = new Hono();

app.get("/", (ctx) => ctx.redirect("/index.html") );

function checkDate(ctx: Context, content: string) {
  const date = content.match(/<meta name="date" content="(.*?)">/);
  if (date) {
    const now = new Date();
    const postDate = new Date(date[1]);
    if (postDate > now) {
      return ctx.html("404 Not found", 404);
    }
  }
  return ctx.html(content);
}

app.get("/:file{.*\\.html}", (ctx) => {
  const file = ctx.req.param("file").replace(".html", ".pod");
  const source = Deno.readTextFileSync(`./pages/${file}`);
  const result = pod.process(source);
  return checkDate(ctx, result);
})

app.get("/blog/:article{.*\\.html}", (ctx) => {
  const article = ctx.req.param("article").replace(".html", ".pod");
  const source = Deno.readTextFileSync(`./pages/blog/${article}`);
  const result = pod.process(source);
  return checkDate(ctx, result);
})

app.get("/*", serveStatic({ root: './static' }));


serve(app.fetch);
