/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["./assets/fonts/cousine-regular-webfont.ttf","45251aecab170d09eeb51facc68d7b94"],["./assets/fonts/cousine-regular-webfont.woff","8f2753a6d0880767d70e7578ddef4d19"],["./assets/fonts/cousine-regular-webfont.woff2","10f1d0b599acb63350e2406166878b47"],["./assets/fonts/roboto-medium-webfont.woff","7c0abcf67c732f31a0abc2733333dba2"],["./assets/fonts/roboto-medium-webfont.woff2","21a82010b67e225a39c31c6fb39f79a4"],["./assets/fonts/roboto-thin-webfont.woff","4b768a761cc65765f865a4eace3a8754"],["./assets/fonts/roboto-thin-webfont.woff2","2299785c916064c824aa8f87fcba856e"],["./assets/fonts/robotomono-thin-webfont.ttf","a0421704f93fee6f97bd7d4ab1e4655e"],["./assets/fonts/robotomono-thin-webfont.woff","78f7bd146a74033b563be25bce2e205e"],["./assets/fonts/robotomono-thin-webfont.woff2","c5a9bc82a4a756bb5da7f5f8592bb082"],["./assets/img/bg/backgroun2.png","7f27afe44beae06934b798601e22b80b"],["./assets/img/bg/background.png","4b9052faeb57068cfb12d57fff7e5ede"],["./assets/img/bg/tileable.jpg","236c4426c7b9626731df4cffcd0ceb09"],["./assets/img/font/font.png","c87459ee6256717b0b017a44f426b132"],["./assets/img/font/outline_0.png","26d1c6f03b242bdb14445378b77e718a"],["./assets/img/font/regular_0.png","1f4b06ba51de955e03e60e5ece40b02b"],["./assets/img/icon/icon128.png","13a28356df166411093984100e34517b"],["./assets/img/icon/icon168.png","046992ced6082f62187655c4d2a0971e"],["./assets/img/icon/icon192.png","0c4ec3819253d169cde06e20866523f2"],["./assets/img/icon/icon256.png","d9996c6a56b2e8d998c832704aaf04ea"],["./assets/img/icon/icon32.png","5686718477e6155681f9da0eefc0647d"],["./assets/img/icon/icon512.png","bda522b90666041d9d8736efffef05e4"],["./assets/img/icon/icon64.png","d2183b8a1e81a9d681b28972948696ca"],["./assets/img/icon/icon96.png","82cde9061a116577b4ab0a4477188715"],["./assets/img/ingame.json","3753622f695c83fcd34516b856438634"],["./assets/img/ingame.png","1a29d3d81a229bb1f673529bc2c5b59a"],["./assets/img/screen.png","141178f5b5ed9275068313fb4aeeface"],["./assets/img/smallicon/Element 424.png","ad83ac74b5bd035c01abe99b07ecb5b2"],["./assets/img/smallicon/smallIcon24.png","7fc1efe5fb99c65850a9c47d67eac497"],["./assets/img/smallicon/smallIcon36.png","cc610a61285fd955e942acc7708ce8c2"],["./assets/img/smallicon/smallIcon48.png","8b31c792633a1ad536cf8d3fc0c1f59c"],["./assets/img/smallicon/smallIcon72.png","de46f234a49261b22d39d0eb220cb879"],["./assets/img/smallicon/smallIcon96.png","111c480639a76dbe3c4d9e015137b661"],["./assets/img/ui.json","772b6fa0e33275fa829bb7cf29cf55a9"],["./assets/img/ui.png","ea66fcc50f039a02c1613fb6c289714c"],["./assets/img/whiteSquare.png","0a38338cb3758359b78ab9f36f1696a5"],["./data/changelog.json","09a236a15ff5d558186e9468190c813c"],["./data/config.json","ee655a669f9815d0b1d8a58c487a5cee"],["./data/preload.json","82df1af36322351c4925128ca031e61c"],["./data/text.json","8ebeb9d8bcbb46895fe72c688a2d5c5b"],["./index.html","4a62f555ff51f0e422207f43f57348c3"],["./manifest.json","eee2ef8df498bbcd0b3c7527f48a1149"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







