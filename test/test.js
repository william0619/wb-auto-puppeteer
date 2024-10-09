import { launchChrome } from "../src/utils.mjs";

(async () => {
  const ws = await launchChrome();
  console.log("ws: ", ws);
})();
