import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright';

const [projectPath,outputPath]=process.argv.slice(2);
if(!projectPath||!outputPath) throw new Error('Usage: node render.mjs project.json output.mp4');
const p=JSON.parse(await fs.readFile(projectPath,'utf8'));
const totalFrames=p.fps*p.duration;
const dir=await fs.mkdtemp(path.join(os.tmpdir(),'microstock-frames-'));
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:p.width,height:p.height},deviceScaleFactor:1});
const escaped=p.javascript.replace(/<\\/script/gi,'<\\\\/script');
const doc=`<!doctype html><html><head><meta charset="utf-8"><style>${p.css}</style></head><body>${p.html}<script>window.__renderCallbacks=[];window.motion={render(fn){window.__renderCallbacks.push(fn)}};${escaped};window.__renderFrame=(time,frame,fps)=>{for(const cb of window.__renderCallbacks)cb(time,frame,fps)};<\/script></body></html>`;
await page.setContent(doc,{waitUntil:'load'});
await page.evaluate(()=>document.fonts?.ready);
for(let frame=0;frame<totalFrames;frame++){
 const time=frame/p.fps;
 await page.evaluate(({time,frame,fps})=>window.__renderFrame(time,frame,fps),{time,frame,fps:p.fps});
 await page.screenshot({path:path.join(dir,`${String(frame).padStart(6,'0')}.png`),type:'png'});
 if(frame%30===0) console.log(`frame ${frame}/${totalFrames}`);
}
await browser.close();
const args=['-y','-framerate',String(p.fps),'-i',path.join(dir,'%06d.png'),'-c:v','libx264','-preset','slow','-crf','15','-pix_fmt','yuv420p','-movflags','+faststart','-r',String(p.fps),outputPath];
const ff=spawnSync('ffmpeg',args,{stdio:'inherit'});
if(ff.status!==0) throw new Error('FFmpeg export failed. Ensure ffmpeg is installed and available in PATH.');
console.log(outputPath);
