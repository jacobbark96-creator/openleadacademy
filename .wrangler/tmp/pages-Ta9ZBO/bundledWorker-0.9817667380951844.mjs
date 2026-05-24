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
        getOwnPropertyDescriptor: /* @__PURE__ */ __name((_, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
        get: /* @__PURE__ */ __name((_, property) => Reflect.get(envAsyncLocalStorage.getStore(), property), "get"),
        set: /* @__PURE__ */ __name((_, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value), "set")
      }
    )
  };
  globalThis[/* @__PURE__ */ Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()), "ownKeys"),
      getOwnPropertyDescriptor: /* @__PURE__ */ __name((_, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
      get: /* @__PURE__ */ __name((_, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property), "get"),
      set: /* @__PURE__ */ __name((_, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value), "set")
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var re = Object.create;
var O = Object.defineProperty;
var se = Object.getOwnPropertyDescriptor;
var ne = Object.getOwnPropertyNames;
var oe = Object.getPrototypeOf;
var ie = Object.prototype.hasOwnProperty;
var S = /* @__PURE__ */ __name((e, t) => () => (e && (t = e(e = 0)), t), "S");
var H = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "H");
var de = /* @__PURE__ */ __name((e, t, r, a) => {
  if (t && typeof t == "object" || typeof t == "function") for (let n of ne(t)) !ie.call(e, n) && n !== r && O(e, n, { get: /* @__PURE__ */ __name(() => t[n], "get"), enumerable: !(a = se(t, n)) || a.enumerable });
  return e;
}, "de");
var U = /* @__PURE__ */ __name((e, t, r) => (r = e != null ? re(oe(e)) : {}, de(t || !e || !e.__esModule ? O(r, "default", { value: e, enumerable: true }) : r, e)), "U");
var y;
var c = S(() => {
  y = { collectedLocales: [] };
});
var p;
var h = S(() => {
  p = { version: 3, routes: { none: [{ src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308, continue: true }, { src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true, missing: [{ type: "header", key: "x-prerender-revalidate" }] }, { src: "^/500$", status: 500, continue: true }, { src: "^/?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/index.rsc", headers: { vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" }, continue: true, override: true }, { src: "^/((?!.+\\.rsc).+?)(?:/)?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/$1.rsc", headers: { vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" }, continue: true, override: true }], filesystem: [{ src: "^/index(\\.action|\\.rsc)$", dest: "/", continue: true }, { src: "^/_next/data/(.*)$", dest: "/_next/data/$1", check: true }, { src: "^/\\.prefetch\\.rsc$", dest: "/__index.prefetch.rsc", check: true }, { src: "^/(.+)/\\.prefetch\\.rsc$", dest: "/$1.prefetch.rsc", check: true }, { src: "^/\\.rsc$", dest: "/index.rsc", check: true }, { src: "^/(.+)/\\.rsc$", dest: "/$1.rsc", check: true }], miss: [{ src: "^/_next/static/.+$", status: 404, check: true, dest: "/_next/static/not-found.txt", headers: { "content-type": "text/plain; charset=utf-8" } }], rewrite: [{ src: "^/_next/data/(.*)$", dest: "/404", status: 404 }, { src: "^/dashboard/lessons/(?<nxtPid>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/dashboard/lessons/[id].rsc?nxtPid=$nxtPid" }, { src: "^/dashboard/lessons/(?<nxtPid>[^/]+?)(?:/)?$", dest: "/dashboard/lessons/[id]?nxtPid=$nxtPid" }, { src: "^/dashboard/quizzes/(?<nxtPid>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/dashboard/quizzes/[id].rsc?nxtPid=$nxtPid" }, { src: "^/dashboard/quizzes/(?<nxtPid>[^/]+?)(?:/)?$", dest: "/dashboard/quizzes/[id]?nxtPid=$nxtPid" }], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|\\-7Zrz2uoElajPBCv6dkru)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }, { src: "^/index(?:/)?$", headers: { "x-matched-path": "/" }, continue: true, important: true }, { src: "^/((?!index$).*?)(?:/)?$", headers: { "x-matched-path": "/$1" }, continue: true, important: true }], error: [{ src: "^/.*$", dest: "/404", status: 404, headers: { "x-next-error-status": "404" } }, { src: "^/.*$", dest: "/500", status: 500, headers: { "x-next-error-status": "500" } }] }, images: { domains: [], sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 16, 32, 48, 64, 96, 128, 256, 384], remotePatterns: [], minimumCacheTTL: 60, formats: ["image/webp"], dangerouslyAllowSVG: false, contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;", contentDispositionType: "attachment" }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "500.html": { path: "500", contentType: "text/html; charset=utf-8" }, "_app.rsc.json": { path: "_app.rsc", contentType: "application/json" }, "_error.rsc.json": { path: "_error.rsc", contentType: "application/json" }, "_document.rsc.json": { path: "_document.rsc", contentType: "application/json" }, "404.rsc.json": { path: "404.rsc", contentType: "application/json" }, "_next/static/not-found.txt": { contentType: "text/plain" } }, framework: { slug: "nextjs", version: "15.5.18" }, crons: [] };
});
var x;
var u = S(() => {
  x = { "/404.html": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/404.rsc.json": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/500.html": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc.json": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc.json": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc.json": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_next/static/-7Zrz2uoElajPBCv6dkru/_buildManifest.js": { type: "static" }, "/_next/static/-7Zrz2uoElajPBCv6dkru/_ssgManifest.js": { type: "static" }, "/_next/static/chunks/255-4f84124391a7dac4.js": { type: "static" }, "/_next/static/chunks/292-507c046b78e3eaea.js": { type: "static" }, "/_next/static/chunks/42-014eaf6a95f0ad09.js": { type: "static" }, "/_next/static/chunks/44530001-841e3dca2e3e1a0b.js": { type: "static" }, "/_next/static/chunks/470-26708e5a98e315c8.js": { type: "static" }, "/_next/static/chunks/496-1f36cf49307d7320.js": { type: "static" }, "/_next/static/chunks/4bd1b696-c023c6e3521b1417.js": { type: "static" }, "/_next/static/chunks/601-f0ab9082cb2d7ce8.js": { type: "static" }, "/_next/static/chunks/613-d149621aa4e1de06.js": { type: "static" }, "/_next/static/chunks/619-ba102abea3e3d0e4.js": { type: "static" }, "/_next/static/chunks/714-ca85374298aa68e6.js": { type: "static" }, "/_next/static/chunks/718-add9364244225288.js": { type: "static" }, "/_next/static/chunks/782-e5d0d8369e8a14e3.js": { type: "static" }, "/_next/static/chunks/909-a5da60d248a1c133.js": { type: "static" }, "/_next/static/chunks/92-42796f627a191b34.js": { type: "static" }, "/_next/static/chunks/app/(auth)/layout-f3d94d210719dca2.js": { type: "static" }, "/_next/static/chunks/app/(auth)/login/page-65aad1700f7c71ec.js": { type: "static" }, "/_next/static/chunks/app/(auth)/signup/page-61ce9e1f27fe3dc5.js": { type: "static" }, "/_next/static/chunks/app/_not-found/page-d5e1fe342afe057b.js": { type: "static" }, "/_next/static/chunks/app/about/page-56eb22ffcac17746.js": { type: "static" }, "/_next/static/chunks/app/contact/page-20d6f79cef43b456.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/page-85873ff294165990.js": { type: "static" }, "/_next/static/chunks/app/dashboard/announcements/page-85025f6a2e4ecbe9.js": { type: "static" }, "/_next/static/chunks/app/dashboard/certificates/page-c9a5658e4139fa1e.js": { type: "static" }, "/_next/static/chunks/app/dashboard/help/page-4a7d66867fedd0c8.js": { type: "static" }, "/_next/static/chunks/app/dashboard/layout-b1601f022ac16dae.js": { type: "static" }, "/_next/static/chunks/app/dashboard/learning/page-295ecc5bf3342a44.js": { type: "static" }, "/_next/static/chunks/app/dashboard/lessons/[id]/page-1555f59800524682.js": { type: "static" }, "/_next/static/chunks/app/dashboard/library/page-6ed90f010d26108a.js": { type: "static" }, "/_next/static/chunks/app/dashboard/page-08dc9f0fbf16c0bb.js": { type: "static" }, "/_next/static/chunks/app/dashboard/progress/page-0f4623d0f34aa9e7.js": { type: "static" }, "/_next/static/chunks/app/dashboard/quizzes/[id]/page-1a43daaa6560ea32.js": { type: "static" }, "/_next/static/chunks/app/dashboard/quizzes/page-a3c27d9bb49da63f.js": { type: "static" }, "/_next/static/chunks/app/dashboard/resources/page-637ed9bbc43c065c.js": { type: "static" }, "/_next/static/chunks/app/dashboard/settings/page-39c8855724d9e459.js": { type: "static" }, "/_next/static/chunks/app/dashboard/support/page-d57a354ae7c2d3dc.js": { type: "static" }, "/_next/static/chunks/app/layout-d2a3de6153df4d68.js": { type: "static" }, "/_next/static/chunks/app/page-2ed6aa1cc77cc660.js": { type: "static" }, "/_next/static/chunks/app/vacancies/page-b346f4d097ffc02b.js": { type: "static" }, "/_next/static/chunks/framework-acd67e14855de5a2.js": { type: "static" }, "/_next/static/chunks/main-47f909ba4ae65767.js": { type: "static" }, "/_next/static/chunks/main-app-2203cd607436239a.js": { type: "static" }, "/_next/static/chunks/pages/_app-7d307437aca18ad4.js": { type: "static" }, "/_next/static/chunks/pages/_error-cb2a52f75f2162e2.js": { type: "static" }, "/_next/static/chunks/polyfills-42372ed130431b0a.js": { type: "static" }, "/_next/static/chunks/webpack-8a9d343779a1d40b.js": { type: "static" }, "/_next/static/css/833d155fb66377d3.css": { type: "static" }, "/_next/static/css/ca38a98afab35183.css": { type: "static" }, "/_next/static/media/19cfc7226ec3afaa-s.woff2": { type: "static" }, "/_next/static/media/21350d82a1f187e9-s.woff2": { type: "static" }, "/_next/static/media/636a5ac981f94f8b-s.p.woff2": { type: "static" }, "/_next/static/media/6fe53d21e6e7ebd8-s.woff2": { type: "static" }, "/_next/static/media/8e9860b6e62d6359-s.woff2": { type: "static" }, "/_next/static/media/8ebc6e9dde468c4a-s.woff2": { type: "static" }, "/_next/static/media/9e7b0a821b9dfcb4-s.woff2": { type: "static" }, "/_next/static/media/ba9851c3c22cd980-s.woff2": { type: "static" }, "/_next/static/media/c5fe6dc8356a8c31-s.woff2": { type: "static" }, "/_next/static/media/df0a9ae256c0569c-s.woff2": { type: "static" }, "/_next/static/media/e4af272ccee01ff0-s.p.woff2": { type: "static" }, "/_next/static/not-found.txt": { type: "static" }, "/file.svg": { type: "static" }, "/globe.svg": { type: "static" }, "/next.svg": { type: "static" }, "/vercel.svg": { type: "static" }, "/window.svg": { type: "static" }, "/about": { type: "function", entrypoint: "__next-on-pages-dist__/functions/about.func.js" }, "/about.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/about.func.js" }, "/404": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/500": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/404.rsc": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/_not-found.html": { type: "override", path: "/_not-found.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/_not-found": { type: "override", path: "/_not-found.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/_not-found.rsc": { type: "override", path: "/_not-found.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/contact.html": { type: "override", path: "/contact.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/contact/layout,_N_T_/contact/page,_N_T_/contact", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/contact": { type: "override", path: "/contact.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/contact/layout,_N_T_/contact/page,_N_T_/contact", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/contact.rsc": { type: "override", path: "/contact.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/contact/layout,_N_T_/contact/page,_N_T_/contact", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/admin.html": { type: "override", path: "/dashboard/admin.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/page,_N_T_/dashboard/admin", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/admin": { type: "override", path: "/dashboard/admin.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/page,_N_T_/dashboard/admin", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/admin.rsc": { type: "override", path: "/dashboard/admin.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/page,_N_T_/dashboard/admin", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/announcements.html": { type: "override", path: "/dashboard/announcements.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/announcements/layout,_N_T_/dashboard/announcements/page,_N_T_/dashboard/announcements", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/announcements": { type: "override", path: "/dashboard/announcements.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/announcements/layout,_N_T_/dashboard/announcements/page,_N_T_/dashboard/announcements", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/announcements.rsc": { type: "override", path: "/dashboard/announcements.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/announcements/layout,_N_T_/dashboard/announcements/page,_N_T_/dashboard/announcements", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/certificates.html": { type: "override", path: "/dashboard/certificates.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/certificates/layout,_N_T_/dashboard/certificates/page,_N_T_/dashboard/certificates", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/certificates": { type: "override", path: "/dashboard/certificates.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/certificates/layout,_N_T_/dashboard/certificates/page,_N_T_/dashboard/certificates", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/certificates.rsc": { type: "override", path: "/dashboard/certificates.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/certificates/layout,_N_T_/dashboard/certificates/page,_N_T_/dashboard/certificates", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/help.html": { type: "override", path: "/dashboard/help.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/help/layout,_N_T_/dashboard/help/page,_N_T_/dashboard/help", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/help": { type: "override", path: "/dashboard/help.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/help/layout,_N_T_/dashboard/help/page,_N_T_/dashboard/help", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/help.rsc": { type: "override", path: "/dashboard/help.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/help/layout,_N_T_/dashboard/help/page,_N_T_/dashboard/help", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/learning.html": { type: "override", path: "/dashboard/learning.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/learning/layout,_N_T_/dashboard/learning/page,_N_T_/dashboard/learning", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/learning": { type: "override", path: "/dashboard/learning.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/learning/layout,_N_T_/dashboard/learning/page,_N_T_/dashboard/learning", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/learning.rsc": { type: "override", path: "/dashboard/learning.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/learning/layout,_N_T_/dashboard/learning/page,_N_T_/dashboard/learning", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/lessons/1.html": { type: "override", path: "/dashboard/lessons/1.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/1", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/lessons/1": { type: "override", path: "/dashboard/lessons/1.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/1", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/lessons/1.rsc": { type: "override", path: "/dashboard/lessons/1.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/1", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/lessons/2.html": { type: "override", path: "/dashboard/lessons/2.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/2", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/lessons/2": { type: "override", path: "/dashboard/lessons/2.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/2", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/lessons/2.rsc": { type: "override", path: "/dashboard/lessons/2.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/2", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/lessons/3.html": { type: "override", path: "/dashboard/lessons/3.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/3", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/lessons/3": { type: "override", path: "/dashboard/lessons/3.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/3", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/lessons/3.rsc": { type: "override", path: "/dashboard/lessons/3.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/3", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/lessons/4.html": { type: "override", path: "/dashboard/lessons/4.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/4", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/lessons/4": { type: "override", path: "/dashboard/lessons/4.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/4", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/lessons/4.rsc": { type: "override", path: "/dashboard/lessons/4.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/4", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/lessons/5.html": { type: "override", path: "/dashboard/lessons/5.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/5", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/lessons/5": { type: "override", path: "/dashboard/lessons/5.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/5", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/lessons/5.rsc": { type: "override", path: "/dashboard/lessons/5.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/lessons/layout,_N_T_/dashboard/lessons/[id]/layout,_N_T_/dashboard/lessons/[id]/page,_N_T_/dashboard/lessons/5", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/library.html": { type: "override", path: "/dashboard/library.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/library/layout,_N_T_/dashboard/library/page,_N_T_/dashboard/library", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/library": { type: "override", path: "/dashboard/library.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/library/layout,_N_T_/dashboard/library/page,_N_T_/dashboard/library", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/library.rsc": { type: "override", path: "/dashboard/library.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/library/layout,_N_T_/dashboard/library/page,_N_T_/dashboard/library", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/progress.html": { type: "override", path: "/dashboard/progress.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/progress/layout,_N_T_/dashboard/progress/page,_N_T_/dashboard/progress", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/progress": { type: "override", path: "/dashboard/progress.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/progress/layout,_N_T_/dashboard/progress/page,_N_T_/dashboard/progress", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/progress.rsc": { type: "override", path: "/dashboard/progress.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/progress/layout,_N_T_/dashboard/progress/page,_N_T_/dashboard/progress", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/quizzes/1.html": { type: "override", path: "/dashboard/quizzes/1.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/1", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/quizzes/1": { type: "override", path: "/dashboard/quizzes/1.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/1", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/quizzes/1.rsc": { type: "override", path: "/dashboard/quizzes/1.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/1", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/quizzes/2.html": { type: "override", path: "/dashboard/quizzes/2.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/2", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/quizzes/2": { type: "override", path: "/dashboard/quizzes/2.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/2", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/quizzes/2.rsc": { type: "override", path: "/dashboard/quizzes/2.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/2", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/quizzes/3.html": { type: "override", path: "/dashboard/quizzes/3.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/3", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/quizzes/3": { type: "override", path: "/dashboard/quizzes/3.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/3", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/quizzes/3.rsc": { type: "override", path: "/dashboard/quizzes/3.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/3", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/quizzes/4.html": { type: "override", path: "/dashboard/quizzes/4.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/4", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/quizzes/4": { type: "override", path: "/dashboard/quizzes/4.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/4", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/quizzes/4.rsc": { type: "override", path: "/dashboard/quizzes/4.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/4", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/quizzes/5.html": { type: "override", path: "/dashboard/quizzes/5.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/5", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/quizzes/5": { type: "override", path: "/dashboard/quizzes/5.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/5", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/quizzes/5.rsc": { type: "override", path: "/dashboard/quizzes/5.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/[id]/layout,_N_T_/dashboard/quizzes/[id]/page,_N_T_/dashboard/quizzes/5", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/quizzes.html": { type: "override", path: "/dashboard/quizzes.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/page,_N_T_/dashboard/quizzes", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/quizzes": { type: "override", path: "/dashboard/quizzes.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/page,_N_T_/dashboard/quizzes", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/quizzes.rsc": { type: "override", path: "/dashboard/quizzes.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/quizzes/layout,_N_T_/dashboard/quizzes/page,_N_T_/dashboard/quizzes", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/resources.html": { type: "override", path: "/dashboard/resources.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/resources/layout,_N_T_/dashboard/resources/page,_N_T_/dashboard/resources", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/resources": { type: "override", path: "/dashboard/resources.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/resources/layout,_N_T_/dashboard/resources/page,_N_T_/dashboard/resources", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/resources.rsc": { type: "override", path: "/dashboard/resources.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/resources/layout,_N_T_/dashboard/resources/page,_N_T_/dashboard/resources", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/settings.html": { type: "override", path: "/dashboard/settings.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/settings/layout,_N_T_/dashboard/settings/page,_N_T_/dashboard/settings", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/settings": { type: "override", path: "/dashboard/settings.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/settings/layout,_N_T_/dashboard/settings/page,_N_T_/dashboard/settings", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/settings.rsc": { type: "override", path: "/dashboard/settings.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/settings/layout,_N_T_/dashboard/settings/page,_N_T_/dashboard/settings", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard/support.html": { type: "override", path: "/dashboard/support.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/support/layout,_N_T_/dashboard/support/page,_N_T_/dashboard/support", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/support": { type: "override", path: "/dashboard/support.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/support/layout,_N_T_/dashboard/support/page,_N_T_/dashboard/support", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard/support.rsc": { type: "override", path: "/dashboard/support.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/support/layout,_N_T_/dashboard/support/page,_N_T_/dashboard/support", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/dashboard.html": { type: "override", path: "/dashboard.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/page,_N_T_/dashboard", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard": { type: "override", path: "/dashboard.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/page,_N_T_/dashboard", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/dashboard.rsc": { type: "override", path: "/dashboard.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/page,_N_T_/dashboard", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/favicon.ico": { type: "override", path: "/favicon.ico", headers: { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/index.html": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/index": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/index.rsc": { type: "override", path: "/index.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/login.html": { type: "override", path: "/login.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(auth)/layout,_N_T_/(auth)/login/layout,_N_T_/(auth)/login/page,_N_T_/login", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/login": { type: "override", path: "/login.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(auth)/layout,_N_T_/(auth)/login/layout,_N_T_/(auth)/login/page,_N_T_/login", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/login.rsc": { type: "override", path: "/login.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(auth)/layout,_N_T_/(auth)/login/layout,_N_T_/(auth)/login/page,_N_T_/login", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/signup.html": { type: "override", path: "/signup.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(auth)/layout,_N_T_/(auth)/signup/layout,_N_T_/(auth)/signup/page,_N_T_/signup", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/signup": { type: "override", path: "/signup.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(auth)/layout,_N_T_/(auth)/signup/layout,_N_T_/(auth)/signup/page,_N_T_/signup", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/signup.rsc": { type: "override", path: "/signup.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/(auth)/layout,_N_T_/(auth)/signup/layout,_N_T_/(auth)/signup/page,_N_T_/signup", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/vacancies.html": { type: "override", path: "/vacancies.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/vacancies/layout,_N_T_/vacancies/page,_N_T_/vacancies", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/vacancies": { type: "override", path: "/vacancies.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/vacancies/layout,_N_T_/vacancies/page,_N_T_/vacancies", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/vacancies.rsc": { type: "override", path: "/vacancies.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/vacancies/layout,_N_T_/vacancies/page,_N_T_/vacancies", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } } };
});
var $ = H((We, V) => {
  "use strict";
  c();
  h();
  u();
  function b(e, t) {
    e = String(e || "").trim();
    let r = e, a, n = "";
    if (/^[^a-zA-Z\\\s]/.test(e)) {
      a = e[0];
      let i = e.lastIndexOf(a);
      n += e.substring(i + 1), e = e.substring(1, i);
    }
    let s = 0;
    return e = ue(e, (i) => {
      if (/^\(\?[P<']/.test(i)) {
        let d = /^\(\?P?[<']([^>']+)[>']/.exec(i);
        if (!d) throw new Error(`Failed to extract named captures from ${JSON.stringify(i)}`);
        let _ = i.substring(d[0].length, i.length - 1);
        return t && (t[s] = d[1]), s++, `(${_})`;
      }
      return i.substring(0, 3) === "(?:" || s++, i;
    }), e = e.replace(/\[:([^:]+):\]/g, (i, d) => b.characterClasses[d] || i), new b.PCRE(e, n, r, n, a);
  }
  __name(b, "b");
  function ue(e, t) {
    let r = 0, a = 0, n = false;
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      if (n) {
        n = false;
        continue;
      }
      switch (s) {
        case "(":
          a === 0 && (r = o), a++;
          break;
        case ")":
          if (a > 0 && (a--, a === 0)) {
            let i = o + 1, d = r === 0 ? "" : e.substring(0, r), _ = e.substring(i), l = String(t(e.substring(r, i)));
            e = d + l + _, o = r;
          }
          break;
        case "\\":
          n = true;
          break;
        default:
          break;
      }
    }
    return e;
  }
  __name(ue, "ue");
  (function(e) {
    class t extends RegExp {
      static {
        __name(this, "t");
      }
      constructor(a, n, o, s, i) {
        super(a, n), this.pcrePattern = o, this.pcreFlags = s, this.delimiter = i;
      }
    }
    e.PCRE = t, e.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(b || (b = {}));
  b.prototype = b.PCRE.prototype;
  V.exports = b;
});
var Q = H((L) => {
  "use strict";
  c();
  h();
  u();
  L.parse = ve;
  L.serialize = je;
  var Ne = Object.prototype.toString, q = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function ve(e, t) {
    if (typeof e != "string") throw new TypeError("argument str must be a string");
    for (var r = {}, a = t || {}, n = a.decode || we, o = 0; o < e.length; ) {
      var s = e.indexOf("=", o);
      if (s === -1) break;
      var i = e.indexOf(";", o);
      if (i === -1) i = e.length;
      else if (i < s) {
        o = e.lastIndexOf(";", s - 1) + 1;
        continue;
      }
      var d = e.slice(o, s).trim();
      if (r[d] === void 0) {
        var _ = e.slice(s + 1, i).trim();
        _.charCodeAt(0) === 34 && (_ = _.slice(1, -1)), r[d] = Pe(_, n);
      }
      o = i + 1;
    }
    return r;
  }
  __name(ve, "ve");
  function je(e, t, r) {
    var a = r || {}, n = a.encode || ze;
    if (typeof n != "function") throw new TypeError("option encode is invalid");
    if (!q.test(e)) throw new TypeError("argument name is invalid");
    var o = n(t);
    if (o && !q.test(o)) throw new TypeError("argument val is invalid");
    var s = e + "=" + o;
    if (a.maxAge != null) {
      var i = a.maxAge - 0;
      if (isNaN(i) || !isFinite(i)) throw new TypeError("option maxAge is invalid");
      s += "; Max-Age=" + Math.floor(i);
    }
    if (a.domain) {
      if (!q.test(a.domain)) throw new TypeError("option domain is invalid");
      s += "; Domain=" + a.domain;
    }
    if (a.path) {
      if (!q.test(a.path)) throw new TypeError("option path is invalid");
      s += "; Path=" + a.path;
    }
    if (a.expires) {
      var d = a.expires;
      if (!Re(d) || isNaN(d.valueOf())) throw new TypeError("option expires is invalid");
      s += "; Expires=" + d.toUTCString();
    }
    if (a.httpOnly && (s += "; HttpOnly"), a.secure && (s += "; Secure"), a.priority) {
      var _ = typeof a.priority == "string" ? a.priority.toLowerCase() : a.priority;
      switch (_) {
        case "low":
          s += "; Priority=Low";
          break;
        case "medium":
          s += "; Priority=Medium";
          break;
        case "high":
          s += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (a.sameSite) {
      var l = typeof a.sameSite == "string" ? a.sameSite.toLowerCase() : a.sameSite;
      switch (l) {
        case true:
          s += "; SameSite=Strict";
          break;
        case "lax":
          s += "; SameSite=Lax";
          break;
        case "strict":
          s += "; SameSite=Strict";
          break;
        case "none":
          s += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return s;
  }
  __name(je, "je");
  function we(e) {
    return e.indexOf("%") !== -1 ? decodeURIComponent(e) : e;
  }
  __name(we, "we");
  function ze(e) {
    return encodeURIComponent(e);
  }
  __name(ze, "ze");
  function Re(e) {
    return Ne.call(e) === "[object Date]" || e instanceof Date;
  }
  __name(Re, "Re");
  function Pe(e, t) {
    try {
      return t(e);
    } catch {
      return e;
    }
  }
  __name(Pe, "Pe");
});
c();
h();
u();
c();
h();
u();
c();
h();
u();
var N = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
c();
h();
u();
c();
h();
u();
c();
h();
u();
c();
h();
u();
var F = U($());
function z(e, t, r) {
  if (t == null) return { match: null, captureGroupKeys: [] };
  let a = r ? "" : "i", n = [];
  return { match: (0, F.default)(`%${e}%${a}`, n).exec(t), captureGroupKeys: n };
}
__name(z, "z");
function v(e, t, r, { namedOnly: a } = {}) {
  return e.replace(/\$([a-zA-Z0-9_]+)/g, (n, o) => {
    let s = r.indexOf(o);
    return a && s === -1 ? n : (s === -1 ? t[parseInt(o, 10)] : t[s + 1]) || "";
  });
}
__name(v, "v");
function E(e, { url: t, cookies: r, headers: a, routeDest: n }) {
  switch (e.type) {
    case "host":
      return { valid: t.hostname === e.value };
    case "header":
      return e.value !== void 0 ? C(e.value, a.get(e.key), n) : { valid: a.has(e.key) };
    case "cookie": {
      let o = r[e.key];
      return o && e.value !== void 0 ? C(e.value, o, n) : { valid: o !== void 0 };
    }
    case "query":
      return e.value !== void 0 ? C(e.value, t.searchParams.get(e.key), n) : { valid: t.searchParams.has(e.key) };
  }
}
__name(E, "E");
function C(e, t, r) {
  let { match: a, captureGroupKeys: n } = z(e, t);
  return r && a && n.length ? { valid: !!a, newRouteDest: v(r, a, n, { namedOnly: true }) } : { valid: !!a };
}
__name(C, "C");
c();
h();
u();
function D(e) {
  let t = new Headers(e.headers);
  return e.cf && (t.set("x-vercel-ip-city", encodeURIComponent(e.cf.city)), t.set("x-vercel-ip-country", e.cf.country), t.set("x-vercel-ip-country-region", e.cf.regionCode), t.set("x-vercel-ip-latitude", e.cf.latitude), t.set("x-vercel-ip-longitude", e.cf.longitude)), t.set("x-vercel-sc-host", N), new Request(e, { headers: t });
}
__name(D, "D");
c();
h();
u();
function m(e, t, r) {
  let a = t instanceof Headers ? t.entries() : Object.entries(t);
  for (let [n, o] of a) {
    let s = n.toLowerCase(), i = r?.match ? v(o, r.match, r.captureGroupKeys) : o;
    s === "set-cookie" ? e.append(s, i) : e.set(s, i);
  }
}
__name(m, "m");
function j(e) {
  return /^https?:\/\//.test(e);
}
__name(j, "j");
function g(e, t) {
  for (let [r, a] of t.entries()) {
    let n = /^nxtP(.+)$/.exec(r), o = /^nxtI(.+)$/.exec(r);
    n?.[1] ? (e.set(r, a), e.set(n[1], a)) : o?.[1] ? e.set(o[1], a.replace(/(\(\.+\))+/, "")) : (!e.has(r) || !!a && !e.getAll(r).includes(a)) && e.append(r, a);
  }
}
__name(g, "g");
function M(e, t) {
  let r = new URL(t, e.url);
  return g(r.searchParams, new URL(e.url).searchParams), r.pathname = r.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(r, e);
}
__name(M, "M");
function w(e) {
  return new Response(e.body, e);
}
__name(w, "w");
function I(e) {
  return e.split(",").map((t) => {
    let [r, a] = t.split(";"), n = parseFloat((a ?? "q=1").replace(/q *= */gi, ""));
    return [r.trim(), isNaN(n) ? 1 : n];
  }).sort((t, r) => r[1] - t[1]).map(([t]) => t === "*" || t === "" ? [] : t).flat();
}
__name(I, "I");
c();
h();
u();
function A(e) {
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
__name(A, "A");
async function R(e, { request: t, assetsFetcher: r, ctx: a }, { path: n, searchParams: o }) {
  let s, i = new URL(t.url);
  g(i.searchParams, o);
  let d = new Request(i, t);
  try {
    switch (e?.type) {
      case "function":
      case "middleware": {
        let _ = await import(e.entrypoint);
        try {
          s = await _.default(d, a);
        } catch (l) {
          let f = l;
          throw f.name === "TypeError" && f.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${e.entrypoint})`) : l;
        }
        break;
      }
      case "override": {
        s = w(await r.fetch(M(d, e.path ?? n))), e.headers && m(s.headers, e.headers);
        break;
      }
      case "static": {
        s = await r.fetch(M(d, n));
        break;
      }
      default:
        s = new Response("Not Found", { status: 404 });
    }
  } catch (_) {
    return console.error(_), new Response("Internal Server Error", { status: 500 });
  }
  return w(s);
}
__name(R, "R");
function B(e, t) {
  let r = "^//?(?:", a = ")/(.*)$";
  return !e.startsWith(r) || !e.endsWith(a) ? false : e.slice(r.length, -a.length).split("|").every((o) => t.has(o));
}
__name(B, "B");
c();
h();
u();
function _e(e, { protocol: t, hostname: r, port: a, pathname: n }) {
  return !(t && e.protocol.replace(/:$/, "") !== t || !new RegExp(r).test(e.hostname) || a && !new RegExp(a).test(e.port) || n && !new RegExp(n).test(e.pathname));
}
__name(_e, "_e");
function le(e, t) {
  if (e.method !== "GET") return;
  let { origin: r, searchParams: a } = new URL(e.url), n = a.get("url"), o = Number.parseInt(a.get("w") ?? "", 10), s = Number.parseInt(a.get("q") ?? "75", 10);
  if (!n || Number.isNaN(o) || Number.isNaN(s) || !t?.sizes?.includes(o) || s < 0 || s > 100) return;
  let i = new URL(n, r);
  if (i.pathname.endsWith(".svg") && !t?.dangerouslyAllowSVG) return;
  let d = n.startsWith("//"), _ = n.startsWith("/") && !d;
  if (!_ && !t?.domains?.includes(i.hostname) && !t?.remotePatterns?.find((T) => _e(i, T))) return;
  let l = e.headers.get("Accept") ?? "", f = t?.formats?.find((T) => l.includes(T))?.replace("image/", "");
  return { isRelative: _, imageUrl: i, options: { width: o, quality: s, format: f } };
}
__name(le, "le");
function pe(e, t, r) {
  let a = new Headers();
  if (r?.contentSecurityPolicy && a.set("Content-Security-Policy", r.contentSecurityPolicy), r?.contentDispositionType) {
    let o = t.pathname.split("/").pop(), s = o ? `${r.contentDispositionType}; filename="${o}"` : r.contentDispositionType;
    a.set("Content-Disposition", s);
  }
  e.headers.has("Cache-Control") || a.set("Cache-Control", `public, max-age=${r?.minimumCacheTTL ?? 60}`);
  let n = w(e);
  return m(n.headers, a), n;
}
__name(pe, "pe");
async function G(e, { buildOutput: t, assetsFetcher: r, imagesConfig: a }) {
  let n = le(e, a);
  if (!n) return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: o, imageUrl: s } = n, d = await (o && s.pathname in t ? r.fetch.bind(r) : fetch)(s);
  return pe(d, s, a);
}
__name(G, "G");
c();
h();
u();
c();
h();
u();
c();
h();
u();
async function P(e) {
  return import(e);
}
__name(P, "P");
var xe = "x-vercel-cache-tags";
var ye = "x-next-cache-soft-tags";
var fe = /* @__PURE__ */ Symbol.for("__cloudflare-request-context__");
async function J(e) {
  let t = `https://${N}/v1/suspense-cache/`;
  if (!e.url.startsWith(t)) return null;
  try {
    let r = new URL(e.url), a = await me();
    if (r.pathname === "/v1/suspense-cache/revalidate") {
      let o = r.searchParams.get("tags")?.split(",") ?? [];
      for (let s of o) await a.revalidateTag(s);
      return new Response(null, { status: 200 });
    }
    let n = r.pathname.replace("/v1/suspense-cache/", "");
    if (!n.length) return new Response("Invalid cache key", { status: 400 });
    switch (e.method) {
      case "GET": {
        let o = W(e, ye), s = await a.get(n, { softTags: o });
        return s ? new Response(JSON.stringify(s.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (s.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let o = globalThis[fe], s = /* @__PURE__ */ __name(async () => {
          let i = await e.json();
          i.data.tags === void 0 && (i.tags ??= W(e, xe) ?? []), await a.set(n, i);
        }, "s");
        return o ? o.ctx.waitUntil(s()) : await s(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (r) {
    return console.error(r), new Response("Error handling cache request", { status: 500 });
  }
}
__name(J, "J");
async function me() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? K("kv") : K("cache-api");
}
__name(me, "me");
async function K(e) {
  let t = `./__next-on-pages-dist__/cache/${e}.js`, r = await P(t);
  return new r.default();
}
__name(K, "K");
function W(e, t) {
  return e.headers.get(t)?.split(",")?.filter(Boolean);
}
__name(W, "W");
function X() {
  globalThis[Z] || (ge(), globalThis[Z] = true);
}
__name(X, "X");
function ge() {
  let e = globalThis.fetch;
  globalThis.fetch = async (...t) => {
    let r = new Request(...t), a = await be(r);
    return a || (a = await J(r), a) ? a : (Te(r), e(r));
  };
}
__name(ge, "ge");
async function be(e) {
  if (e.url.startsWith("blob:")) try {
    let r = `./__next-on-pages-dist__/assets/${new URL(e.url).pathname}.bin`, a = (await P(r)).default, n = { async arrayBuffer() {
      return a;
    }, get body() {
      return new ReadableStream({ start(o) {
        let s = Buffer.from(a);
        o.enqueue(s), o.close();
      } });
    }, async text() {
      return Buffer.from(a).toString();
    }, async json() {
      let o = Buffer.from(a);
      return JSON.stringify(o.toString());
    }, async blob() {
      return new Blob(a);
    } };
    return n.clone = () => ({ ...n }), n;
  } catch {
  }
  return null;
}
__name(be, "be");
function Te(e) {
  e.headers.has("user-agent") || e.headers.set("user-agent", "Next.js Middleware");
}
__name(Te, "Te");
var Z = /* @__PURE__ */ Symbol.for("next-on-pages fetch patch");
c();
h();
u();
var Y = U(Q());
var k = class {
  static {
    __name(this, "k");
  }
  constructor(t, r, a, n, o) {
    this.routes = t;
    this.output = r;
    this.reqCtx = a;
    this.url = new URL(a.request.url), this.cookies = (0, Y.parse)(a.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), g(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = o?.find((s) => s.domain === this.url.hostname), this.locales = new Set(n.collectedLocales);
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
  checkRouteMatch(t, { checkStatus: r, checkIntercept: a }) {
    let n = z(t.src, this.path, t.caseSensitive);
    if (!n.match || t.methods && !t.methods.map((s) => s.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase())) return;
    let o = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: t.dest };
    if (!t.has?.find((s) => {
      let i = E(s, o);
      return i.newRouteDest && (o.routeDest = i.newRouteDest), !i.valid;
    }) && !t.missing?.find((s) => E(s, o).valid) && !(r && t.status !== this.status)) {
      if (a && t.dest) {
        let s = /\/(\(\.+\))+/, i = s.test(t.dest), d = s.test(this.path);
        if (i && !d) return;
      }
      return { routeMatch: n, routeDest: o.routeDest };
    }
  }
  processMiddlewareResp(t) {
    let r = "x-middleware-override-headers", a = t.headers.get(r);
    if (a) {
      let d = new Set(a.split(",").map((_) => _.trim()));
      for (let _ of d.keys()) {
        let l = `x-middleware-request-${_}`, f = t.headers.get(l);
        this.reqCtx.request.headers.get(_) !== f && (f ? this.reqCtx.request.headers.set(_, f) : this.reqCtx.request.headers.delete(_)), t.headers.delete(l);
      }
      t.headers.delete(r);
    }
    let n = "x-middleware-rewrite", o = t.headers.get(n);
    if (o) {
      let d = new URL(o, this.url), _ = this.url.hostname !== d.hostname;
      this.path = _ ? `${d}` : d.pathname, g(this.searchParams, d.searchParams), t.headers.delete(n);
    }
    let s = "x-middleware-next";
    t.headers.get(s) ? t.headers.delete(s) : !o && !t.headers.has("location") ? (this.body = t.body, this.status = t.status) : t.headers.has("location") && t.status >= 300 && t.status < 400 && (this.status = t.status), m(this.reqCtx.request.headers, t.headers), m(this.headers.normal, t.headers), this.headers.middlewareLocation = t.headers.get("location");
  }
  async runRouteMiddleware(t) {
    if (!t) return true;
    let r = t && this.output[t];
    if (!r || r.type !== "middleware") return this.status = 500, false;
    let a = await R(r, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(t), a.status === 500 ? (this.status = a.status, false) : (this.processMiddlewareResp(a), true);
  }
  applyRouteOverrides(t) {
    !t.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(t, r, a) {
    !t.headers || (m(this.headers.normal, t.headers, { match: r, captureGroupKeys: a }), t.important && m(this.headers.important, t.headers, { match: r, captureGroupKeys: a }));
  }
  applyRouteStatus(t) {
    !t.status || (this.status = t.status);
  }
  applyRouteDest(t, r, a) {
    if (!t.dest) return this.path;
    let n = this.path, o = t.dest;
    this.wildcardMatch && /\$wildcard/.test(o) && (o = o.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = v(o, r, a);
    let s = /\/index\.rsc$/i.test(this.path), i = /^\/(?:index)?$/i.test(n), d = /^\/__index\.prefetch\.rsc$/i.test(n);
    s && !i && !d && (this.path = n);
    let _ = /\.rsc$/i.test(this.path), l = /\.prefetch\.rsc$/i.test(this.path), f = this.path in this.output;
    _ && !l && !f && (this.path = this.path.replace(/\.rsc/i, ""));
    let T = new URL(this.path, this.url);
    return g(this.searchParams, T.searchParams), j(this.path) || (this.path = T.pathname), n;
  }
  applyLocaleRedirects(t) {
    if (!t.locale?.redirect || !/^\^(.)*$/.test(t.src) && t.src !== this.path || this.headers.normal.has("location")) return;
    let { locale: { redirect: a, cookie: n } } = t, o = n && this.cookies[n], s = I(o ?? ""), i = I(this.reqCtx.request.headers.get("accept-language") ?? ""), l = [...s, ...i].map((f) => a[f]).filter(Boolean)[0];
    if (l) {
      !this.path.startsWith(l) && (this.headers.normal.set("location", l), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(t, r) {
    return !this.locales || r !== "miss" ? t : B(t.src, this.locales) ? { ...t, src: t.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : t;
  }
  async checkRoute(t, r) {
    let a = this.getLocaleFriendlyRoute(r, t), { routeMatch: n, routeDest: o } = this.checkRouteMatch(a, { checkStatus: t === "error", checkIntercept: t === "rewrite" }) ?? {}, s = { ...a, dest: o };
    if (!n?.match || s.middlewarePath && this.middlewareInvoked.includes(s.middlewarePath)) return "skip";
    let { match: i, captureGroupKeys: d } = n;
    if (this.applyRouteOverrides(s), this.applyLocaleRedirects(s), !await this.runRouteMiddleware(s.middlewarePath)) return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation) return "done";
    this.applyRouteHeaders(s, i, d), this.applyRouteStatus(s);
    let l = this.applyRouteDest(s, i, d);
    if (s.check && !j(this.path)) if (l === this.path) {
      if (t !== "miss") return this.checkPhase(A(t));
      this.status = 404;
    } else if (t === "miss") {
      if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output)) return this.checkPhase("filesystem");
      this.status === 404 && (this.status = void 0);
    } else return this.checkPhase("none");
    return !s.continue || s.status && s.status >= 300 && s.status <= 399 ? "done" : "next";
  }
  async checkPhase(t) {
    if (this.checkPhaseCounter++ >= 50) return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let r = true;
    for (let o of this.routes[t]) {
      let s = await this.checkRoute(t, o);
      if (s === "error") return "error";
      if (s === "done") {
        r = false;
        break;
      }
    }
    if (t === "hit" || j(this.path) || this.headers.normal.has("location") || !!this.body) return "done";
    if (t === "none") for (let o of this.locales) {
      let s = new RegExp(`/${o}(/.*)`), d = this.path.match(s)?.[1];
      if (d && d in this.output) {
        this.path = d;
        break;
      }
    }
    let a = this.path in this.output;
    if (!a && this.path.endsWith("/")) {
      let o = this.path.replace(/\/$/, "");
      a = o in this.output, a && (this.path = o);
    }
    if (t === "miss" && !a) {
      let o = !this.status || this.status < 400;
      this.status = o ? 404 : this.status;
    }
    let n = "miss";
    return a || t === "miss" || t === "error" ? n = "hit" : r && (n = A(t)), this.checkPhase(n);
  }
  async run(t = "none") {
    this.checkPhaseCounter = 0;
    let r = await this.checkPhase(t);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), r;
  }
};
async function ee(e, t, r, a) {
  let n = new k(t.routes, r, e, a, t.wildcard), o = await te(n);
  return qe(e, o, r);
}
__name(ee, "ee");
async function te(e, t = "none", r = false) {
  return await e.run(t) === "error" || !r && e.status && e.status >= 400 ? te(e, "error", true) : { path: e.path, status: e.status, headers: e.headers, searchParams: e.searchParams, body: e.body };
}
__name(te, "te");
async function qe(e, { path: t = "/404", status: r, headers: a, searchParams: n, body: o }, s) {
  let i = a.normal.get("location");
  if (i) {
    if (i !== a.middlewareLocation) {
      let l = [...n.keys()].length ? `?${n.toString()}` : "";
      a.normal.set("location", `${i ?? "/"}${l}`);
    }
    return new Response(null, { status: r, headers: a.normal });
  }
  let d;
  if (o !== void 0) d = new Response(o, { status: r });
  else if (j(t)) {
    let l = new URL(t);
    g(l.searchParams, n), d = await fetch(l, e.request);
  } else d = await R(s[t], e, { path: t, status: r, headers: a, searchParams: n });
  let _ = a.normal;
  return m(_, d.headers), m(_, a.important), d = new Response(d.body, { ...d, status: r || d.status, headers: _ }), d;
}
__name(qe, "qe");
c();
h();
u();
function ae() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: ke };
}
__name(ae, "ae");
function ke(e) {
  let t = globalThis.__nextOnPagesRoutesIsolation._map.get(e);
  if (t) return t;
  let r = Se();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(e, r), r;
}
__name(ke, "ke");
function Se() {
  let e = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: /* @__PURE__ */ __name((t, r) => e.has(r) ? e.get(r) : Reflect.get(globalThis, r), "get"), set: /* @__PURE__ */ __name((t, r, a) => Ce.has(r) ? Reflect.set(globalThis, r, a) : (e.set(r, a), true), "set") });
}
__name(Se, "Se");
var Ce = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var Ee = Object.defineProperty;
var Me = /* @__PURE__ */ __name((...e) => {
  let t = e[0], r = e[1], a = "__import_unsupported";
  if (!(r === a && typeof t == "object" && t !== null && a in t)) return Ee(...e);
}, "Me");
globalThis.Object.defineProperty = Me;
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
var wa = { async fetch(e, t, r) {
  ae(), X();
  let a = await __ALSes_PROMISE__;
  if (!a) {
    let s = new URL(e.url), i = await t.ASSETS.fetch(`${s.protocol}//${s.host}/cdn-cgi/errors/no-nodejs_compat.html`), d = i.ok ? i.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(d, { status: 503 });
  }
  let { envAsyncLocalStorage: n, requestContextAsyncLocalStorage: o } = a;
  return n.run({ ...t, NODE_ENV: "production", SUSPENSE_CACHE_URL: N }, async () => o.run({ env: t, ctx: r, cf: e.cf }, async () => {
    if (new URL(e.url).pathname.startsWith("/_next/image")) return G(e, { buildOutput: x, assetsFetcher: t.ASSETS, imagesConfig: p.images });
    let i = D(e);
    return ee({ request: i, ctx: r, assetsFetcher: t.ASSETS }, p, x, y);
  }));
} };
export {
  wa as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=bundledWorker-0.9817667380951844.mjs.map
