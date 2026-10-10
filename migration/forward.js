/* Purpose-specific Test Pages forwarding with KeepMake data recovery. */
(function () {
  if (location.hostname !== 'jonathankhobson.github.io') return;
  const parts = location.pathname.split('/');
  if (parts[1] !== 'Test') return;
  if (new URLSearchParams(location.search).get('_legacy') === '1') return;
  const page = parts[2] || 'index.html';
  const routes = {
    'index.html': 'https://kyle-shareables.jkylehobson.chatgpt.site/tools/',
    'pdf-combiner.html': 'https://kyle-shareables.jkylehobson.chatgpt.site/tools/pdf-combiner.html',
    'timezoneconverter.html': 'https://kyle-shareables.jkylehobson.chatgpt.site/tools/timezoneconverter.html',
    'keepmake.html': 'https://kyle-shareables.jkylehobson.chatgpt.site/tools/keepmake.html',
    'test-persona.html': 'https://kyle-shareables.jkylehobson.chatgpt.site/tools/persona-builder.html',
    'TileDrawer.html': 'https://gamemaster-kyle.jkylehobson.chatgpt.site/tools/tile-drawer.html',
    'TileDrawerTTRPG.html': 'https://gamemaster-kyle.jkylehobson.chatgpt.site/tools/tile-drawer-ttrpg.html'
  };
  if (!Object.prototype.hasOwnProperty.call(routes, page)) return;
  const destination = new URL(routes[page]);
  destination.search = location.search;
  destination.hash = location.hash;
  if (page === 'keepmake.html') {
    let raw = null;
    let readError = false;
    try { raw = localStorage.getItem('memories'); }
    catch (_) { readError = true; }
    let emptyArray = false;
    if (raw) {
      try { const parsed = JSON.parse(raw); emptyArray = Array.isArray(parsed) && parsed.length === 0; }
      catch (_) { /* A malformed nonempty value still needs recovery. */ }
    }
    if (readError || (raw && !emptyArray)) {
      addEventListener('DOMContentLoaded', function () {
        const main = document.createElement('main');
        main.style.cssText = 'box-sizing:border-box;max-width:42rem;margin:3rem auto;padding:0 1.25rem;font:1.1rem/1.55 system-ui,sans-serif;color:#17211f';
        const heading = document.createElement('h1');
        heading.textContent = 'Your KeepMake entries are still here';
        main.append(heading);
        const explanation = document.createElement('p');
        explanation.textContent = readError
          ? 'This browser would not let us check local saved entries. Open the original page to review them before moving to the new KeepMake.'
          : 'This browser has entries saved at the original address. Download an exact copy, then open the new KeepMake and import the JSON file. Your original entries will stay in this browser.';
        main.append(explanation);
        const list = document.createElement('ul');
        function link(label, href, download) {
          const item = document.createElement('li');
          const anchor = document.createElement('a');
          anchor.textContent = label;
          anchor.href = href;
          if (download) anchor.download = download;
          item.append(anchor);
          list.append(item);
        }
        if (!readError && raw !== null) {
          const file = new Blob([raw], {type:'application/json'});
          link('Download saved memories JSON', URL.createObjectURL(file), 'keepmake-memories.json');
        }
        link('Open new KeepMake and import', destination.href);
        const original = new URL(location.href);
        original.searchParams.set('_legacy', '1');
        link('Stay on the original page', original.href);
        main.append(list);
        document.body.replaceChildren(main);
        document.title = 'KeepMake saved entries · Move to the new site';
      });
      return;
    }
  }
  location.replace(destination.href);
})();
