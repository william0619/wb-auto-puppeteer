/**
 author: william   email:362661044@qq.com
 create_at:1524/7/17
 **/

import fs from "node:fs";
import path from "node:path";
import dayjs from "dayjs";
import xlsx from "node-xlsx";
import { executableDir, nanoid } from "./utils.mjs";

export const reportPath = path.resolve(executableDir(), "./report");
// 判断有没有 report 文件夹没有就创建一个
const createReportFolder = () => {
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath);
  }
};

export function filename(ext = "txt") {
  const date = dayjs().format("YYYY-MM-DD_HH:mm");
  return `${date}_${nanoid(8)}.${ext}`;
}

/**
 * @param dataSource {{[key:string]:string}[]}
 * **/
export function createReportFile(dataSource) {
  const cols = [
    { name: "账号id", width: 15, key: "customerId" },
    { name: "账号名称", width: 20, key: "customerName" },
    { name: "今日消耗(元)", width: 15, key: "real_use" },
    { name: "账户日预算(元)  ", width: 15, key: "use_limit" },
    { name: "账户余额(元) ", width: 15, key: "account_balance" },

    { name: "消耗", width: 15, key: "consume" },
    { name: "曝光量", width: 15, key: "pv" },
    { name: "千次曝光成本", width: 15, key: "ecpm" },

    { name: "互动数", width: 15, key: "bhv" },
    { name: "互动率", width: 15, key: "ctr" },
    { name: "单次互动成本", width: 15, key: "acpe" },

    { name: "导流数", width: 15, key: "traffic_bhv" },
    { name: "导流率", width: 15, key: "traffic_bhv_rate" },
    { name: "单次导流成本", width: 15, key: "traffic_bhv_cost" },

    { name: "加关注数", width: 15, key: "bhv_14000008" },
    { name: "加关注率", width: 15, key: "bhv_14000008_rate" },
    { name: "加关注成本", width: 15, key: "bhv_14000008_cost" },

    { name: "激活数", width: 15, key: "bhv_70000001" },
    { name: "单次激活成本", width: 15, key: "bhv_70000001_cost" },
    { name: "单次激活成本", width: 15, key: "bhv_70000001_cost" },

    { name: "开始日期", width: 20, key: "startDate" },
    { name: "结束日期", width: 20, key: "endDate" },
  ];

  const colsName = cols.map((i) => i.name);
  const colsOptions = cols.map((i) => ({ wch: i.width }));

  const content = dataSource.map((item) => {
    return cols.map((i) => item[i.key]);
  });
  const data = [colsName, ...content];

  const sheetOptions = {
    "!cols": colsOptions,
  };

  const buffer = xlsx.build([{ name: "sheet", data: data }], {
    sheetOptions,
  }); // Returns a buffe
  createReportFolder();
  const _reportPath = path.join(reportPath, filename("xlsx"));
  fs.writeFileSync(_reportPath, buffer);
  console.log("生成报告成功：", _reportPath);
}
// Or var xlsx = require('node-xlsx').default;
