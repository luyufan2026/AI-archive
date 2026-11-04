import { readableStyles, renderArchiveContent, renderReadableDocument } from './readableArchive.js';

export const fallbackMarker = '<!-- readable-archive-fallback -->';

// Generate both HTML entry points from the same data used by React; no user-agent branching.
export default function readableArchivePlugin() {
  return {
    name: 'readable-archive',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!html.includes(fallbackMarker)) throw new Error('Readable archive fallback marker is missing from index.html.');
        return html.replace(fallbackMarker, renderArchiveContent({ fallback: true }))
          .replace('</head>', `<style data-readable-archive>${readableStyles}</style>\n  </head>`);
      },
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0];
        if (!['/archive.html', '/archive.zh-Hant.html'].includes(path)) return next();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(renderReadableDocument({ language: path === '/archive.zh-Hant.html' ? 'zh-Hant' : 'en' }));
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'archive.html', source: renderReadableDocument() });
      this.emitFile({ type: 'asset', fileName: 'archive.zh-Hant.html', source: renderReadableDocument({ language: 'zh-Hant' }) });
    },
  };
}
