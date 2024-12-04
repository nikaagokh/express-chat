import { inputListener } from "./input.js";
import { tooltipListener } from "./tooltip.js";

export const initListeners = () => {
    inputListener();
    tooltipListener();
}