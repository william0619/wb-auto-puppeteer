/**
 author: william   email:362661044@qq.com
 create_at:2024/7/17
 **/
import fs from "node:fs/promises";
import path from "node:path";
import nodeFetch from "node-fetch";
import os from "node:os";
import { spawn } from "node:child_process";

export function isPkg() {
  // @ts-ignore
  return typeof process.pkg !== "undefined";
}

export function executableDir() {
  return isPkg()
    ? path.dirname(process.execPath)
    : path.resolve(process.cwd(), "./");
}

export async function connectWs() {
  const res = await nodeFetch("http://localhost:9222/json/version", {
    method: "get",
  });
  const data = await res.json();
  // console.log("browser config", data);
  return data?.webSocketDebuggerUrl ?? "";
}

export async function setConfig() {
  const dir = executableDir();
  try {
    const filePath = path.resolve(dir, "./config.json");
    console.log("config path:", filePath);
    const json = await fs.readFile(filePath, { encoding: "utf-8" });
    const data = JSON.parse(json);
    console.log("set config =>", data);
    globalThis.customerIds = data.customerIds;
    globalThis.dateRange = data.dateRange;
    globalThis.headless = data?.headless ? Boolean(data.headless) : false;
    return globalThis;
  } catch (e) {
    console.error("配置文件有误");
    process.exit();
  }
}

export const getChromePath = () => {
  const _os = os.platform();
  const defPath = {
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  }[_os.toString()];
  if (globalThis?.CHROME_PATH) return globalThis.CHROME_PATH;
  return defPath;
};

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

export function getUserDataPath() {
  // 获取当前用户名
  const userInfo = os.userInfo();
  const _os = os.platform();
  const defPath = {
    darwin: `/Library/Application Support/Google/Chrome`,
    win32: `\\AppData\\Local\\Google\\Chrome\\User Data`,
  }[_os.toString()]; // 构造 Chrome 的用户数据目录路径
  const p = path.join(userInfo.homedir, defPath);
  console.log("userDataPath: ", p);
  return p;
}
export async function launchChrome(chromePath) {
  // const chromePath = getChromePath();
  // console.log("chromePath:", chromePath)/;
  let ws = "";

  try {
    console.log("检测浏览器是否运行...");
    ws = await retryFn(connectWs, {
      errorMsg: "无法连接到 Chrome 浏览器",
      delay: 1000,
    });
  } catch (e) {
    const _process = spawn(chromePath, ["--remote-debugging-port=9222"], {})
      .on("close", (code) => process.exit(code))
      .on("error", (spawnError) => console.error(spawnError));
    console.log("正在启动 Chrome 浏览器...");

    ws = await retryFn(connectWs, {
      errorMsg: "无法连接到 Chrome 浏览器",
      delay: 2000,
    });
    console.log("启动 Chrome 浏览器成功");
  }
  return ws;
}

export async function retryFn(fn, option) {
  const { retry = 3, delay = 1500, errorMsg } = option ?? {};
  let _retry = retry;
  while (_retry > 0) {
    try {
      return await fn();
    } catch (e) {
      --_retry;
      await sleep(delay);
    }
  }
  throw new Error(`重试次数已用完 ${retry} => ${errorMsg}`);
}
