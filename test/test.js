/**
 author: william   email:362661044@qq.com
 create_at:2024/7/18
 **/
async function connectInfo() {
  const json = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "get",
  });
  return await json.json();
}
async function main() {
  const r = await connectInfo();
  console.log("connectInfo", r);
  console.log("process.cwd", process.cwd());
  console.log("__file", __filename);
  console.log("__dir", __dirname);
}
main();
