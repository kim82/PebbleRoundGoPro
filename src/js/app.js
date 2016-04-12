// GoPro -->
//Attaching the cleanup method to the String Object
String.prototype.cleanup = function() {
   return this.replace(/[^a-zA-Z0-9]+/g, "");
};
function minutes2str(minutes) {
	var h = Math.floor(minutes / 60);          
	var m = minutes % 60;
	return h + "H" + ("0" + m).slice(-2);
}

var ByteStates = {
	unknown1:                 0,
	mode:                     1,
	unknown3:                 2,
	startUpMode:              3,
	sportMeter:               4,
	timeLapseInterval:        5,
	autoPowerMode:            6,
	viewAngle:                7,
	photoMode:                8,
	videoMode:                9,
	unknown11:                10,
	unknown12:                11,
	unknown14:                12,
	recordingMinutes:         13,
	recordingSeconds:         14,
	unknown16:                15,
	beepVolume:               16,
	led:                      17,
	misc:                     18,
	battery:                  19,
	unknown21:                20,
	photosAvailableHiByte:    21,
	photosAvailableLoByte:    22,
	photoCountHiByte:         23,
	photoCountLoByte:         24,
	videoTimeRemainingHiByte: 25,
	videoTimeRemainingLoByte: 26,
	videoCountHiByte:         27,
	videoCountLoByte:         28,
	recording:                29,
	unknown31:                30,
	
	parse: function(byteStr, byteState) {
		return parseInt(byteStr.substr(byteState,2), 16);
	}
};
var GoPro = {
  lastState: "",
	//https://github.com/KonradIT/goprowifihack
  ip: "http://10.5.5.9/",
	pwd: "",  //the password can be read from the GoPro
  timer:0,
  state:  new Uint8Array(31),
  
  onStateUpdate: function() {    
  },
  onTimeout: function() {
  },

	getPassword: function() {
		if (this.pwd === "") {
			var url = this.ip + 'bacpac/sd';

			var request = new XMLHttpRequest();
      request.timeout = 1000;
			request.open('GET', url, false);  // `false` makes the request synchronous
			request.send(null);
			if (request.status === 200) {
				GoPro.pwd = request.responseText.cleanup();
			}
		}
		return this.pwd;
	},
	command: function(param1, param2, option) {
		var url = this.ip + param1 + '/' + param2 + '?t=' + this.getPassword();
    
		if (option) {
			url += '&p=%' + option;
		}
    var xhr = new XMLHttpRequest();
    xhr.timeout = 1000;
    xhr.responseType = 'arraybuffer';
    if (param2 == "se") {
  		xhr.onload = function () {
        if (this.status == 410) {
          GoPro.power = 0;
          GoPro.onTimeout();
          GoPro.timer = setTimeout(function(){GoPro.getCurrentState();}, 1000);
          GoPro.onStateUpdate();
        }
        else if (this.status == 200) {
          GoPro.power = 1;
          var uInt8Array = new Uint8Array(this.response); // Note:not xhr.responseText
          GoPro.state = uInt8Array;
          GoPro.onStateUpdate();
        }
        if (GoPro.recording == 1)
          GoPro.timer = setTimeout(function(){GoPro.getCurrentState();}, 500);
        else
          GoPro.timer = setTimeout(function(){GoPro.getCurrentState();}, 2000);
  		};
      xhr.ontimeout = function (e) {
        GoPro.onTimeout();
        GoPro.timer = setTimeout(function(){GoPro.getCurrentState();}, 2000);
        //console.log("timeout");
      };
  	}
  	xhr.open("GET", url);
  	xhr.send(null);
	},
  
  currentText: function() {
    switch(GoPro.state[ByteStates.mode]) {
      case 0:
        if(GoPro.state[ByteStates.recording]) {
          var recMinutes = GoPro.state[ByteStates.recordingMinutes];
          var recSeconds = GoPro.state[ByteStates.recordingSeconds];
          
          return ("0" + recMinutes).slice(-2) + ":" + ("0" + recSeconds).slice(-2);
        }
        var videoCount = GoPro.state[ByteStates.videoCountLoByte] | (GoPro.state[ByteStates.videoCountHiByte] << 8);
        return videoCount.toString();
        
      case 1:
      case 2:
      case 3:
        var photoCount = GoPro.state[ByteStates.photoCountLoByte] | (GoPro.state[ByteStates.photoCountHiByte] << 8);
        return photoCount.toString();
        
      case 7:
        return "SETUP";
    }
    return "";
  },
  remainText: function() {
    switch(GoPro.state[ByteStates.mode]) {
      case 0:
        var videoTimeLeft  = GoPro.state[ByteStates.videoTimeRemainingLoByte] | (GoPro.state[ByteStates.videoTimeRemainingHiByte] << 8);
        return minutes2str(videoTimeLeft);
        
      case 1:
      case 2:
      case 3:
        var photoAvailable = GoPro.state[ByteStates.photosAvailableLoByte] | (GoPro.state[ByteStates.photosAvailableHiByte] << 8);
        return photoAvailable.toString();
    }
    return "";
  },
	getCurrentState: function() {
		this.command('camera','se');
	},
  select: function() {
    if (GoPro.state[ByteStates.recording])
      this.command('camera','SH', '00');
    else
      this.command('camera','SH', '01');
  },
	power: function(power) {
		/*
		00 Turn GoPro OFF
		01 Turn GoPro ON
		*/
		this.command('camera','PW', power);
	},
	setMode: function(mode) {
		/*
		00 Video Mode
		01 Photo Mode
		02 Burst Mode
		03 Timelapse Mode
		04 Timer Mode (hero2)
		05 Play HDMI
		*/
		this.command('camera','CM', mode);
	},
	setOrientation: function(orientation) {
		this.command('camera','UP', orientation);
	}
};

