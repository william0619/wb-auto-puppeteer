/**
 author: william   email:362661044@qq.com
 create_at:2024/7/17
 **/
import puppeteer from "puppeteer-core";
// import puppeteer from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js";
import { getChromePath, launchChrome, setConfig } from "./utils.mjs";
import { createReportFile } from "./writer.mjs";
import { Task } from "./task.mjs";
import path from "node:path";
// https://ad.weibo.com/blitz?customer_id=7879993200
async function main() {
  // const info = await connectInfo();
  console.log("cmd path:", process.cwd());
  console.log("execPath:", path.dirname(process.execPath));
  const config = await setConfig();
  const cPath = getChromePath();
  console.log("launch path", cPath);
  const wsEndpoint = await launchChrome(cPath);
  // return;
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsEndpoint,
    executablePath: cPath,
    headless: config.headless,
    devtools: false,
    // userDataDir: getUserDataPath(),
    // headless: false,
    // browserWSEndpoint: info?.webSocketDebuggerUrl ?? "ws://localhost:9222",
    // browserWSEndpoint: "ws://localhost:9222",
    defaultViewport: {
      width: 0,
      height: 0,
    },
  });

  const customerIds = config?.customerIds ?? [];
  const task = new Task(browser, config);
  const dataSource = [];
  for (const id of customerIds) {
    console.log("正在收集数据 customerId:", id);
    const data = await task.run(id);
    dataSource.push(data);
  }
  // console.log("dataSource", dataSource);
  await createReportFile(dataSource);

  await browser.disconnect();
  console.log("已断开连接");
}
main().catch((err) => {
  console.error("main error", err);
});
process.on("uncaughtException", (err) => {
  console.error("process error", err?.message);
});
