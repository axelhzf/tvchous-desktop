var gui = require('nw.gui');
var win = gui.Window.get();

key("⌘+r, ctrl+r", function () {
  window.location.reload();
});

if (process.env.ENV === "dev") {
  key("⇧+f12, f12", function (e) {
    win.showDevTools();
  });
}