// GoPro <--
/* ---------------------------------------- */
GoPro.onTimeout = function() {
  Pebble.sendAppMessage( 
      {
        "status": 0, 
        "message": "state",
        "mode": GoPro.state[ByteStates.mode],
        "current": GoPro.currentText(),
        "remain": GoPro.remainText(),
        "battery": GoPro.state[ByteStates.battery],
        "recording": GoPro.state[ByteStates.recording]
      }, messageSuccessHandler, messageFailureHandler);
},
GoPro.onStateUpdate = function() {
  var currentState = "";
  for(var i = 0; i<GoPro.state.length; i++) {
    currentState += GoPro.state[i].toString();
  }

  if (GoPro.lastState != currentState) {
    GoPro.lastState = currentState;
    Pebble.sendAppMessage( 
      {
        "status": 1, 
        "message": "state",
        "mode": GoPro.state[ByteStates.mode],
        "current": GoPro.currentText(),
        "remain": GoPro.remainText(),
        "battery": GoPro.state[ByteStates.battery],
        "recording": GoPro.state[ByteStates.recording]
      }, messageSuccessHandler, messageFailureHandler);
  }
};

// Called when the message send attempt succeeds
function messageSuccessHandler() {
  //console.log("Message send succeeded.");
}

// Called when the message send attempt fails
function messageFailureHandler() {
  //console.log("Message send failed.");
}

// Called when incoming message from the Pebble is received
// We are currently only checking the "message" appKey defined in appinfo.json/Settings
Pebble.addEventListener("appmessage", function(e) {
  switch (e.payload.message) {
    case "SELECT":
      GoPro.select();
      break;
      
    case "DOWN":
      var prevMode = GoPro.state[ByteStates.mode] - 1;
      if (prevMode <= -1 || prevMode >= 4)
        prevMode = 3;
      
      GoPro.setMode(("0" + prevMode).slice(-2));
      break;
      
    case "UP":
      var nextMode = GoPro.state[ByteStates.mode] + 1;
      if (nextMode >= 4)
        nextMode = 0;
      
      GoPro.setMode(("0" + nextMode).slice(-2));
      break;
  }
  if (GoPro.timer) {
    clearTimeout(GoPro.timer);
    GoPro.getCurrentState();
  }
});

// Called when JS is ready
Pebble.addEventListener("ready", function(e) {
  GoPro.getCurrentState();
});