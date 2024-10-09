/**
 author: william   email:362661044@qq.com
 create_at:2024/7/18
 **/
// 复制文件 config.json 到  build 目录
import fs from "node:fs";
import path from "node:path";
const cwd = process.cwd();

function copyConfFile() {
  const src = path.resolve(cwd, "./config.json");
  const dist = path.resolve(cwd, "./build/config.json");
  fs.copyFileSync(src, dist);
}

// function copyConfSh() {
//   const src = path.resolve(cwd, "./script/start.sh");
//   const dist = path.resolve(cwd, "./build/start.sh");
//   fs.copyFileSync(src, dist);
// }
copyConfFile();
// copyConfSh();
