/**
 author: william   email:362661044@qq.com
 create_at:2024/7/17
 **/
import dayjs from "dayjs";

export class Task {
  /**
   * @type {Browser}
   * **/
  #browser;

  /**
   * @param browser  {Browser}
   * **/
  constructor(browser) {
    this.#browser = browser;
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
    return { ...userInfo, ...preview, ...finance };
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
    const startDate = dayjs().format("YYYY-MM-DD");
    const endDate = dayjs().format("YYYY-MM-DD");
    console.log("startDate", startDate);
    return await page.evaluate(
      async ({ cid, startDate, endDate }) => {
        const res = await window.fetch(
          `https://gateway.biz.weibo.com/report/effect/get_preview_index?app=superfans&app=superfans&customer_id=${cid}&start_date=2024-07-01&end_date=${endDate}`,
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
}
