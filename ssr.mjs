import { JSDOM, VirtualConsole } from 'jsdom';
import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import fs from 'fs/promises';

const app = new Hono();
app.get('/', (ctx) => ctx.redirect('/index.html'));
app.get('/index.html', async (ctx) => {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('error', (...e) => { console.error(...e); });
    virtualConsole.on('log', (...e) => { console.log(...e); });
    const dom = await JSDOM.fromURL(`http://localhost:3000/_ssr${ctx.req.path}`, {
        runScripts: 'dangerously',
        resources: 'usable',
        pretendToBeVisual: true,
        virtualConsole,
        beforeParse(window) {
            window.fetch = async (url) => {
                if (url.startsWith('http')) {
                    return fetch(url)
                } else {
                    const data = await fs.readFile(url)
                    return new Response(data)
                }
            }
            window.__finalize = resolve;
            window.__cancel = reject;
        }
    });
    await promise;
    const html = dom.serialize();
    dom.window.close();
    return ctx.html(html);
});
app.get('/publications.toml', async (ctx) => {
    const data = await fs.readFile(`.${ctx.req.path}`, 'utf-8');
    return ctx.text(data);
});
app.get('/_ssr/:filename', async (ctx) => {
    const data = await fs.readFile(`${ctx.req.param('filename')}`, 'utf-8');
    return ctx.html(data);
})
serve(app);
