var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// _worker.js/index.js
import("node:buffer").then(({ Buffer: Buffer2 }) => {
  globalThis.Buffer = Buffer2;
}).catch(() => null);
var __ALSes_PROMISE__ = import("node:async_hooks").then(({ AsyncLocalStorage }) => {
  globalThis.AsyncLocalStorage = AsyncLocalStorage;
  const envAsyncLocalStorage = new AsyncLocalStorage();
  const requestContextAsyncLocalStorage = new AsyncLocalStorage();
  globalThis.process = {
    env: new Proxy(
      {},
      {
        ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(envAsyncLocalStorage.getStore()), "ownKeys"),
        getOwnPropertyDescriptor: /* @__PURE__ */ __name((_2, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
        get: /* @__PURE__ */ __name((_2, property) => Reflect.get(envAsyncLocalStorage.getStore(), property), "get"),
        set: /* @__PURE__ */ __name((_2, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value), "set")
      }
    )
  };
  globalThis[/* @__PURE__ */ Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()), "ownKeys"),
      getOwnPropertyDescriptor: /* @__PURE__ */ __name((_2, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
      get: /* @__PURE__ */ __name((_2, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property), "get"),
      set: /* @__PURE__ */ __name((_2, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value), "set")
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var ae = Object.create;
var U = Object.defineProperty;
var ne = Object.getOwnPropertyDescriptor;
var re = Object.getOwnPropertyNames;
var ie = Object.getPrototypeOf;
var oe = Object.prototype.hasOwnProperty;
var E = /* @__PURE__ */ __name((e, t) => () => (e && (t = e(e = 0)), t), "E");
var V = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "V");
var ce = /* @__PURE__ */ __name((e, t, a, s) => {
  if (t && typeof t == "object" || typeof t == "function") for (let r of re(t)) !oe.call(e, r) && r !== a && U(e, r, { get: /* @__PURE__ */ __name(() => t[r], "get"), enumerable: !(s = ne(t, r)) || s.enumerable });
  return e;
}, "ce");
var q = /* @__PURE__ */ __name((e, t, a) => (a = e != null ? ae(ie(e)) : {}, ce(t || !e || !e.__esModule ? U(a, "default", { value: e, enumerable: true }) : a, e)), "q");
var x;
var u = E(() => {
  x = { collectedLocales: [] };
});
var f;
var d = E(() => {
  f = { version: 3, routes: { none: [{ src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308, continue: true }, { src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true, missing: [{ type: "header", key: "x-prerender-revalidate" }] }, { src: "^/500$", status: 500, continue: true }, { src: "^/?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/index.rsc", headers: { vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" }, continue: true, override: true }, { src: "^/((?!.+\\.rsc).+?)(?:/)?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/$1.rsc", headers: { vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" }, continue: true, override: true }], filesystem: [{ src: "^/index(\\.action|\\.rsc)$", dest: "/", continue: true }, { src: "^/_next/data/(.*)$", dest: "/_next/data/$1", check: true }, { src: "^/\\.prefetch\\.rsc$", dest: "/__index.prefetch.rsc", check: true }, { src: "^/(.+)/\\.prefetch\\.rsc$", dest: "/$1.prefetch.rsc", check: true }, { src: "^/\\.rsc$", dest: "/index.rsc", check: true }, { src: "^/(.+)/\\.rsc$", dest: "/$1.rsc", check: true }], miss: [{ src: "^/_next/static/.+$", status: 404, check: true, dest: "/_next/static/not-found.txt", headers: { "content-type": "text/plain; charset=utf-8" } }], rewrite: [{ src: "^/_next/data/(.*)$", dest: "/404", status: 404 }, { src: "^/dashboard/lessons/(?<nxtPid>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/dashboard/lessons/[id].rsc?nxtPid=$nxtPid" }, { src: "^/dashboard/lessons/(?<nxtPid>[^/]+?)(?:/)?$", dest: "/dashboard/lessons/[id]?nxtPid=$nxtPid" }, { src: "^/dashboard/quizzes/(?<nxtPid>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/dashboard/quizzes/[id].rsc?nxtPid=$nxtPid" }, { src: "^/dashboard/quizzes/(?<nxtPid>[^/]+?)(?:/)?$", dest: "/dashboard/quizzes/[id]?nxtPid=$nxtPid" }], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|gDu6mxliH1rGP9QoT8TKO)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }, { src: "^/index(?:/)?$", headers: { "x-matched-path": "/" }, continue: true, important: true }, { src: "^/((?!index$).*?)(?:/)?$", headers: { "x-matched-path": "/$1" }, continue: true, important: true }], error: [{ src: "^/.*$", dest: "/404", status: 404, headers: { "x-next-error-status": "404" } }, { src: "^/.*$", dest: "/500", status: 500, headers: { "x-next-error-status": "500" } }] }, images: { domains: [], sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 16, 32, 48, 64, 96, 128, 256, 384], remotePatterns: [], minimumCacheTTL: 60, formats: ["image/webp"], dangerouslyAllowSVG: false, contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;", contentDispositionType: "attachment" }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "500.html": { path: "500", contentType: "text/html; charset=utf-8" }, "_app.rsc.json": { path: "_app.rsc", contentType: "application/json" }, "_error.rsc.json": { path: "_error.rsc", contentType: "application/json" }, "_document.rsc.json": { path: "_document.rsc", contentType: "application/json" }, "404.rsc.json": { path: "404.rsc", contentType: "application/json" }, "_next/static/not-found.txt": { contentType: "text/plain" } }, framework: { slug: "nextjs", version: "15.5.18" }, crons: [] };
});
var _;
var p = E(() => {
  _ = { "/404.html": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/404.rsc.json": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/500.html": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc.json": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc.json": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc.json": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_next/static/chunks/122-99b26567c639b20b.js": { type: "static" }, "/_next/static/chunks/255-e881f48ae1d2333a.js": { type: "static" }, "/_next/static/chunks/278-29b0e18099448a88.js": { type: "static" }, "/_next/static/chunks/292-9e6667f881e424cd.js": { type: "static" }, "/_next/static/chunks/386-0e83e3dbe35dd9c5.js": { type: "static" }, "/_next/static/chunks/44530001-2cc67e5b0b9ffb12.js": { type: "static" }, "/_next/static/chunks/496-3a6606b151aec31a.js": { type: "static" }, "/_next/static/chunks/4bd1b696-409494caf8c83275.js": { type: "static" }, "/_next/static/chunks/596-79d7ee782c248189.js": { type: "static" }, "/_next/static/chunks/601-acc2db8995bb38f9.js": { type: "static" }, "/_next/static/chunks/634-11c1272ac4904ef4.js": { type: "static" }, "/_next/static/chunks/714-9a215b52b39a4aea.js": { type: "static" }, "/_next/static/chunks/720-37aecdd1da6cdaf7.js": { type: "static" }, "/_next/static/chunks/909-5ddd72afc5299466.js": { type: "static" }, "/_next/static/chunks/962-3802f7f93dae8c13.js": { type: "static" }, "/_next/static/chunks/981-419cd7889d79a397.js": { type: "static" }, "/_next/static/chunks/app/(auth)/layout-ad75df00ce45f3d5.js": { type: "static" }, "/_next/static/chunks/app/(auth)/login/page-eef3aa5ab32a0dda.js": { type: "static" }, "/_next/static/chunks/app/(auth)/signup/page-ed13b99d077b6ed8.js": { type: "static" }, "/_next/static/chunks/app/_not-found/page-0a667fb2d44a17c7.js": { type: "static" }, "/_next/static/chunks/app/about/page-dcfabf8388a6e1c1.js": { type: "static" }, "/_next/static/chunks/app/admin/layout-3f0b8ef4292e861a.js": { type: "static" }, "/_next/static/chunks/app/admin/page-f04d57d13a83f12d.js": { type: "static" }, "/_next/static/chunks/app/contact/page-98451e8bd12b01fc.js": { type: "static" }, "/_next/static/chunks/app/dashboard/announcements/page-cf864e0aa892ed1c.js": { type: "static" }, "/_next/static/chunks/app/dashboard/certificates/page-92387bc07a7a6581.js": { type: "static" }, "/_next/static/chunks/app/dashboard/help/page-ac68463b1cdecc11.js": { type: "static" }, "/_next/static/chunks/app/dashboard/layout-05f816146fb28c39.js": { type: "static" }, "/_next/static/chunks/app/dashboard/learning/page-dc1d51c513660cf5.js": { type: "static" }, "/_next/static/chunks/app/dashboard/lessons/[id]/page-e922ac3fb091dbea.js": { type: "static" }, "/_next/static/chunks/app/dashboard/library/page-190e1152b4759aad.js": { type: "static" }, "/_next/static/chunks/app/dashboard/page-f3248b38c6879ae1.js": { type: "static" }, "/_next/static/chunks/app/dashboard/progress/page-ace09149185bfc5f.js": { type: "static" }, "/_next/static/chunks/app/dashboard/quizzes/[id]/page-722225b810742720.js": { type: "static" }, "/_next/static/chunks/app/dashboard/quizzes/page-f7f79227f76ddfe8.js": { type: "static" }, "/_next/static/chunks/app/dashboard/resources/page-b0860a2de4b4e306.js": { type: "static" }, "/_next/static/chunks/app/dashboard/settings/page-77a4f370f3b4a5c2.js": { type: "static" }, "/_next/static/chunks/app/dashboard/support/page-3dedb03da645efe7.js": { type: "static" }, "/_next/static/chunks/app/layout-d638006ea806aa9b.js": { type: "static" }, "/_next/static/chunks/app/page-d0e27d60f9b2e716.js": { type: "static" }, "/_next/static/chunks/app/vacancies/page-26aa73995b4061d8.js": { type: "static" }, "/_next/static/chunks/framework-e2c84bf8dbc6c531.js": { type: "static" }, "/_next/static/chunks/main-8744520a8a31e6ae.js": { type: "static" }, "/_next/static/chunks/main-app-f03416a6ccc19c8f.js": { type: "static" }, "/_next/static/chunks/pages/_app-5addca2b3b969fde.js": { type: "static" }, "/_next/static/chunks/pages/_error-022e4ac7bbb9914f.js": { type: "static" }, "/_next/static/chunks/polyfills-42372ed130431b0a.js": { type: "static" }, "/_next/static/chunks/webpack-8a9d343779a1d40b.js": { type: "static" }, "/_next/static/css/833d155fb66377d3.css": { type: "static" }, "/_next/static/css/c88d456fa14f632a.css": { type: "static" }, "/_next/static/gDu6mxliH1rGP9QoT8TKO/_buildManifest.js": { type: "static" }, "/_next/static/gDu6mxliH1rGP9QoT8TKO/_ssgManifest.js": { type: "static" }, "/_next/static/media/19cfc7226ec3afaa-s.woff2": { type: "static" }, "/_next/static/media/21350d82a1f187e9-s.woff2": { type: "static" }, "/_next/static/media/636a5ac981f94f8b-s.p.woff2": { type: "static" }, "/_next/static/media/6fe53d21e6e7ebd8-s.woff2": { type: "static" }, "/_next/static/media/8e9860b6e62d6359-s.woff2": { type: "static" }, "/_next/static/media/8ebc6e9dde468c4a-s.woff2": { type: "static" }, "/_next/static/media/9e7b0a821b9dfcb4-s.woff2": { type: "static" }, "/_next/static/media/ba9851c3c22cd980-s.woff2": { type: "static" }, "/_next/static/media/c5fe6dc8356a8c31-s.woff2": { type: "static" }, "/_next/static/media/df0a9ae256c0569c-s.woff2": { type: "static" }, "/_next/static/media/e4af272ccee01ff0-s.p.woff2": { type: "static" }, "/_next/static/not-found.txt": { type: "static" }, "/file.svg": { type: "static" }, "/globe.svg": { type: "static" }, "/next.svg": { type: "static" }, "/vercel.svg": { type: "static" }, "/window.svg": { type: "static" }, "/dashboard/announcements": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/announcements.func.js" }, "/dashboard/announcements.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/announcements.func.js" }, "/dashboard/certificates": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/certificates.func.js" }, "/dashboard/certificates.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/certificates.func.js" }, "/dashboard/help": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/help.func.js" }, "/dashboard/help.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/help.func.js" }, "/dashboard/learning": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/learning.func.js" }, "/dashboard/learning.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/learning.func.js" }, "/dashboard/lessons/[id]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/lessons/[id].func.js" }, "/dashboard/lessons/[id].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/lessons/[id].func.js" }, "/dashboard/library": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/library.func.js" }, "/dashboard/library.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/library.func.js" }, "/dashboard/progress": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/progress.func.js" }, "/dashboard/progress.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/progress.func.js" }, "/dashboard/quizzes/[id]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/quizzes/[id].func.js" }, "/dashboard/quizzes/[id].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/quizzes/[id].func.js" }, "/dashboard/quizzes": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/quizzes.func.js" }, "/dashboard/quizzes.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/quizzes.func.js" }, "/dashboard/resources": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/resources.func.js" }, "/dashboard/resources.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/resources.func.js" }, "/dashboard/settings": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/settings.func.js" }, "/dashboard/settings.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/settings.func.js" }, "/dashboard/support": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/support.func.js" }, "/dashboard/support.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/support.func.js" }, "/dashboard": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard.func.js" }, "/dashboard.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard.func.js" }, "/404": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/500": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/404.rsc": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/_not-found.html": { type: "override", path: "/_not-found.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/_not-found": { type: "override", path: "/_not-found.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/_not-found.rsc": { type: "override", path: "/_not-found.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/about.html": { type: "override", path: "/about.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/about/layout,_N_T_/about/page,_N_T_/about", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/about": { type: "override", path: "/about.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/about/layout,_N_T_/about/page,_N_T_/about", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/about.rsc": { type: "override", path: "/about.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/about/layout,_N_T_/about/page,_N_T_/about", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/admin.html": { type: "override", path: "/admin.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/page,_N_T_/admin", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/admin": { type: "override", path: "/admin.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/page,_N_T_/admin", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/admin.rsc": { type: "override", path: "/admin.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/page,_N_T_/admin", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/contact.html": { type: "override", path: "/contact.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/contact/layout,_N_T_/contact/page,_N_T_/contact", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/contact": { type: "override", path: "/contact.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/contact/layout,_N_T_/contact/page,_N_T_/contact", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/contact.rsc": { type: "override", path: "/contact.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/contact/layout,_N_T_/contact/page,_N_T_/contact", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/favicon.ico": { type: "override", path: "/favicon.ico", headers: { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/index.html": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/index": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/index.rsc": { type: "override", path: "/index.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/login.html": { type: "override", path: "/login.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(auth)/layout,_N_T_/(auth)/login/layout,_N_T_/(auth)/login/page,_N_T_/login", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/login": { type: "override", path: "/login.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(auth)/layout,_N_T_/(auth)/login/layout,_N_T_/(auth)/login/page,_N_T_/login", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/login.rsc": { type: "override", path: "/login.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(auth)/layout,_N_T_/(auth)/login/layout,_N_T_/(auth)/login/page,_N_T_/login", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/signup.html": { type: "override", path: "/signup.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(auth)/layout,_N_T_/(auth)/signup/layout,_N_T_/(auth)/signup/page,_N_T_/signup", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/signup": { type: "override", path: "/signup.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(auth)/layout,_N_T_/(auth)/signup/layout,_N_T_/(auth)/signup/page,_N_T_/signup", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/signup.rsc": { type: "override", path: "/signup.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(auth)/layout,_N_T_/(auth)/signup/layout,_N_T_/(auth)/signup/page,_N_T_/signup", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/vacancies.html": { type: "override", path: "/vacancies.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/vacancies/layout,_N_T_/vacancies/page,_N_T_/vacancies", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/vacancies": { type: "override", path: "/vacancies.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/vacancies/layout,_N_T_/vacancies/page,_N_T_/vacancies", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/vacancies.rsc": { type: "override", path: "/vacancies.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/vacancies/layout,_N_T_/vacancies/page,_N_T_/vacancies", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } } };
});
var F = V((We, $) => {
  "use strict";
  u();
  d();
  p();
  function b(e, t) {
    e = String(e || "").trim();
    let a = e, s, r = "";
    if (/^[^a-zA-Z\\\s]/.test(e)) {
      s = e[0];
      let o = e.lastIndexOf(s);
      r += e.substring(o + 1), e = e.substring(1, o);
    }
    let n = 0;
    return e = pe(e, (o) => {
      if (/^\(\?[P<']/.test(o)) {
        let c = /^\(\?P?[<']([^>']+)[>']/.exec(o);
        if (!c) throw new Error(`Failed to extract named captures from ${JSON.stringify(o)}`);
        let h = o.substring(c[0].length, o.length - 1);
        return t && (t[n] = c[1]), n++, `(${h})`;
      }
      return o.substring(0, 3) === "(?:" || n++, o;
    }), e = e.replace(/\[:([^:]+):\]/g, (o, c) => b.characterClasses[c] || o), new b.PCRE(e, r, a, r, s);
  }
  __name(b, "b");
  function pe(e, t) {
    let a = 0, s = 0, r = false;
    for (let i = 0; i < e.length; i++) {
      let n = e[i];
      if (r) {
        r = false;
        continue;
      }
      switch (n) {
        case "(":
          s === 0 && (a = i), s++;
          break;
        case ")":
          if (s > 0 && (s--, s === 0)) {
            let o = i + 1, c = a === 0 ? "" : e.substring(0, a), h = e.substring(o), l = String(t(e.substring(a, o)));
            e = c + l + h, i = a;
          }
          break;
        case "\\":
          r = true;
          break;
        default:
          break;
      }
    }
    return e;
  }
  __name(pe, "pe");
  (function(e) {
    class t extends RegExp {
      static {
        __name(this, "t");
      }
      constructor(s, r, i, n, o) {
        super(s, r), this.pcrePattern = i, this.pcreFlags = n, this.delimiter = o;
      }
    }
    e.PCRE = t, e.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(b || (b = {}));
  b.prototype = b.PCRE.prototype;
  $.exports = b;
});
var Q = V((H) => {
  "use strict";
  u();
  d();
  p();
  H.parse = Re;
  H.serialize = Te;
  var we = Object.prototype.toString, S = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function Re(e, t) {
    if (typeof e != "string") throw new TypeError("argument str must be a string");
    for (var a = {}, s = t || {}, r = s.decode || Pe, i = 0; i < e.length; ) {
      var n = e.indexOf("=", i);
      if (n === -1) break;
      var o = e.indexOf(";", i);
      if (o === -1) o = e.length;
      else if (o < n) {
        i = e.lastIndexOf(";", n - 1) + 1;
        continue;
      }
      var c = e.slice(i, n).trim();
      if (a[c] === void 0) {
        var h = e.slice(n + 1, o).trim();
        h.charCodeAt(0) === 34 && (h = h.slice(1, -1)), a[c] = ke(h, r);
      }
      i = o + 1;
    }
    return a;
  }
  __name(Re, "Re");
  function Te(e, t, a) {
    var s = a || {}, r = s.encode || Ne;
    if (typeof r != "function") throw new TypeError("option encode is invalid");
    if (!S.test(e)) throw new TypeError("argument name is invalid");
    var i = r(t);
    if (i && !S.test(i)) throw new TypeError("argument val is invalid");
    var n = e + "=" + i;
    if (s.maxAge != null) {
      var o = s.maxAge - 0;
      if (isNaN(o) || !isFinite(o)) throw new TypeError("option maxAge is invalid");
      n += "; Max-Age=" + Math.floor(o);
    }
    if (s.domain) {
      if (!S.test(s.domain)) throw new TypeError("option domain is invalid");
      n += "; Domain=" + s.domain;
    }
    if (s.path) {
      if (!S.test(s.path)) throw new TypeError("option path is invalid");
      n += "; Path=" + s.path;
    }
    if (s.expires) {
      var c = s.expires;
      if (!je(c) || isNaN(c.valueOf())) throw new TypeError("option expires is invalid");
      n += "; Expires=" + c.toUTCString();
    }
    if (s.httpOnly && (n += "; HttpOnly"), s.secure && (n += "; Secure"), s.priority) {
      var h = typeof s.priority == "string" ? s.priority.toLowerCase() : s.priority;
      switch (h) {
        case "low":
          n += "; Priority=Low";
          break;
        case "medium":
          n += "; Priority=Medium";
          break;
        case "high":
          n += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (s.sameSite) {
      var l = typeof s.sameSite == "string" ? s.sameSite.toLowerCase() : s.sameSite;
      switch (l) {
        case true:
          n += "; SameSite=Strict";
          break;
        case "lax":
          n += "; SameSite=Lax";
          break;
        case "strict":
          n += "; SameSite=Strict";
          break;
        case "none":
          n += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return n;
  }
  __name(Te, "Te");
  function Pe(e) {
    return e.indexOf("%") !== -1 ? decodeURIComponent(e) : e;
  }
  __name(Pe, "Pe");
  function Ne(e) {
    return encodeURIComponent(e);
  }
  __name(Ne, "Ne");
  function je(e) {
    return we.call(e) === "[object Date]" || e instanceof Date;
  }
  __name(je, "je");
  function ke(e, t) {
    try {
      return t(e);
    } catch {
      return e;
    }
  }
  __name(ke, "ke");
});
u();
d();
p();
u();
d();
p();
u();
d();
p();
var w = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
u();
d();
p();
u();
d();
p();
u();
d();
p();
u();
d();
p();
var D = q(F());
function N(e, t, a) {
  if (t == null) return { match: null, captureGroupKeys: [] };
  let s = a ? "" : "i", r = [];
  return { match: (0, D.default)(`%${e}%${s}`, r).exec(t), captureGroupKeys: r };
}
__name(N, "N");
function R(e, t, a, { namedOnly: s } = {}) {
  return e.replace(/\$([a-zA-Z0-9_]+)/g, (r, i) => {
    let n = a.indexOf(i);
    return s && n === -1 ? r : (n === -1 ? t[parseInt(i, 10)] : t[n + 1]) || "";
  });
}
__name(R, "R");
function I(e, { url: t, cookies: a, headers: s, routeDest: r }) {
  switch (e.type) {
    case "host":
      return { valid: t.hostname === e.value };
    case "header":
      return e.value !== void 0 ? M(e.value, s.get(e.key), r) : { valid: s.has(e.key) };
    case "cookie": {
      let i = a[e.key];
      return i && e.value !== void 0 ? M(e.value, i, r) : { valid: i !== void 0 };
    }
    case "query":
      return e.value !== void 0 ? M(e.value, t.searchParams.get(e.key), r) : { valid: t.searchParams.has(e.key) };
  }
}
__name(I, "I");
function M(e, t, a) {
  let { match: s, captureGroupKeys: r } = N(e, t);
  return a && s && r.length ? { valid: !!s, newRouteDest: R(a, s, r, { namedOnly: true }) } : { valid: !!s };
}
__name(M, "M");
u();
d();
p();
function z(e) {
  let t = new Headers(e.headers);
  return e.cf && (t.set("x-vercel-ip-city", encodeURIComponent(e.cf.city)), t.set("x-vercel-ip-country", e.cf.country), t.set("x-vercel-ip-country-region", e.cf.regionCode), t.set("x-vercel-ip-latitude", e.cf.latitude), t.set("x-vercel-ip-longitude", e.cf.longitude)), t.set("x-vercel-sc-host", w), new Request(e, { headers: t });
}
__name(z, "z");
u();
d();
p();
function y(e, t, a) {
  let s = t instanceof Headers ? t.entries() : Object.entries(t);
  for (let [r, i] of s) {
    let n = r.toLowerCase(), o = a?.match ? R(i, a.match, a.captureGroupKeys) : i;
    n === "set-cookie" ? e.append(n, o) : e.set(n, o);
  }
}
__name(y, "y");
function T(e) {
  return /^https?:\/\//.test(e);
}
__name(T, "T");
function m(e, t) {
  for (let [a, s] of t.entries()) {
    let r = /^nxtP(.+)$/.exec(a), i = /^nxtI(.+)$/.exec(a);
    r?.[1] ? (e.set(a, s), e.set(r[1], s)) : i?.[1] ? e.set(i[1], s.replace(/(\(\.+\))+/, "")) : (!e.has(a) || !!s && !e.getAll(a).includes(s)) && e.append(a, s);
  }
}
__name(m, "m");
function A(e, t) {
  let a = new URL(t, e.url);
  return m(a.searchParams, new URL(e.url).searchParams), a.pathname = a.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(a, e);
}
__name(A, "A");
function P(e) {
  return new Response(e.body, e);
}
__name(P, "P");
function L(e) {
  return e.split(",").map((t) => {
    let [a, s] = t.split(";"), r = parseFloat((s ?? "q=1").replace(/q *= */gi, ""));
    return [a.trim(), isNaN(r) ? 1 : r];
  }).sort((t, a) => a[1] - t[1]).map(([t]) => t === "*" || t === "" ? [] : t).flat();
}
__name(L, "L");
u();
d();
p();
function O(e) {
  switch (e) {
    case "none":
      return "filesystem";
    case "filesystem":
      return "rewrite";
    case "rewrite":
      return "resource";
    case "resource":
      return "miss";
    default:
      return "miss";
  }
}
__name(O, "O");
async function j(e, { request: t, assetsFetcher: a, ctx: s }, { path: r, searchParams: i }) {
  let n, o = new URL(t.url);
  m(o.searchParams, i);
  let c = new Request(o, t);
  try {
    switch (e?.type) {
      case "function":
      case "middleware": {
        let h = await import(e.entrypoint);
        try {
          n = await h.default(c, s);
        } catch (l) {
          let g = l;
          throw g.name === "TypeError" && g.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${e.entrypoint})`) : l;
        }
        break;
      }
      case "override": {
        n = P(await a.fetch(A(c, e.path ?? r))), e.headers && y(n.headers, e.headers);
        break;
      }
      case "static": {
        n = await a.fetch(A(c, r));
        break;
      }
      default:
        n = new Response("Not Found", { status: 404 });
    }
  } catch (h) {
    return console.error(h), new Response("Internal Server Error", { status: 500 });
  }
  return P(n);
}
__name(j, "j");
function B(e, t) {
  let a = "^//?(?:", s = ")/(.*)$";
  return !e.startsWith(a) || !e.endsWith(s) ? false : e.slice(a.length, -s.length).split("|").every((i) => t.has(i));
}
__name(B, "B");
u();
d();
p();
function he(e, { protocol: t, hostname: a, port: s, pathname: r }) {
  return !(t && e.protocol.replace(/:$/, "") !== t || !new RegExp(a).test(e.hostname) || s && !new RegExp(s).test(e.port) || r && !new RegExp(r).test(e.pathname));
}
__name(he, "he");
function le(e, t) {
  if (e.method !== "GET") return;
  let { origin: a, searchParams: s } = new URL(e.url), r = s.get("url"), i = Number.parseInt(s.get("w") ?? "", 10), n = Number.parseInt(s.get("q") ?? "75", 10);
  if (!r || Number.isNaN(i) || Number.isNaN(n) || !t?.sizes?.includes(i) || n < 0 || n > 100) return;
  let o = new URL(r, a);
  if (o.pathname.endsWith(".svg") && !t?.dangerouslyAllowSVG) return;
  let c = r.startsWith("//"), h = r.startsWith("/") && !c;
  if (!h && !t?.domains?.includes(o.hostname) && !t?.remotePatterns?.find((v) => he(o, v))) return;
  let l = e.headers.get("Accept") ?? "", g = t?.formats?.find((v) => l.includes(v))?.replace("image/", "");
  return { isRelative: h, imageUrl: o, options: { width: i, quality: n, format: g } };
}
__name(le, "le");
function fe(e, t, a) {
  let s = new Headers();
  if (a?.contentSecurityPolicy && s.set("Content-Security-Policy", a.contentSecurityPolicy), a?.contentDispositionType) {
    let i = t.pathname.split("/").pop(), n = i ? `${a.contentDispositionType}; filename="${i}"` : a.contentDispositionType;
    s.set("Content-Disposition", n);
  }
  e.headers.has("Cache-Control") || s.set("Cache-Control", `public, max-age=${a?.minimumCacheTTL ?? 60}`);
  let r = P(e);
  return y(r.headers, s), r;
}
__name(fe, "fe");
async function G(e, { buildOutput: t, assetsFetcher: a, imagesConfig: s }) {
  let r = le(e, s);
  if (!r) return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: i, imageUrl: n } = r, c = await (i && n.pathname in t ? a.fetch.bind(a) : fetch)(n);
  return fe(c, n, s);
}
__name(G, "G");
u();
d();
p();
u();
d();
p();
u();
d();
p();
async function k(e) {
  return import(e);
}
__name(k, "k");
var _e = "x-vercel-cache-tags";
var xe = "x-next-cache-soft-tags";
var ge = /* @__PURE__ */ Symbol.for("__cloudflare-request-context__");
async function J(e) {
  let t = `https://${w}/v1/suspense-cache/`;
  if (!e.url.startsWith(t)) return null;
  try {
    let a = new URL(e.url), s = await ye();
    if (a.pathname === "/v1/suspense-cache/revalidate") {
      let i = a.searchParams.get("tags")?.split(",") ?? [];
      for (let n of i) await s.revalidateTag(n);
      return new Response(null, { status: 200 });
    }
    let r = a.pathname.replace("/v1/suspense-cache/", "");
    if (!r.length) return new Response("Invalid cache key", { status: 400 });
    switch (e.method) {
      case "GET": {
        let i = W(e, xe), n = await s.get(r, { softTags: i });
        return n ? new Response(JSON.stringify(n.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (n.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let i = globalThis[ge], n = /* @__PURE__ */ __name(async () => {
          let o = await e.json();
          o.data.tags === void 0 && (o.tags ??= W(e, _e) ?? []), await s.set(r, o);
        }, "n");
        return i ? i.ctx.waitUntil(n()) : await n(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (a) {
    return console.error(a), new Response("Error handling cache request", { status: 500 });
  }
}
__name(J, "J");
async function ye() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? K("kv") : K("cache-api");
}
__name(ye, "ye");
async function K(e) {
  let t = `./__next-on-pages-dist__/cache/${e}.js`, a = await k(t);
  return new a.default();
}
__name(K, "K");
function W(e, t) {
  return e.headers.get(t)?.split(",")?.filter(Boolean);
}
__name(W, "W");
function X() {
  globalThis[Z] || (me(), globalThis[Z] = true);
}
__name(X, "X");
function me() {
  let e = globalThis.fetch;
  globalThis.fetch = async (...t) => {
    let a = new Request(...t), s = await be(a);
    return s || (s = await J(a), s) ? s : (ve(a), e(a));
  };
}
__name(me, "me");
async function be(e) {
  if (e.url.startsWith("blob:")) try {
    let a = `./__next-on-pages-dist__/assets/${new URL(e.url).pathname}.bin`, s = (await k(a)).default, r = { async arrayBuffer() {
      return s;
    }, get body() {
      return new ReadableStream({ start(i) {
        let n = Buffer.from(s);
        i.enqueue(n), i.close();
      } });
    }, async text() {
      return Buffer.from(s).toString();
    }, async json() {
      let i = Buffer.from(s);
      return JSON.stringify(i.toString());
    }, async blob() {
      return new Blob(s);
    } };
    return r.clone = () => ({ ...r }), r;
  } catch {
  }
  return null;
}
__name(be, "be");
function ve(e) {
  e.headers.has("user-agent") || e.headers.set("user-agent", "Next.js Middleware");
}
__name(ve, "ve");
var Z = /* @__PURE__ */ Symbol.for("next-on-pages fetch patch");
u();
d();
p();
var Y = q(Q());
var C = class {
  static {
    __name(this, "C");
  }
  constructor(t, a, s, r, i) {
    this.routes = t;
    this.output = a;
    this.reqCtx = s;
    this.url = new URL(s.request.url), this.cookies = (0, Y.parse)(s.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), m(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = i?.find((n) => n.domain === this.url.hostname), this.locales = new Set(r.collectedLocales);
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(t, { checkStatus: a, checkIntercept: s }) {
    let r = N(t.src, this.path, t.caseSensitive);
    if (!r.match || t.methods && !t.methods.map((n) => n.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase())) return;
    let i = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: t.dest };
    if (!t.has?.find((n) => {
      let o = I(n, i);
      return o.newRouteDest && (i.routeDest = o.newRouteDest), !o.valid;
    }) && !t.missing?.find((n) => I(n, i).valid) && !(a && t.status !== this.status)) {
      if (s && t.dest) {
        let n = /\/(\(\.+\))+/, o = n.test(t.dest), c = n.test(this.path);
        if (o && !c) return;
      }
      return { routeMatch: r, routeDest: i.routeDest };
    }
  }
  processMiddlewareResp(t) {
    let a = "x-middleware-override-headers", s = t.headers.get(a);
    if (s) {
      let c = new Set(s.split(",").map((h) => h.trim()));
      for (let h of c.keys()) {
        let l = `x-middleware-request-${h}`, g = t.headers.get(l);
        this.reqCtx.request.headers.get(h) !== g && (g ? this.reqCtx.request.headers.set(h, g) : this.reqCtx.request.headers.delete(h)), t.headers.delete(l);
      }
      t.headers.delete(a);
    }
    let r = "x-middleware-rewrite", i = t.headers.get(r);
    if (i) {
      let c = new URL(i, this.url), h = this.url.hostname !== c.hostname;
      this.path = h ? `${c}` : c.pathname, m(this.searchParams, c.searchParams), t.headers.delete(r);
    }
    let n = "x-middleware-next";
    t.headers.get(n) ? t.headers.delete(n) : !i && !t.headers.has("location") ? (this.body = t.body, this.status = t.status) : t.headers.has("location") && t.status >= 300 && t.status < 400 && (this.status = t.status), y(this.reqCtx.request.headers, t.headers), y(this.headers.normal, t.headers), this.headers.middlewareLocation = t.headers.get("location");
  }
  async runRouteMiddleware(t) {
    if (!t) return true;
    let a = t && this.output[t];
    if (!a || a.type !== "middleware") return this.status = 500, false;
    let s = await j(a, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(t), s.status === 500 ? (this.status = s.status, false) : (this.processMiddlewareResp(s), true);
  }
  applyRouteOverrides(t) {
    !t.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(t, a, s) {
    !t.headers || (y(this.headers.normal, t.headers, { match: a, captureGroupKeys: s }), t.important && y(this.headers.important, t.headers, { match: a, captureGroupKeys: s }));
  }
  applyRouteStatus(t) {
    !t.status || (this.status = t.status);
  }
  applyRouteDest(t, a, s) {
    if (!t.dest) return this.path;
    let r = this.path, i = t.dest;
    this.wildcardMatch && /\$wildcard/.test(i) && (i = i.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = R(i, a, s);
    let n = /\/index\.rsc$/i.test(this.path), o = /^\/(?:index)?$/i.test(r), c = /^\/__index\.prefetch\.rsc$/i.test(r);
    n && !o && !c && (this.path = r);
    let h = /\.rsc$/i.test(this.path), l = /\.prefetch\.rsc$/i.test(this.path), g = this.path in this.output;
    h && !l && !g && (this.path = this.path.replace(/\.rsc/i, ""));
    let v = new URL(this.path, this.url);
    return m(this.searchParams, v.searchParams), T(this.path) || (this.path = v.pathname), r;
  }
  applyLocaleRedirects(t) {
    if (!t.locale?.redirect || !/^\^(.)*$/.test(t.src) && t.src !== this.path || this.headers.normal.has("location")) return;
    let { locale: { redirect: s, cookie: r } } = t, i = r && this.cookies[r], n = L(i ?? ""), o = L(this.reqCtx.request.headers.get("accept-language") ?? ""), l = [...n, ...o].map((g) => s[g]).filter(Boolean)[0];
    if (l) {
      !this.path.startsWith(l) && (this.headers.normal.set("location", l), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(t, a) {
    return !this.locales || a !== "miss" ? t : B(t.src, this.locales) ? { ...t, src: t.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : t;
  }
  async checkRoute(t, a) {
    let s = this.getLocaleFriendlyRoute(a, t), { routeMatch: r, routeDest: i } = this.checkRouteMatch(s, { checkStatus: t === "error", checkIntercept: t === "rewrite" }) ?? {}, n = { ...s, dest: i };
    if (!r?.match || n.middlewarePath && this.middlewareInvoked.includes(n.middlewarePath)) return "skip";
    let { match: o, captureGroupKeys: c } = r;
    if (this.applyRouteOverrides(n), this.applyLocaleRedirects(n), !await this.runRouteMiddleware(n.middlewarePath)) return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation) return "done";
    this.applyRouteHeaders(n, o, c), this.applyRouteStatus(n);
    let l = this.applyRouteDest(n, o, c);
    if (n.check && !T(this.path)) if (l === this.path) {
      if (t !== "miss") return this.checkPhase(O(t));
      this.status = 404;
    } else if (t === "miss") {
      if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output)) return this.checkPhase("filesystem");
      this.status === 404 && (this.status = void 0);
    } else return this.checkPhase("none");
    return !n.continue || n.status && n.status >= 300 && n.status <= 399 ? "done" : "next";
  }
  async checkPhase(t) {
    if (this.checkPhaseCounter++ >= 50) return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let a = true;
    for (let i of this.routes[t]) {
      let n = await this.checkRoute(t, i);
      if (n === "error") return "error";
      if (n === "done") {
        a = false;
        break;
      }
    }
    if (t === "hit" || T(this.path) || this.headers.normal.has("location") || !!this.body) return "done";
    if (t === "none") for (let i of this.locales) {
      let n = new RegExp(`/${i}(/.*)`), c = this.path.match(n)?.[1];
      if (c && c in this.output) {
        this.path = c;
        break;
      }
    }
    let s = this.path in this.output;
    if (!s && this.path.endsWith("/")) {
      let i = this.path.replace(/\/$/, "");
      s = i in this.output, s && (this.path = i);
    }
    if (t === "miss" && !s) {
      let i = !this.status || this.status < 400;
      this.status = i ? 404 : this.status;
    }
    let r = "miss";
    return s || t === "miss" || t === "error" ? r = "hit" : a && (r = O(t)), this.checkPhase(r);
  }
  async run(t = "none") {
    this.checkPhaseCounter = 0;
    let a = await this.checkPhase(t);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), a;
  }
};
async function ee(e, t, a, s) {
  let r = new C(t.routes, a, e, s, t.wildcard), i = await te(r);
  return Se(e, i, a);
}
__name(ee, "ee");
async function te(e, t = "none", a = false) {
  return await e.run(t) === "error" || !a && e.status && e.status >= 400 ? te(e, "error", true) : { path: e.path, status: e.status, headers: e.headers, searchParams: e.searchParams, body: e.body };
}
__name(te, "te");
async function Se(e, { path: t = "/404", status: a, headers: s, searchParams: r, body: i }, n) {
  let o = s.normal.get("location");
  if (o) {
    if (o !== s.middlewareLocation) {
      let l = [...r.keys()].length ? `?${r.toString()}` : "";
      s.normal.set("location", `${o ?? "/"}${l}`);
    }
    return new Response(null, { status: a, headers: s.normal });
  }
  let c;
  if (i !== void 0) c = new Response(i, { status: a });
  else if (T(t)) {
    let l = new URL(t);
    m(l.searchParams, r), c = await fetch(l, e.request);
  } else c = await j(n[t], e, { path: t, status: a, headers: s, searchParams: r });
  let h = s.normal;
  return y(h, c.headers), y(h, s.important), c = new Response(c.body, { ...c, status: a || c.status, headers: h }), c;
}
__name(Se, "Se");
u();
d();
p();
function se() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: Ce };
}
__name(se, "se");
function Ce(e) {
  let t = globalThis.__nextOnPagesRoutesIsolation._map.get(e);
  if (t) return t;
  let a = Ee();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(e, a), a;
}
__name(Ce, "Ce");
function Ee() {
  let e = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: /* @__PURE__ */ __name((t, a) => e.has(a) ? e.get(a) : Reflect.get(globalThis, a), "get"), set: /* @__PURE__ */ __name((t, a, s) => Me.has(a) ? Reflect.set(globalThis, a, s) : (e.set(a, s), true), "set") });
}
__name(Ee, "Ee");
var Me = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var Ie = Object.defineProperty;
var Ae = /* @__PURE__ */ __name((...e) => {
  let t = e[0], a = e[1], s = "__import_unsupported";
  if (!(a === s && typeof t == "object" && t !== null && s in t)) return Ie(...e);
}, "Ae");
globalThis.Object.defineProperty = Ae;
globalThis.AbortController = class extends AbortController {
  constructor() {
    try {
      super();
    } catch (t) {
      if (t instanceof Error && t.message.includes("Disallowed operation called within global scope")) return { signal: { aborted: false, reason: null, onabort: /* @__PURE__ */ __name(() => {
      }, "onabort"), throwIfAborted: /* @__PURE__ */ __name(() => {
      }, "throwIfAborted") }, abort() {
      } };
      throw t;
    }
  }
};
var Ps = { async fetch(e, t, a) {
  se(), X();
  let s = await __ALSes_PROMISE__;
  if (!s) {
    let n = new URL(e.url), o = await t.ASSETS.fetch(`${n.protocol}//${n.host}/cdn-cgi/errors/no-nodejs_compat.html`), c = o.ok ? o.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(c, { status: 503 });
  }
  let { envAsyncLocalStorage: r, requestContextAsyncLocalStorage: i } = s;
  return r.run({ ...t, NODE_ENV: "production", SUSPENSE_CACHE_URL: w }, async () => i.run({ env: t, ctx: a, cf: e.cf }, async () => {
    if (new URL(e.url).pathname.startsWith("/_next/image")) return G(e, { buildOutput: _, assetsFetcher: t.ASSETS, imagesConfig: f.images });
    let o = z(e);
    return ee({ request: o, ctx: a, assetsFetcher: t.ASSETS }, f, _, x);
  }));
} };
export {
  Ps as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=bundledWorker-0.719568467840489.mjs.map
