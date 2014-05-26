var proc = require('child_process');

function playFile (file, cb) {
  runVlc(file, cb);
}

function playRemote (href, cb) {
  runVlc(href, cb);
}

function runVlc (href, args, cb) {

  if (typeof args === "function") {
    cb = args;
    args = {};
  }

  var vlc = proc.exec('vlc ' + href + ' ' + args + ' || /Applications/VLC.app/Contents/MacOS/VLC ' + href + ' ' + args, function (error, stdout, stderror) {
    if (error) {
      if (cb) cb(error);
    }
  });

  vlc.on('exit', function () {
    if (cb) cb();
  });

}

module.exports = {
  playFile: playFile,
  playRemote: playRemote
};


