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
