import {
  mouse,
  left,
  right,
  up,
  down,
  Point,
  straightTo,
  screen,
  imageResource,
  Button,
} from "@nut-tree/nut-js";
import { join } from "path";

require("@nut-tree/template-matcher");
async () => {
  await mouse.move(left(500));
  await mouse.move(up(500));
  await mouse.move(right(500));
  console.log("hola");
  await mouse.move(down(500));

  // const target = new Point(500, 350);
  // await mouse.setPosition(target);
};

(async () => {
  try {
    screen.config.resourceDirectory = join(__dirname, "../resources/");
    // const region = await screen.find(imageResource("ventas-menu.png"));
    const region = await screen.find(imageResource("perseo-barra.png"));
    // Region { left: 1, top: 110, width: 102, height: 25 }
    // x 71, y 118

    const point = new Point(
      region.left + region.width / 2,
      region.top + region.height / 2
    );

    mouse.setPosition(point);

    mouse.click(Button.LEFT);

    console.log(region);
  } catch (e) {
    console.error(e);
  }
})();

(async () => {
  try {
    for (let i = 0; i < 10000; i++) {
      const mousePosition = await mouse.getPosition();

      console.log(mousePosition);
    }
  } catch (e) {
    console.error(e);
  }
})();
