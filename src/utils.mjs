/**
 author: william   email:362661044@qq.com
 create_at:2024/7/17
 **/
import fs from "node:fs/promises";
import path from "node:path";

export async function connectInfo() {
  const json = await fetch("http://localhost:9222/json/version");
  return await json.json();
}

export async function getConfigJson() {
  const cwd = process.cwd();
  const filePath = path.resolve(cwd, "./config.json");
  const json = await fs.readFile(filePath, { encoding: "utf-8" });
  return JSON.parse(json);
}

export async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// 随机n位字符串, 用于生成文件名
export function nanoid(n = 6) {
  const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    },
  );
  return id.substring(0, n);
}
