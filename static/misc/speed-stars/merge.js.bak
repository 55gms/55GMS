(function() {
  'use strict';

  const defaultConfig = {
    files: [],
    basePath: '',
    debug: true
  };

  const config = Object.assign({}, defaultConfig, window.fileMergerConfig || {});
  window.mergedFiles = window.mergedFiles || {};
  const mergeStatus = {};

  function log(...args) {
    if (config.debug) console.log('[FileMerger]', ...args);
  }

  function error(...args) {
    console.error('[FileMerger]', ...args);
  }

  function normalizeUrl(url) {
    try {
      return decodeURIComponent(url.toString().split('?')[0]);
    } catch (e) { return url; }
  }

  function urlsMatch(url1, url2) {
    const norm1 = normalizeUrl(url1);
    const norm2 = normalizeUrl(url2);
    if (norm1 === norm2) return true;
    if (norm1.endsWith(norm2) || norm2.endsWith(norm1)) return true;
    return norm1.split('/').pop() === norm2.split('/').pop();
  }

  async function mergeSplitFiles(filePath, numParts) {
    try {
      const parts = [];
      for (let i = 1; i <= numParts; i++) {
        parts.push(`${filePath}.part${i}`);
      }

      log(`Merging ${filePath} from ${numParts} parts...`);

      // Fetch parts using the original fetch to bypass interception
      const responses = await Promise.all(
        parts.map(part => window.originalFetch(part))
      );

      for (let i = 0; i < responses.length; i++) {
        if (!responses[i].ok) {
          if (responses[i].status === 403 || responses[i].status === 404) {
            throw new Error(`Part missing or blocked by CDN (Size limit?): ${parts[i]}`);
          }
          throw new Error(`Failed to load ${parts[i]}: ${responses[i].status}`);
        }
      }

      const buffers = await Promise.all(responses.map(r => r.arrayBuffer()));
      const totalSize = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
      const mergedArray = new Uint8Array(totalSize);

      let offset = 0;
      for (const buffer of buffers) {
        mergedArray.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
      }

      log(`✅ ${filePath} merged successfully: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      return mergedArray.buffer;
    } catch (err) {
      error(`Failed to merge ${filePath}:`, err);
      throw err;
    }
  }

  function shouldInterceptFile(url) {
    const urlStr = normalizeUrl(url);
    if (urlStr.includes('.part')) return null;

    for (const file of config.files) {
      const fileName = file.name;
      const fullPath = config.basePath ? `${config.basePath}${fileName}` : fileName;
      
      if (urlsMatch(urlStr, fileName) || urlsMatch(urlStr, fullPath)) {
        return fileName;
      }
    }
    return null;
  }

  function getMergedFile(filename) {
    if (window.mergedFiles[filename]) return window.mergedFiles[filename];
    for (const [key, value] of Object.entries(window.mergedFiles)) {
      if (urlsMatch(key, filename)) return value;
    }
    return null;
  }

  // --- FETCH INTERCEPTOR ---
  if (!window.originalFetch) window.originalFetch = window.fetch;

  window.fetch = function(url, ...args) {
    const filename = shouldInterceptFile(url);
    
    if (filename) {
      log('Intercepting fetch for:', filename);
      return new Promise((resolve, reject) => {
        const maxWait = 60000; // 60 seconds timeout
        const startTime = Date.now();

        const check = setInterval(() => {
          const buffer = getMergedFile(filename);
          if (buffer) {
            clearInterval(check);
            const contentType = filename.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream';
            resolve(new Response(buffer, {
              status: 200, statusText: 'OK',
              headers: { 'Content-Type': contentType, 'Content-Length': buffer.byteLength.toString() }
            }));
          } else if (mergeStatus[filename] === 'failed') {
            clearInterval(check);
            reject(new Error(`Merge failed for ${filename}`));
          } else if (Date.now() - startTime > maxWait) {
            clearInterval(check);
            reject(new Error(`Timeout waiting for ${filename}`));
          }
        }, 100);
      });
    }
    return window.originalFetch.call(this, url, ...args);
  };

  // --- XHR INTERCEPTOR ---
  if (!window.OriginalXMLHttpRequest) window.OriginalXMLHttpRequest = window.XMLHttpRequest;

  window.XMLHttpRequest = function(options) {
    const xhr = new window.OriginalXMLHttpRequest(options);
    const originalOpen = xhr.open;
    const originalSend = xhr.send;
    let requestUrl = '';

    xhr.open = function(method, url, ...args) {
      requestUrl = url;
      return originalOpen.call(this, method, url, ...args);
    };

    xhr.send = function(...args) {
      const filename = shouldInterceptFile(requestUrl);
      if (filename) {
        log('Intercepting XHR for:', filename);
        const waitForMerge = () => {
          const buffer = getMergedFile(filename);
          if (buffer) {
            Object.defineProperties(xhr, {
              status: { value: 200 },
              statusText: { value: 'OK' },
              response: { value: buffer },
              responseType: { value: 'arraybuffer' },
              readyState: { value: 4 }
            });
            setTimeout(() => {
              if (xhr.onreadystatechange) xhr.onreadystatechange();
              if (xhr.onload) xhr.onload({ type: 'load', target: xhr });
            }, 1);
          } else if (mergeStatus[filename] === 'failed') {
            if (xhr.onerror) xhr.onerror(new Error("Merge Failed"));
          } else {
            setTimeout(waitForMerge, 100);
          }
        };
        waitForMerge();
        return;
      }
      return originalSend.call(this, ...args);
    };
    return xhr;
  };

  // --- START MERGING ---
  async function autoMergeFiles() {
    if (!config.files.length) return;
    
    try {
      const promises = config.files.map(file => {
        const fullPath = config.basePath ? `${config.basePath}${file.name}` : file.name;
        mergeStatus[file.name] = 'merging';
        
        return mergeSplitFiles(fullPath, file.parts)
          .then(buffer => {
            window.mergedFiles[file.name] = buffer;
            window.mergedFiles[fullPath] = buffer;
            mergeStatus[file.name] = 'ready';
          })
          .catch(err => {
            mergeStatus[file.name] = 'failed';
            error(err);
          });
      });
      await Promise.all(promises);
    } catch (e) { error(e); }
  }

  autoMergeFiles();
})();