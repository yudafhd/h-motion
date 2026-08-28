import { useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { invoke } from '@tauri-apps/api/core';
import { buildPreviewDocument } from './preview';
import { defaultHtml, defaultCss, defaultJs } from './defaultProject';

type Tab='html'|'css'|'js';
type Preset={name:string;width:number;height:number};
const presets:Preset[]=[
 {name:'Adobe Stock 4K Landscape',width:3840,height:2160},
 {name:'Adobe Stock 4K Vertical',width:2160,height:3840},
 {name:'Adobe Stock 4K Square',width:2160,height:2160}
];

export default function App(){
 const [html,setHtml]=useState(defaultHtml),[css,setCss]=useState(defaultCss),[js,setJs]=useState(defaultJs);
 const [tab,setTab]=useState<Tab>('html'); const [preset,setPreset]=useState(presets[0]);
 const [fps,setFps]=useState(30),[duration,setDuration]=useState(10),[status,setStatus]=useState('Ready');
 const doc=useMemo(()=>buildPreviewDocument(html,css,js),[html,css,js]);
 const value=tab==='html'?html:tab==='css'?css:js;
 const setValue=(v:string|undefined)=>{const x=v??''; tab==='html'?setHtml(x):tab==='css'?setCss(x):setJs(x)};
 const exportVideo=async()=>{
   setStatus('Preparing export…');
   try{
    const result=await invoke<string>('export_video',{project:{html,css,javascript:js,width:preset.width,height:preset.height,fps,duration}});
    setStatus(result);
   }catch(e){setStatus('Export failed: '+String(e))}
 };
 return <div className="app">
  <header><div><strong>Microstock Motion</strong><span>MVP</span></div><button onClick={exportVideo}>Export Adobe Stock MP4</button></header>
  <section className="workspace">
   <aside>
    <h3>Output</h3>
    <label>Preset<select value={preset.name} onChange={e=>setPreset(presets.find(p=>p.name===e.target.value)!)}>{presets.map(p=><option key={p.name}>{p.name}</option>)}</select></label>
    <div className="size">{preset.width} × {preset.height}</div>
    <label>FPS<select value={fps} onChange={e=>setFps(Number(e.target.value))}>{[24,25,30,60].map(v=><option key={v}>{v}</option>)}</select></label>
    <label>Duration<input type="number" min="5" max="60" value={duration} onChange={e=>setDuration(Number(e.target.value))}/></label>
    <h3>Preflight</h3>
    <ul><li>✓ 4K stock preset</li><li>✓ {fps} FPS</li><li>✓ {duration}s duration</li><li>✓ No audio</li><li>✓ Frame-based render API</li></ul>
    <div className="status">{status}</div>
   </aside>
   <main className="previewPanel"><div className="previewStage"><iframe title="preview" srcDoc={doc}/></div></main>
  </section>
  <section className="editorPanel">
   <nav>{(['html','css','js'] as Tab[]).map(t=><button className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t.toUpperCase()}</button>)}</nav>
   <Editor height="36vh" theme="vs-dark" language={tab==='js'?'javascript':tab} value={value} onChange={setValue} options={{minimap:{enabled:false},fontSize:13,automaticLayout:true}}/>
  </section>
 </div>
}
