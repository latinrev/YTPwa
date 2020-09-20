// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = ["/index.html"];
const CACHE_NAME = "appCache";

// CODELAB: Precache static resources here.
self.addEventListener("install", (e) => {
	e.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("[ServiceWorker] Pre-caching offline page");
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

// CODELAB: Remove previous cached data from disk.
self.addEventListener("activate", (e) => {
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key !== CACHE_NAME) {
						console.log("[ServiceWorker] Removing old cache", key);
						return caches.delete(key);
					}
				})
			);
		})
	);
});
self.addEventListener("fetch", (e) => {
	e.respondWith(
		fetch(e.request).catch(() => {
			return caches.open(CACHE_NAME).then((cache) => {
				return cache.match("index.html");
			});
		})
	);
});
