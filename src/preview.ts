export function buildPreviewDocument(html: string, css: string, js: string, initialTime = 0, fps = 30): string {
  const safeJs = js.replace(/<\/script>/gi, '<\\/script>');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: transparent;
    }
    /* Every project is rendered inside a responsive stage. The single scene
       root is forced to fit the iframe even if an imported AI template uses
       fixed output dimensions such as 1920px × 1080px. */
    #motion-root {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      isolation: isolate;
    }
    ${css}
    #motion-root > :only-child,
    #motion-root > [data-motion-root] {
      width: 100% !important;
      height: 100% !important;
      min-width: 0;
      min-height: 0;
      flex: 0 0 auto;
    }
  </style>
</head>
<body>
  <div id="motion-root">${html}</div>
  <script>
    (function() {
      window.__renderCallbacks = [];
      window.__lastError = null;

      window.motion = {
        render: function(fn) {
          if (typeof fn === 'function') {
            window.__renderCallbacks.push(fn);
          }
        }
      };

      window.__renderFrame = function(time, frame, currentFps) {
        var f = typeof frame === 'number' ? frame : Math.floor(time * (currentFps || ${fps}));
        var rate = currentFps || ${fps};
        for (var i = 0; i < window.__renderCallbacks.length; i++) {
          try {
            window.__renderCallbacks[i](time, f, rate);
          } catch (err) {
            window.parent.postMessage({ type: 'MOTION_RUNTIME_ERROR', error: String(err && err.message ? err.message : err) }, '*');
          }
        }
      };

      window.addEventListener('message', function(evt) {
        if (!evt || !evt.data) return;
        if (evt.data.type === 'SEEK_FRAME') {
          window.__renderFrame(evt.data.time, evt.data.frame, evt.data.fps);
        }
      });

      try {
        ${safeJs}
        window.parent.postMessage({ type: 'MOTION_CODE_SUCCESS' }, '*');
      } catch (err) {
        window.parent.postMessage({ type: 'MOTION_RUNTIME_ERROR', error: String(err && err.message ? err.message : err) }, '*');
      }

      // Initial execution
      window.__renderFrame(${initialTime}, 0, ${fps});
    })();
  <\/script>
</body>
</html>`;
}
