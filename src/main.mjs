/**
 author: william   email:362661044@qq.com
 create_at:2024/7/17
 **/
// import puppeteer from "puppeteer-core";
import puppeteer from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js";
import { connectInfo, getConfigJson } from "./utils.mjs";
import { createReportFile } from "./writer.mjs";
import { Task } from "./task.mjs";
const isPkg = typeof process.pkg !== "undefined";

// //mac path replace
// let chromiumExecutablePath = isPkg
//   ? puppeteer
//       .executablePath()
//       .replace(
//         /^.*?\/node_modules\/puppeteer\/\.local-chromium/,
//         path.join(path.dirname(process.execPath), "chromium"),
//       )
//   : puppeteer.executablePath();
//
// console.log(process.platform);
// //check win32
// if (process.platform === "win32") {
//   chromiumExecutablePath = isPkg
//     ? puppeteer
//         .executablePath()
//         .replace(
//           /^.*?\\node_modules\\puppeteer\\\.local-chromium/,
//           path.join(path.dirname(process.execPath), "chromium"),
//         )
//     : puppeteer.executablePath();
// }

async function main() {
  const config = await getConfigJson();
  const info = await connectInfo();
  const browser = await puppeteer.connect({
    headless: false,
    browserWSEndpoint: info?.webSocketDebuggerUrl ?? "ws://localhost:9222",
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
    const data = await task.run(id);
    dataSource.push(data);
  }
  // console.log("dataSource", dataSource);
  await createReportFile(dataSource);
  await browser.disconnect();
}
main();
