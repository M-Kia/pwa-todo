importScripts("/src/js/idb.js");
importScripts("/src/js/utility.js");
importScripts("https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js");

const apiRoute = "http://kia.tatdmo.ir/api/";
const CACHE_STATIC_NAME = "static-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v1";
const STATIC_FILES = [
  "/",
  "index.html",
  "src/js/app.js",
  "src/js/idb.js",
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
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (event.request.url === apiRoute + "get_todo") {
            let clonedRes = res.clone();
            clearAllData("todo")
              .then(() => clonedRes.json())
              .then((data) => {
                for (d of data.data){
                  writeData("todo", { ...d });
                }
              });
            return res;
          }
        })
        .catch((err) => {})
    );
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
  console.log("[Sevice Worker] background sync]", event);
  if (event.tag === "sync-add-todo") {
    console.log("[Service Worker] Syncing new Todo!");
    event.waitUntil(
      readAllData("sync-todo").then((data) => {
        Promise.all(
          Object.keys(data).map(async (dt) => {
            let fd = makeFormData(data[dt].body);

            return await fetch(data[dt].url, {
              method: data[dt].method,
              headers: {
                Accept: "application/json",
              },
              body: fd,
            })
              .then((res) => res.json())
              .then((res) => {
                console.log("Sent data", res);
                if (res.status) {
                  return { status: true, id: data[dt].id };
                }
              })
              .catch((err) => {
                console.log("Error while sending data", err);
                return { status: false };
              });
          })
        ).then((res) => {
          res.forEach((item) => {
            if (item.status) {
              deleteItemFormData("sync-todo", item.id);
            }
          });
        });
      })
    );
  }
});
