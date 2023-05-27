importScripts("/src/js/idb.js");
importScripts("/src/js/utility.js");
importScripts("/src/js/controller.js");

const apiRoute = "http://localhost:3000/api/";
const CACHE_STATIC_NAME = "static-v2";
const CACHE_DYNAMIC_NAME = "dynamic-v2";
const STATIC_FILES = [
  "/",
  "index.html",
  "src/js/app.js",
  "src/js/idb.js",
  "src/js/controller.js",
  "src/js/utility.js",
  "src/css/reset.css",
  "src/css/home.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js",
];

function trimCache(cacheName, maxItems) {
  caches
    .open(cacheName)
    .then((cache) =>
      cache.keys().then((key) => key.length > maxItems && cache.delete(key[0]))
    );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then((cache) => {
      cache.addAll(STATIC_FILES);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_DYNAMIC_NAME && key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes(apiRoute)) {
    event.respondWith(fetch(event.request));
  } else if (
    STATIC_FILES.findIndex((val) => val === event.request.url) !== -1
  ) {
    event.respondWith(caches.match(event.request));
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then((res) => {
              if (event.request.method === "POST") {
                return res;
              }
              return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
                cache.put(event.request.url, res.clone()).catch((err) => {});
                return res;
              });
            })
            .catch((err) => {});
        }
      })
    );
  }
});

self.addEventListener("sync", (event) => {
  switch (event.tag) {
    case "sync-todo":
      return event.waitUntil(
        Todo.sync()
          .then((res) => console.log(res))
          .catch((err) => console.log(err))
      );
    case "sync-category":
      return event.waitUntil(
        Category.sync()
          .then((res) => console.log(res))
          .catch((err) => console.log(err))
      );
  }
});
