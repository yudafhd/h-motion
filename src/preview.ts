export function buildPreviewDocument(html:string, css:string, js:string, time=0){
  const safeJs = js.replace(/<\\/script/gi, '<\\\\/script');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}<script>
  window.__renderCallbacks=[];
  window.motion={render(fn){window.__renderCallbacks.push(fn)}};
  try{${safeJs}}catch(e){document.body.innerHTML='<pre style="color:red">'+e+'</pre>'}
  window.__renderFrame=(time,frame,fps)=>{for(const cb of window.__renderCallbacks)cb(time,frame,fps)};
  window.__renderFrame(${time},0,30);
  <\/script></body></html>`;
}
