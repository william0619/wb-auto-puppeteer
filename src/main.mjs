/**
 author: william   email:362661044@qq.com
 create_at:2024/7/17
 **/
// import puppeteer from "puppeteer";
import puppeteer from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js";
import { connectInfo, getConfigJson } from "./utils.mjs";
import { createReportFile } from "./writer.mjs";
import { Task } from "./task.mjs";
const config = await getConfigJson();
const info = await connectInfo();

async function main() {
  const browser = await puppeteer.connect({
    headless: false,
    browserWSEndpoint: info?.webSocketDebuggerUrl ?? "ws://localhost:9222",
    defaultViewport: {
      width: 0,
      height: 0,
    },
  });

  const customerIds = config?.customerIds ?? [];
  const task = new Task(browser);
  const dataSource = [];
  for (const id of customerIds) {
    const data = await task.run(id);
    dataSource.push(data);
  }
  // console.log("dataSource", dataSource);
  await createReportFile(dataSource);
  await browser.disconnect();
}
main();
