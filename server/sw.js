var STR_CACHE_NAME = 'data-cache-20201130';
var LST_DEFAULT_CACHE = [
	'/offline.html'
];

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(STR_CACHE_NAME).then(function(cache) {
			return cache.addAll(LST_DEFAULT_CACHE);
		}).then(function(event){
			return self.skipWaiting();
		})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(CacheNames) {
			return Promise.all(
				CacheNames.map(function(Key) {
					if (Key != STR_CACHE_NAME) {
						return caches.delete(Key);
					}
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.open(STR_CACHE_NAME).then(function(cache) {
			return cache.match(event.request).then(function(response) {
				var fetchPromise = fetch(event.request).then(function(response) {
					if ((response.status == 200) && (event.request.method == 'GET') && (!response.headers.has('isphp')) && (event.request.url.match(/^https:\/\/gjan.info/gi))) {
						cache.put(event.request, response.clone());
					}
					return response;
				});
				return response || fetchPromise;
			}).catch(function(error) {
				return cache.match('/offline.html');
			});
		})
	);
});
