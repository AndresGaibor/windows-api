import { clipboard } from "@nut-tree/nut-js";

(async () => {
  await clipboard.setContent("Hello World!");

  const clipboardText = await clipboard.getContent();
})();
