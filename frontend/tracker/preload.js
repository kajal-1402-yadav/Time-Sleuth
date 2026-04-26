const { contextBridge } = require("electron");

let mouseMoves = 0;
let clicks = 0;
let keys = 0;

// track events
window.addEventListener("mousemove", () => mouseMoves++);
window.addEventListener("click", () => clicks++);
window.addEventListener("keydown", () => keys++);

// expose to UI
contextBridge.exposeInMainWorld("tracker", {
  getActivity: () => ({
    mouseMoves,
    clicks,
    keys,
  }),
  reset: () => {
    mouseMoves = 0;
    clicks = 0;
    keys = 0;
  },
});