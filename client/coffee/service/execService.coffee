exec = require('child_process').exec

class ExecService
  downloadTorrent: (link) -> exec "open /Applications/uTorrent.app #{link}"

  playFile: (file) -> exec "open /Applications/VLC.app #{file}"


angular.module("app").service "execService", ExecService