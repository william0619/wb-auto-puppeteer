/**
 author: william   email:362661044@qq.com
 create_at:2024/7/17
 **/
import dayjs from "dayjs";
import { sleep } from "./utils.mjs";

export class Task {
  /**
   * @type {Browser}
   * **/
  #browser;

  #config;

  /**
   * @param browser  {Browser}
   * @param config  {any}
   * **/
  constructor(browser, config) {
    this.#browser = browser;
    this.#config = config;
  }

  /**
   * @param cid  {string}
   * **/
  async run(cid) {
    const page = await this.#browser.newPage();
    await page.goto(`https://ad.weibo.com/blitz?customer_id=${cid}`);
    const userInfo = await this.getUserInfo(page, cid);
    const preview = await this.getPreview(page, cid);
    const finance = await this.getAccountFinance(page, cid);
    const { startDate, endDate } = this.getDateRange();
    await sleep(500);
    await page.close();
    return {
      ...userInfo,
      ...preview,
      ...finance,
      startDate: startDate,
      endDate: endDate,
    };
  }

  async getUserInfo(page, cid) {
    const res = await page.evaluate(
      async ({ id }) => {
        const res = await window.fetch(
          `https://ad.weibo.com/rb/user/info?customer_id=${id}`,
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
          },
        );
        const data = await res.json();
        return data.result.info;
      },
      { id: cid },
    );
    return { customerId: cid, customerName: res.name };
  }

  async getPreview(page, cid) {
    const { startDate, endDate } = this.getDateRange();
    return await page.evaluate(
      async ({ cid, startDate, endDate }) => {
        const res = await window.fetch(
          `https://gateway.biz.weibo.com/report/effect/get_preview_index?app=superfans&app=superfans&customer_id=${cid}&start_date=${startDate}&end_date=${endDate}`,
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
          },
        );
        const data = await res.json();
        return data.data;
      },
      { cid: cid, startDate, endDate },
    );
  }

  async getAccountFinance(page, cid) {
    const res = await page.evaluate(
      async ({ id }) => {
        const res = await window.fetch(
          `https://gateway.biz.weibo.com/users/account/finance?app=superfans&customer_id=${id}`,
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
          },
        );
        const data = await res.json();
        return data.data;
      },
      { id: cid },
    );
    return res;
  }

  getDateRange() {
    let startDate = dayjs().format("YYYY-MM-DD");
    let endDate = dayjs().format("YYYY-MM-DD");
    if (this.#config?.dateRange && this.#config?.dateRange.length === 2) {
      startDate = this.#config?.dateRange[0];
      endDate = this.#config?.dateRange[1];
    }
    return { startDate, endDate };
  }
}
