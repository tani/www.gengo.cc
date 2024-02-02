import { JSDOM, VirtualConsole } from 'jsdom';
import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import fs from 'fs/promises';

const app = new Hono();

app.get('/', (ctx) => ctx.redirect('/index.html'));
app.get('/*.html', async (ctx) => {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('error', (...e) => { console.error(...e) })
    const dom = await JSDOM.fromFile(`.${ctx.req.path}`, {
        runScripts: 'dangerously',
        resources: 'usable',
        pretendToBeVisual: true,
        virtualConsole,
        beforeParse(window) {
            window.fetch = fetch;
            window.__finalize = resolve;
            window.__cancel = reject;
        }
    });
    await promise;
    const html = dom.serialize();
    dom.window.close();
    return ctx.html(html);
});
app.get('/*.toml', async (ctx) => {
    ctx.req.path;
    const data = await fs.readFile(`.${ctx.req.path}`, 'utf-8');
    return ctx.text(data);
});
serve(app);
