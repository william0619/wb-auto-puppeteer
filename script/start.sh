#!/bin/bash

# 启动 Google Chrome 浏览器并开启远程调试端口
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 &

# 等待 Chrome 完全启动
sleep 2

# 运行 auto-puppeteer 脚本
./auto-puppeteer

# 检查 auto-puppeteer 脚本的退出状态
if [ $? -eq 0 ]; then
    echo "auto-puppeteer 脚本运行成功。"
else
    echo "auto-puppeteer 脚本运行失败。" >&2
fi

# 退出
exit 0
