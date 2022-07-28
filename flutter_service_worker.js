'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "e6012fb06c89dff85a58dbab3286fe83",
"index.html": "6f48cff1f38860d993d81fea27097b4c",
"/": "6f48cff1f38860d993d81fea27097b4c",
"main.dart.js": "cf7a5589af1b2520d2187565ea147490",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"favicon.png": "84c65cc7c70b72c5a40b5a563295b9a9",
"icons/Icon-192.png": "84c65cc7c70b72c5a40b5a563295b9a9",
"icons/Icon-512.png": "84c65cc7c70b72c5a40b5a563295b9a9",
"manifest.json": "b30176cb52830c0cd4266e88b99626de",
"assets/AssetManifest.json": "449921ac82619e52f12e92790600213d",
"assets/NOTICES": "2913bc82daa852aff14cd09e0a701d16",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/resource/logo.png": "84c65cc7c70b72c5a40b5a563295b9a9",
"assets/resource/foods/8.png": "27b01d9722d61116286ad86782e8722a",
"assets/resource/foods/9.png": "49bab6fdb7e9a31a24ab361e5e41faa1",
"assets/resource/foods/14.png": "f20ddf3a88fa4c75045d196c03f0c43c",
"assets/resource/foods/15.png": "be76ca1a5c88680f0086bd7efa8b64f8",
"assets/resource/foods/17.png": "2572959bcfbf611289de658b602ec736",
"assets/resource/foods/16.png": "5c7bdabc23d8687b0e0e79631908ed03",
"assets/resource/foods/12.png": "62b5a803dbcf7f70a471da46334091b0",
"assets/resource/foods/13.png": "e0c6f721c5a27663061f6ece6df7da00",
"assets/resource/foods/11.png": "4ab247aff21711bf485cccabce617402",
"assets/resource/foods/10.png": "b295fcf58cfbc8d29c67e0a1cf68c6c0",
"assets/resource/foods/20.png": "f23507caf4fc89c09dd24fb7a6350840",
"assets/resource/foods/18.png": "8b84d18b8534d394929405fb3297324b",
"assets/resource/foods/19.png": "7be5cb1089fa802df06bd541cc4bb2b3",
"assets/resource/foods/4.png": "111955e0a526c0702270c3015fcdb056",
"assets/resource/foods/5.png": "a5717cb4e0e0f630ec0e69caaa5c5b9b",
"assets/resource/foods/7.png": "bcd0c91fcb1d4af0a17a41990aac9f3e",
"assets/resource/foods/6.png": "9633f831e4e43eeede3a9aedc3143bd5",
"assets/resource/foods/2.png": "8dc9555e1c0ab67d9586d518a271cb63",
"assets/resource/foods/3.png": "b2ed9126ac65373fa56b3f06a7f8dd48",
"assets/resource/foods/1.png": "2813d5a5a64b13ee890fc7c53eaa0975",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
