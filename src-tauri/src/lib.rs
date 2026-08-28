use serde::Deserialize;
use std::{fs, process::Command};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RenderProject { html:String, css:String, javascript:String, width:u32, height:u32, fps:u32, duration:u32 }

#[tauri::command]
fn export_video(project: RenderProject) -> Result<String,String>{
 if project.duration < 5 || project.duration > 60 { return Err("Adobe Stock duration must be 5–60 seconds".into()); }
 if ![24,25,30,60].contains(&project.fps) { return Err("Unsupported MVP frame rate".into()); }
 let base=std::env::temp_dir().join(format!("microstock-motion-{}",std::process::id()));
 fs::create_dir_all(&base).map_err(|e|e.to_string())?;
 let project_path=base.join("project.json");
 fs::write(&project_path,serde_json::to_vec(&project).map_err(|e|e.to_string())?).map_err(|e|e.to_string())?;
 let renderer=std::env::current_dir().map_err(|e|e.to_string())?.join("renderer/render.mjs");
 let output=std::env::current_dir().map_err(|e|e.to_string())?.join("microstock-motion-output.mp4");
 let result=Command::new("node").arg(renderer).arg(&project_path).arg(&output).output().map_err(|e|format!("Could not start Node renderer: {e}"))?;
 if !result.status.success(){ return Err(String::from_utf8_lossy(&result.stderr).to_string()); }
 Ok(format!("Export complete: {}",output.display()))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run(){
 tauri::Builder::default().invoke_handler(tauri::generate_handler![export_video]).run(tauri::generate_context!()).expect("error while running tauri application");
}
