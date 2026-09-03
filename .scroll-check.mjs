const targets = await (await fetch('http://127.0.0.1:9222/json')).json();
const page = targets.find((t) => t.type === 'page');
if (!page) {
  console.error('No page target found');
  process.exit(1);
}
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const i = ++id;
    pending.set(i, resolve);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
await new Promise((r) => (ws.onopen = r));
const evalJs = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  return r.result?.result?.value;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await evalJs(`document.fonts.ready`);
await wait(1500);
// disable smooth scrolling for a deterministic test
await evalJs(`document.documentElement.style.scrollBehavior = 'auto'`);
const maxScroll = await evalJs(`document.documentElement.scrollHeight - innerHeight`);
console.log('max scrollable:', maxScroll);

// fresh page state: clear hash first
await evalJs(`history.replaceState(null, '', location.pathname)`);
await evalJs(`scrollTo(0, ${maxScroll})`);
await wait(300);
const scrolled = await evalJs(`scrollY`);
await evalJs(`document.querySelector('.brand').click()`);
await wait(500);
const afterBrand = await evalJs(`scrollY`);
const hashBrand = await evalJs(`location.hash`);

// footer test
await evalJs(`history.replaceState(null, '', location.pathname)`);
await evalJs(`scrollTo(0, ${maxScroll})`);
await wait(300);
await evalJs(`document.querySelector('.footer-inner a[href="#top"]').click()`);
await wait(500);
const afterFooter = await evalJs(`scrollY`);
const hashFooter = await evalJs(`location.hash`);

console.log(JSON.stringify({ scrolled, afterBrand, hashBrand, afterFooter, hashFooter }, null, 2));
ws.close();
process.exit(0);