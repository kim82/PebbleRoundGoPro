function minutes2str(minutes) {
	var h = Math.floor(minutes / 60);          
	var m = minutes % 60;
	return h + "H" + ("0" + m).slice(-2);
}
var ajax = function() {
  var formify = function(data) {
    var params = [],
        i = 0;
    for (var name in data) {
      params[i++] = encodeURIComponent(name) + "=" + encodeURIComponent(data[name]);
    }
    return params.join("&");
  };
  var deformify = function(form) {
    var params = {};
    form.replace(/(?:([^=&]*)=?([^&]*)?)(?:&|$)/g, function(_, name, value) {
      if (name) {
        params[name] = value || true;
      }
      return _;
    });
    return params;
  };
  var req_timeout = 6e3;
  var ajax = function(opt, success, failure, timeout) {
    if (typeof opt === "string") {
      opt = {
        url: opt
      };
    }
    var method = opt.method || "GET";
    var url = opt.url;
    console.log(url);
    var onHandler = ajax.onHandler;
    if (onHandler) {
      if (success) {
        success = onHandler("success", success);
      }
      if (failure) {
        failure = onHandler("failure", failure);
      }
    }
    var appendSymbol;
    if (opt.cache === false) {
      appendSymbol = url.indexOf("?") === -1 ? "?" : "&";
      url += appendSymbol + "_=" + (new Date()).getTime();
    }
    var req = new XMLHttpRequest();
    req.open(method.toUpperCase(), url, opt.async !== false);
    req.responseType = opt.responseType || "text";

    var headers = opt.headers;
    if (headers) {
      for (var name in headers) {
        req.setRequestHeader(name, headers[name]);
      }
    }
    var data = opt.data;
    if (data) {
      if (method === "GET") {
        appendSymbol = url.indexOf("?") === -1 ? "?" : "&";
        url += appendSymbol + formify(opt.data);
      } else if (opt.type === "json") {
        req.setRequestHeader("Content-Type", "application/json");
        data = JSON.stringify(opt.data);
      } else if (opt.type !== "text") {
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        data = formify(opt.data);
      }
    }
    req.onreadystatechange = function(e) {
      if (req.readyState === 4) {
        clearTimeout(xhrTimeout);
        var okay = req.status >= 200 && req.status < 300 || req.status === 304;
        var callback = okay ? success : failure;
        if (callback) {
          callback(req);
        }
      }
    };

    req.send(data);
    var xhrTimeout = setTimeout(function() {
      req.abort();
      if (timeout) timeout();
        }, req_timeout);
    };
  ajax.formify = formify;
  ajax.deformify = deformify;
  if (typeof module !== "undefined") {
    module.exports = ajax;
  } else {
    window.ajax = ajax;
  }
  return ajax;
}();
// GoPro -->
var UPDATE_FREQUENCY  = 2000;
var SETTINGS = {
    SETTING_MAIN: 0,
    SETTING_VIDEOSETTINGS: 1,
    SETTING_PHOTOSETTINGS: 2,
    SETTING_BURSTSETTINGS: 3,
    SETTING_OTHERSETTINGS: 4,
    SETTING_MODE: 5,
    MODE_VIDEO: 0,
    MODE_PHOTO: 1,
    MODE_BURST: 2,
    MODE_TIMELAPSE: 3,
    SETTING_XMODE: 6,
    SETTING_VIDEOSUBMODE: 7,
    VIDEOSUBMODE_VIDEO: 0,
    VIDEOSUBMODE_VIDEO_TIMELAPSE: 1,
    VIDEOSUBMODE_VIDEO_plus_PHOTO: 2,
    VIDEOSUBMODE_LOOPING: 3,
    SETTING_PHOTOSUBMODE: 8,
    PHOTOSUBMODE_SINGLE: 0,
    PHOTOSUBMODE_CONTINUOUS: 1,
    PHOTOSUBMODE_NIGHT: 2,
    SETTING_BURSTSUBMODE: 9,
    BURSTSUBMODE_BURST: 0,
    BURSTSUBMODE_TIMELAPSE: 1,
    BURSTSUBMODE_NIGHTLAPSE: 2,
    SETTING_VIDEORES: 10,
    VIDEORES_4K_SUPERVIEW: 0,
    VIDEORES_2_7K_SUPERVIEW: 1,
    VIDEORES_4K: 2,
    VIDEORES_2_7K: 3,
    VIDEORES_2_7K_4_3: 4,
    VIDEORES_1440: 5,
    VIDEORES_1080_SUPERVIEW: 6,
    VIDEORES_1080: 7,
    VIDEORES_960: 8,
    VIDEORES_720_SUPERVIEW: 9,
    VIDEORES_720: 10,
    VIDEORES_WVGA: 11,
    SETTING_PHOTORES: 11,
    PHOTORES_11_MP_WIDE: 0,
    PHOTORES_8_MP_MED: 1,
    PHOTORES_5_MP_WIDE: 2,
    PHOTORES_5_MP_MED: 3,
    PHOTORES_7_MP_WIDE: 4,
    PHOTORES_12_MP_WIDE: 5,
    PHOTORES_7_MP_MED: 6,
    PHOTORES_10_MP_WIDE: 8,
    SETTING_BURSTRES: 12,
    BURSTRES_11_MP_WIDE: 0,
    BURSTRES_8_MP_MED: 1,
    BURSTRES_5_MP_WIDE: 2,
    BURSTRES_5_MP_MED: 3,
    BURSTRES_7_MP_WIDE: 4,
    BURSTRES_12_MP_WIDE: 5,
    BURSTRES_7_MP_MED: 6,
    SETTING_VIDEOMODE_GP2: 13,
    VIDEOMODE_GP2_1080_30: 0,
    VIDEOMODE_GP2_960_60: 1,
    VIDEOMODE_GP2_960_30: 2,
    VIDEOMODE_GP2_720_60: 3,
    VIDEOMODE_GP2_720_30: 4,
    VIDEOMODE_GP2_WVGA_120: 5,
    VIDEOMODE_GP2_WVGA_60: 6,
    SETTING_FPS: 14,
    FPS_12_FPS: 0,
    FPS_15_FPS: 1,
    FPS_24_FPS: 2,
    FPS_25_FPS: 3,
    FPS_30_FPS: 4,
    FPS_48_FPS: 5,
    FPS_50_FPS: 6,
    FPS_60_FPS: 7,
    FPS_80_FPS: 8,
    FPS_90_FPS: 9,
    FPS_100_FPS: 10,
    FPS_120_FPS: 11,
    FPS_240_FPS: 12,
    SETTING_FOV: 15,
    FOV_WIDE: 0,
    FOV_MEDIUM: 1,
    FOV_NARROW: 2,
    SETTING_PHOTOCONTINUOUSRATE: 16,
    PHOTOCONTINUOUSRATE_SINGLE: 0,
    PHOTOCONTINUOUSRATE_3_FPS: 1,
    PHOTOCONTINUOUSRATE_5_FPS: 2,
    PHOTOCONTINUOUSRATE_10_FPS: 3,
    SETTING_PHOTOSHUTTER: 17,
    PHOTOSHUTTER_AUTO: 0,
    PHOTOSHUTTER_2_SEC: 1,
    PHOTOSHUTTER_5_SEC: 2,
    PHOTOSHUTTER_10_SEC: 3,
    PHOTOSHUTTER_15_SEC: 4,
    PHOTOSHUTTER_20_SEC: 5,
    PHOTOSHUTTER_30_SEC: 6,
    SETTING_BURSTRATE: 18,
    BURSTRATE_3_1_SEC: 0,
    BURSTRATE_5_1_SEC: 1,
    BURSTRATE_10_1_SEC: 2,
    BURSTRATE_10_2_SEC: 3,
    BURSTRATE_10_3_SEC: 4,
    BURSTRATE_30_1_SEC: 5,
    BURSTRATE_30_2_SEC: 6,
    BURSTRATE_30_3_SEC: 7,
    BURSTRATE_30_6_SEC: 8,
    SETTING_BURSTTIMELAPSE: 19,
    BURSTTIMELAPSE_1_PHOTO___0_5_SEC: 0,
    BURSTTIMELAPSE_1_PHOTO___1_SEC: 1,
    BURSTTIMELAPSE_1_PHOTO___2_SEC: 2,
    BURSTTIMELAPSE_1_PHOTO___5_SEC: 3,
    BURSTTIMELAPSE_1_PHOTO___10_SEC: 4,
    BURSTTIMELAPSE_1_PHOTO___30_SEC: 5,
    BURSTTIMELAPSE_1_PHOTO___60_SEC: 6,
    SETTING_BURSTSHUTTER: 20,
    BURSTSHUTTER_AUTO: 0,
    BURSTSHUTTER_2_SEC: 1,
    BURSTSHUTTER_5_SEC: 2,
    BURSTSHUTTER_10_SEC: 3,
    BURSTSHUTTER_15_SEC: 4,
    BURSTSHUTTER_20_SEC: 5,
    BURSTSHUTTER_30_SEC: 6,
    SETTING_BURSTINTERVAL: 21,
    BURSTINTERVAL_CONTINUOUS: 0,
    BURSTINTERVAL_4_SEC: 1,
    BURSTINTERVAL_5_SEC: 2,
    BURSTINTERVAL_10_SEC: 3,
    BURSTINTERVAL_15_SEC: 4,
    BURSTINTERVAL_20_SEC: 5,
    BURSTINTERVAL_30_SEC: 6,
    BURSTINTERVAL_1_MIN: 7,
    BURSTINTERVAL_2_MIN: 8,
    BURSTINTERVAL_5_MIN: 9,
    BURSTINTERVAL_30_MIN: 10,
    BURSTINTERVAL_60_MIN: 11,
    SETTING_SPOTMETER: 22,
    SPOTMETER_ON: 0,
    SPOTMETER_OFF: 1,
    SETTING_VIDEOPHOTOINTERVAL: 23,
    VIDEOPHOTOINTERVAL_OFF: 0,
    VIDEOPHOTOINTERVAL_1___5S: 1,
    VIDEOPHOTOINTERVAL_1___10S: 2,
    VIDEOPHOTOINTERVAL_1___30S: 3,
    VIDEOPHOTOINTERVAL_1___60S: 4,
    SETTING_LOOPVIDEO: 24,
    LOOPVIDEO_OFF: 0,
    LOOPVIDEO_5_MIN: 1,
    LOOPVIDEO_20_MIN: 2,
    LOOPVIDEO_60_MIN: 3,
    LOOPVIDEO_120_MIN: 4,
    LOOPVIDEO_MAX: 5,
    SETTING_PROTUNE: 25,
    PROTUNE_ON: 0,
    PROTUNE_OFF: 1,
    SETTING_WHITEBALANCE: 26,
    WHITEBALANCE_AUTO: 0,
    WHITEBALANCE_3000K: 1,
    WHITEBALANCE_5500K: 2,
    WHITEBALANCE_6500K: 3,
    WHITEBALANCE_CAM_RAW: 4,
    SETTING_COLOR: 27,
    COLOR_GOPRO_COLOR: 0,
    COLOR_FLAT: 1,
    SETTING_ISO: 28,
    ISO_6400: 0,
    ISO_1600: 1,
    ISO_400: 2,
    SETTING_SHARPNESS: 29,
    SHARPNESS_HIGH: 0,
    SHARPNESS_MEDIUM: 1,
    SHARPNESS_LOW: 2,
    SETTING_EXPOSURE: 30,
    EXPOSURE__2_0: 0,
    EXPOSURE__1_5: 1,
    EXPOSURE__1_0: 2,
    EXPOSURE__0_5: 3,
    EXPOSURE_0: 4,
    EXPOSURE__plus_0_5: 5,
    EXPOSURE__plus_1_0: 6,
    EXPOSURE__plus_1_5: 7,
    EXPOSURE__plus_2_0: 8,
    SETTING_SPOTMETERVIDEO: 31,
    SPOTMETERVIDEO_ON: 0,
    SPOTMETERVIDEO_OFF: 1,
    SETTING_PROTUNEVIDEO: 32,
    PROTUNEVIDEO_ON: 0,
    PROTUNEVIDEO_OFF: 1,
    SETTING_WHITEBALANCEVIDEO: 33,
    WHITEBALANCEVIDEO_AUTO: 0,
    WHITEBALANCEVIDEO_3000K: 1,
    WHITEBALANCEVIDEO_5500K: 2,
    WHITEBALANCEVIDEO_6500K: 3,
    WHITEBALANCEVIDEO_CAM_RAW: 4,
    SETTING_COLORVIDEO: 34,
    COLORVIDEO_GOPRO_COLOR: 0,
    COLORVIDEO_FLAT: 1,
    SETTING_ISOVIDEO: 35,
    ISOVIDEO_6400: 0,
    ISOVIDEO_1600: 1,
    ISOVIDEO_400: 2,
    SETTING_SHARPNESSVIDEO: 36,
    SHARPNESSVIDEO_HIGH: 0,
    SHARPNESSVIDEO_MEDIUM: 1,
    SHARPNESSVIDEO_LOW: 2,
    SETTING_EXPOSUREVIDEO: 37,
    EXPOSUREVIDEO__2_0: 0,
    EXPOSUREVIDEO__1_5: 1,
    EXPOSUREVIDEO__1_0: 2,
    EXPOSUREVIDEO__0_5: 3,
    EXPOSUREVIDEO_0: 4,
    EXPOSUREVIDEO__plus_0_5: 5,
    EXPOSUREVIDEO__plus_1_0: 6,
    EXPOSUREVIDEO__plus_1_5: 7,
    EXPOSUREVIDEO__plus_2_0: 8,
    SETTING_SPOTMETERPHOTO: 38,
    SPOTMETERPHOTO_ON: 0,
    SPOTMETERPHOTO_OFF: 1,
    SETTING_PROTUNEPHOTO: 39,
    PROTUNEPHOTO_ON: 0,
    PROTUNEPHOTO_OFF: 1,
    SETTING_WHITEBALANCEPHOTO: 40,
    WHITEBALANCEPHOTO_AUTO: 0,
    WHITEBALANCEPHOTO_3000K: 1,
    WHITEBALANCEPHOTO_5500K: 2,
    WHITEBALANCEPHOTO_6500K: 3,
    WHITEBALANCEPHOTO_CAM_RAW: 4,
    SETTING_COLORPHOTO: 41,
    COLORPHOTO_GOPRO_COLOR: 0,
    COLORPHOTO_FLAT: 1,
    SETTING_ISOPHOTO: 42,
    ISOPHOTO_6400: 0,
    ISOPHOTO_1600: 1,
    ISOPHOTO_400: 2,
    SETTING_SHARPNESSPHOTO: 43,
    SHARPNESSPHOTO_HIGH: 0,
    SHARPNESSPHOTO_MEDIUM: 1,
    SHARPNESSPHOTO_LOW: 2,
    SETTING_EXPOSUREPHOTO: 44,
    EXPOSUREPHOTO__2_0: 0,
    EXPOSUREPHOTO__1_5: 1,
    EXPOSUREPHOTO__1_0: 2,
    EXPOSUREPHOTO__0_5: 3,
    EXPOSUREPHOTO_0: 4,
    EXPOSUREPHOTO__plus_0_5: 5,
    EXPOSUREPHOTO__plus_1_0: 6,
    EXPOSUREPHOTO__plus_1_5: 7,
    EXPOSUREPHOTO__plus_2_0: 8,
    SETTING_SPOTMETERBURST: 45,
    SPOTMETERBURST_ON: 0,
    SPOTMETERBURST_OFF: 1,
    SETTING_PROTUNEBURST: 46,
    PROTUNEBURST_ON: 0,
    PROTUNEBURST_OFF: 1,
    SETTING_WHITEBALANCEBURST: 47,
    WHITEBALANCEBURST_AUTO: 0,
    WHITEBALANCEBURST_3000K: 1,
    WHITEBALANCEBURST_5500K: 2,
    WHITEBALANCEBURST_6500K: 3,
    WHITEBALANCEBURST_CAM_RAW: 4,
    SETTING_COLORBURST: 48,
    COLORBURST_GOPRO_COLOR: 0,
    COLORBURST_FLAT: 1,
    SETTING_ISOBURST: 49,
    ISOBURST_6400: 0,
    ISOBURST_1600: 1,
    ISOBURST_400: 2,
    SETTING_SHARPNESSBURST: 50,
    SHARPNESSBURST_HIGH: 0,
    SHARPNESSBURST_MEDIUM: 1,
    SHARPNESSBURST_LOW: 2,
    SETTING_EXPOSUREBURST: 51,
    EXPOSUREBURST__2_0: 0,
    EXPOSUREBURST__1_5: 1,
    EXPOSUREBURST__1_0: 2,
    EXPOSUREBURST__0_5: 3,
    EXPOSUREBURST_0: 4,
    EXPOSUREBURST__plus_0_5: 5,
    EXPOSUREBURST__plus_1_0: 6,
    EXPOSUREBURST__plus_1_5: 7,
    EXPOSUREBURST__plus_2_0: 8,
    SETTING_ORIENTATION: 52,
    ORIENTATION_UP: 0,
    ORIENTATION_DOWN: 1,
    ORIENTATION_AUTO: 2,
    SETTING_VIDEOREGION: 53,
    VIDEOREGION_NTSC: 0,
    VIDEOREGION_PAL: 1,
    SETTING_VOLUME: 54,
    VOLUME_100_: 0,
    VOLUME_70_: 1,
    VOLUME_OFF: 2,
    SETTING_LED: 55,
    LED_4: 0,
    LED_2: 1,
    LED_OFF: 2,
    SETTING_AUTOLOWLIGHT: 56,
    AUTOLOWLIGHT_ON: 0,
    AUTOLOWLIGHT_OFF: 1,
    SETTING_SHUTTER: 57,
    SHUTTER_ON: 0,
    SHUTTER_OFF: 1,
    SETTING_BATTERY: 58,
    BATTERY_EMPTY: 0,
    BATTERY_LOW: 1,
    BATTERY_HIGH: 2,
    BATTERY_FULL: 3,
    BATTERY_CHARGING: 4,
    SETTING_VIDEOTIMELAPSEINTERVAL: 59,
    VIDEOTIMELAPSEINTERVAL_0_5_SEC: 0,
    VIDEOTIMELAPSEINTERVAL_1_SEC: 1,
    VIDEOTIMELAPSEINTERVAL_2_SEC: 2,
    VIDEOTIMELAPSEINTERVAL_5_SEC: 3,
    VIDEOTIMELAPSEINTERVAL_10_SEC: 4,
    VIDEOTIMELAPSEINTERVAL_30_SEC: 5,
    VIDEOTIMELAPSEINTERVAL_60_SEC: 6,
    SETTING_END: 60
};
var GOPRO_ADDRESS = "http://10.5.5.9";
var GoProVersion = {
    UNKNOWN: 0,
    THREE_BLACK: 1,
    THREE_SILVER: 2,
    THREE_WHITE: 3,
    THREE_PLUS_BLACK: 4,
    THREE_PLUS_SILVER: 5,
    HD2: 6,
    HD4_SILVER: 7,
    HD4_BLACK: 8
};
var gopro = {
    password: null,
    version: GoProVersion.THREE_PLUS_SILVER,
    settings: [],
    menus: [],
    mode: 0,
    photo_count: 123,
    video_count: 456,
    photo_remaining: 3456,
    video_remaining: 5e3,
    video_progress: 0,
    photo_progress: 0,
    recording: 0
};

var configurationgp3 = [{
  setting: [1, SETTINGS.SETTING_MODE],
  command_name: "CM",
  states: [
    [0, SETTINGS.MODE_VIDEO],
    [1, SETTINGS.MODE_PHOTO],
    [2, SETTINGS.MODE_BURST],
    [3, SETTINGS.MODE_TIMELAPSE]
  ]
}, {
  setting: [9, SETTINGS.SETTING_VIDEOMODE_GP2],
  command_name: "VR",
  states: [
    [6, SETTINGS.VIDEOMODE_GP2_1080_30],
    [5, SETTINGS.VIDEOMODE_GP2_960_60],
    [4, SETTINGS.VIDEOMODE_GP2_960_30],
    [3, SETTINGS.VIDEOMODE_GP2_720_60],
    [2, SETTINGS.VIDEOMODE_GP2_720_30],
    [1, SETTINGS.VIDEOMODE_GP2_WVGA_120],
    [0, SETTINGS.VIDEOMODE_GP2_WVGA_60]
  ]
}, {
  setting: [50, SETTINGS.SETTING_VIDEORES],
  command_name: "VV",
  states: [
    [8, SETTINGS.VIDEORES_4K_SUPERVIEW],
    [7, SETTINGS.VIDEORES_2_7K_SUPERVIEW],
    [6, SETTINGS.VIDEORES_4K],
    [5, SETTINGS.VIDEORES_2_7K],
    [4, SETTINGS.VIDEORES_1440],
    [9, SETTINGS.VIDEORES_1080_SUPERVIEW],
    [3, SETTINGS.VIDEORES_1080],
    [2, SETTINGS.VIDEORES_960],
    [10, SETTINGS.VIDEORES_720_SUPERVIEW],
    [1, SETTINGS.VIDEORES_720],
    [0, SETTINGS.VIDEORES_WVGA]
  ]
}, {
  setting: [51, SETTINGS.SETTING_FPS],
  command_name: "FS",
  states: [
    [10, SETTINGS.FPS_240_FPS],
    [9, SETTINGS.FPS_120_FPS],
    [8, SETTINGS.FPS_100_FPS],
    [7, SETTINGS.FPS_60_FPS],
    [6, SETTINGS.FPS_50_FPS],
    [5, SETTINGS.FPS_48_FPS],
    [4, SETTINGS.FPS_30_FPS],
    [3, SETTINGS.FPS_25_FPS],
    [2, SETTINGS.FPS_24_FPS],
    [1, SETTINGS.FPS_15_FPS],
    [0, SETTINGS.FPS_12_FPS]
  ]
}, {
  setting: [7, SETTINGS.SETTING_FOV],
  command_name: "FV",
  states: [
    [0, SETTINGS.FOV_WIDE],
    [1, SETTINGS.FOV_MEDIUM],
    [2, SETTINGS.FOV_NARROW]
  ]
}, {
  setting: [37, SETTINGS.SETTING_LOOPVIDEO],
  command_name: "LO",
  states: [
    [0, SETTINGS.LOOPVIDEO_OFF],
    [1, SETTINGS.LOOPVIDEO_5_MIN],
    [2, SETTINGS.LOOPVIDEO_20_MIN],
    [3, SETTINGS.LOOPVIDEO_60_MIN],
    [4, SETTINGS.LOOPVIDEO_120_MIN],
    [5, SETTINGS.LOOPVIDEO_MAX]
  ]
}, {
  setting: [36, SETTINGS.SETTING_VIDEOPHOTOINTERVAL],
  command_name: "PN",
  states: [
    [0, SETTINGS.VIDEOPHOTOINTERVAL_OFF],
    [1, SETTINGS.VIDEOPHOTOINTERVAL_1___5S],
    [2, SETTINGS.VIDEOPHOTOINTERVAL_1___10S],
    [3, SETTINGS.VIDEOPHOTOINTERVAL_1___30S],
    [4, SETTINGS.VIDEOPHOTOINTERVAL_1___60S]
  ]
}, {
  setting: [30, SETTINGS.SETTING_AUTOLOWLIGHT],
  offset: 6,
  command_name: "LW",
  states: [
    [0, SETTINGS.AUTOLOWLIGHT_OFF],
    [1, SETTINGS.AUTOLOWLIGHT_ON]
  ]
}, {
  setting: [4, SETTINGS.SETTING_SPOTMETER],
  command_name: "EX",
  states: [
    [0, SETTINGS.SPOTMETER_OFF],
    [1, SETTINGS.SPOTMETER_ON]
  ]
}, {
  setting: [30, SETTINGS.SETTING_PROTUNE],
  offset: 1,
  command_name: "PT",
  states: [
    [0, SETTINGS.PROTUNE_OFF],
    [1, SETTINGS.PROTUNE_ON]
  ]
}, {
  setting: [34, SETTINGS.SETTING_WHITEBALANCE],
  command_name: "WB",
  states: [
    [0, SETTINGS.WHITEBALANCE_AUTO],
    [1, SETTINGS.WHITEBALANCE_3000K],
    [2, SETTINGS.WHITEBALANCE_5500K],
    [3, SETTINGS.WHITEBALANCE_6500K],
    [4, SETTINGS.WHITEBALANCE_CAM_RAW]
  ]
}, {
  setting: [30, SETTINGS.SETTING_COLOR],
  offset: 7,
  command_name: "CO",
  states: [
    [0, SETTINGS.COLOR_GOPRO_COLOR],
    [1, SETTINGS.COLOR_FLAT]
  ]
}, {
  setting: [52, SETTINGS.SETTING_ISO],
  offset: 0,
  mask: 3,
  command_name: "GA",
  states: [
    [0, SETTINGS.ISO_6400],
    [1, SETTINGS.ISO_1600],
    [2, SETTINGS.ISO_400]
  ]
}, {
  setting: [52, SETTINGS.SETTING_SHARPNESS],
  offset: 2,
  mask: 3,
  command_name: "SP",
  states: [
    [0, SETTINGS.SHARPNESS_HIGH],
    [1, SETTINGS.SHARPNESS_MEDIUM],
    [2, SETTINGS.SHARPNESS_LOW]
  ]
}, {
  setting: [53, SETTINGS.SETTING_EXPOSURE],
  command_name: "EV",
  states: [
    [6, SETTINGS.EXPOSURE_2_0],
    [7, SETTINGS.EXPOSURE_1_5],
    [8, SETTINGS.EXPOSURE_1_0],
    [9, SETTINGS.EXPOSURE_0_5],
    [10, SETTINGS.EXPOSURE_0],
    [11, SETTINGS.EXPOSURE__plus_0_5],
    [12, SETTINGS.EXPOSURE__plus_1_0],
    [13, SETTINGS.EXPOSURE__plus_1_5],
    [14, SETTINGS.EXPOSURE__plus_2_0]
  ]
}, {
  setting: [8, SETTINGS.SETTING_PHOTORES],
  command_name: "PR",
  states: [
    [0, SETTINGS.PHOTORES_11_MP_WIDE],
    [1, SETTINGS.PHOTORES_8_MP_MED],
    [2, SETTINGS.PHOTORES_5_MP_WIDE],
    [3, SETTINGS.PHOTORES_5_MP_MED],
    [4, SETTINGS.PHOTORES_7_MP_WIDE],
    [5, SETTINGS.PHOTORES_12_MP_WIDE],
    [6, SETTINGS.PHOTORES_7_MP_MED]
  ]
}, {
  setting: [33, SETTINGS.SETTING_PHOTOCONTINUOUSRATE],
  command_name: "CS",
  states: [
    [0, SETTINGS.PHOTOCONTINUOUSRATE_SINGLE],
    [3, SETTINGS.PHOTOCONTINUOUSRATE_3_FPS],
    [5, SETTINGS.PHOTOCONTINUOUSRATE_5_FPS],
    [10, SETTINGS.PHOTOCONTINUOUSRATE_10_FPS]
  ]
}, {
  setting: [32, SETTINGS.SETTING_BURSTRATE],
  command_name: "BU",
  states: [
    [0, SETTINGS.BURSTRATE_3_1_SEC],
    [1, SETTINGS.BURSTRATE_5_1_SEC],
    [2, SETTINGS.BURSTRATE_10_1_SEC],
    [3, SETTINGS.BURSTRATE_10_2_SEC],
    [4, SETTINGS.BURSTRATE_30_1_SEC],
    [5, SETTINGS.BURSTRATE_30_2_SEC],
    [6, SETTINGS.BURSTRATE_30_3_SEC]
  ]
}, {
  setting: [5, SETTINGS.SETTING_BURSTTIMELAPSE],
  command_name: "TI",
  states: [
    [0, SETTINGS.BURSTTIMELAPSE_1_PHOTO___0_5_SEC],
    [1, SETTINGS.BURSTTIMELAPSE_1_PHOTO___1_SEC],
    [2, SETTINGS.BURSTTIMELAPSE_1_PHOTO___2_SEC],
    [5, SETTINGS.BURSTTIMELAPSE_1_PHOTO___5_SEC],
    [10, SETTINGS.BURSTTIMELAPSE_1_PHOTO___10_SEC],
    [40, SETTINGS.BURSTTIMELAPSE_1_PHOTO___30_SEC],
    [60, SETTINGS.BURSTTIMELAPSE_1_PHOTO___60_SEC]
  ]
}, {
  setting: [18, SETTINGS.SETTING_ORIENTATION],
  offset: 2,
  command_name: "UP",
  states: [
    [1, SETTINGS.ORIENTATION_DOWN],
    [0, SETTINGS.ORIENTATION_UP]
  ]
}, {
  setting: [17, SETTINGS.SETTING_LED],
  command_name: "LB",
  states: [
    [0, SETTINGS.LED_OFF],
    [1, SETTINGS.LED_2],
    [2, SETTINGS.LED_4]
  ]
}, {
  setting: [16, SETTINGS.SETTING_VOLUME],
  command_name: "BS",
  states: [
    [2, SETTINGS.VOLUME_100_],
    [1, SETTINGS.VOLUME_70_],
    [0, SETTINGS.VOLUME_OFF]
  ]
}, {
  setting: [18, SETTINGS.SETTING_VIDEOREGION],
  offset: 5,
  command_name: "VM",
  states: [
    [0, SETTINGS.VIDEOREGION_NTSC],
    [1, SETTINGS.VIDEOREGION_PAL]
  ]
}];

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
  power: 0,
  
  onStateUpdate: function() {    
  },
  onTimeout: function() {
  },
  onNoPower: function() {
  },

	getPassword: function() {
		if (this.pwd === "") {
      var o = {
        url: this.ip + "bacpac/sd"
      };
      ajax(o, function(req) {
          GoPro.pwd = req.responseText.substring(2);
          //console.log("getPassword success is: " + GoPro.pwd);
      });
		}
		return this.pwd;
	},
	command: function(param1, param2, option) {
		if (this.getPassword() === "") {
      setTimeout(function() { this.command(param1, param2, option); }, 500);
      return;
    }
    
    var url = this.ip + param1 + '/' + param2 + '?t=' + this.getPassword();
		if (option) {
			url += '&p=%' + option;
		}
    ajax({ url: url });
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
  getGP3Status: function() {
    var o = {
      url: this.ip + "camera/sx?t=" + this.pwd,
      responseType: "arraybuffer"
    };
    ajax(o, function(req) {
      var normalArray = [];
      var byteArray = new Uint8Array(req.response);
      for (var i = 0; i < byteArray.length; i++) {
        normalArray[i] = byteArray[i] & 255;
      }
      GoPro.updateGP3(normalArray);  
    });
  },
  updateGP3: function(status) {
    gopro.settings[SETTINGS.SETTING_BATTERY] = status[19] & 255;
    
    console.log("gopro.settings =" + (status[19] & 255));
    console.log("gopro.recording = " + (status[29] & 255));
    console.log("gopro.video_progress = " + minutes2str((status[13] & 255) * 60 + (status[14] & 255)));
    console.log("gopro.photo_remaining = " + ((status[21] & 255) << 8) + (status[22] & 255));
    console.log("gopro.video_remaining = " + minutes2str(((status[25] & 255) << 8) + (status[26] & 255)));
    console.log("gopro.photo_count = " + ((status[23] & 255) << 8) + (status[24] & 255));
    console.log("gopro.video_count = " + ((status[27] & 255) << 8) + (status[28] & 255));
    console.log("gopro.mode = " + (status[1] & 255));
    console.log("gopro.battery = " + status[19].toString());
    
    this.updateGP3Settings(status);
    
    console.log("RES: " + gopro.settings[SETTINGS.SETTING_VIDEORES]);
    console.log("SETTING_FPS:" + gopro.settings[SETTINGS.SETTING_FPS]);
  },
  updateGP3Settings: function(status) {
    for (var i = 0; i < configurationgp3.length; i++) {
      var ext_setting = configurationgp3[i].setting[0];
      var int_setting = configurationgp3[i].setting[1];
      if (ext_setting < status.length) {
        var value = status[ext_setting];
        var states = configurationgp3[i].states;
        if (configurationgp3[i].offset) {
          var mask = configurationgp3[i].mask | 1;
          value = value >> configurationgp3[i].offset & mask;
        }
        for (var j = 0; j < states.length; j++) {
          if (states[j][0] === value) {
            gopro.settings[int_setting] = states[j][1];
            break;
          }
        }
      }
    }
  },
	getCurrentState: function() {
    if (this.getPassword() === "") {
      setTimeout(function(){ GoPro.getCurrentState(); }, 500);
      return;
    }
    
    var o = {
      url: this.ip + 'camera/se?t=' + this.getPassword(),
      responseType: "arraybuffer"
    };
    ajax(o, 
      function(req) {  //succes
        var uInt8Array = new Uint8Array(req.response); // Note:not xhr.responseText
        GoPro.state = uInt8Array;
        GoPro.onStateUpdate();
        GoPro.timer = setTimeout(function(){GoPro.getCurrentState();}, (GoPro.recording == 1 ? 500 : 2000));
      },
      function(req) {  //failure
        GoPro.onNoPower();
        GoPro.timer = setTimeout(function(){GoPro.getCurrentState();}, 2000);
      },
      function(req) {  //timeout
        GoPro.timer = setTimeout(function(){GoPro.getCurrentState();}, 500);
      });
    //this.getGP3Status();
		//this.command('camera','se');
	},
  select: function() {
    if (GoPro.state[ByteStates.recording])
      this.command('camera','SH', '00');
    else
      this.command('camera','SH', '01');
  },
	turnOn: function() {
		this.command('bacpac','PW', '01');
	},
  turnOff: function() {
    this.command('bacpac','PW', '00');
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
GoPro.onNoPower = function() {
  GoPro.power = 0;
  Pebble.sendAppMessage( 
    {
      "status": 0, 
      "message": "noPower",
      "mode": GoPro.state[ByteStates.mode],
      "current": GoPro.currentText(),
      "remain": GoPro.remainText(),
      "battery": GoPro.state[ByteStates.battery],
      "recording": GoPro.state[ByteStates.recording],
      "power": GoPro.power
    }, messageSuccessHandler, messageFailureHandler);
}
GoPro.onTimeout = function() {
  GoPro.power = -1;
  Pebble.sendAppMessage( 
    {
      "status": 0, 
      "message": "timeout",
      "mode": GoPro.state[ByteStates.mode],
      "current": GoPro.currentText(),
      "remain": GoPro.remainText(),
      "battery": GoPro.state[ByteStates.battery],
      "recording": GoPro.state[ByteStates.recording],
      "power": GoPro.power
    }, messageSuccessHandler, messageFailureHandler);
},
GoPro.onStateUpdate = function() {
  GoPro.power = 1;
  var currentState = "";
  for(var i = 0; i<GoPro.state.length; i++) {
    currentState += GoPro.state[i].toString();
  }

  if (GoPro.lastState != currentState) {
    console.log("send state");
    GoPro.lastState = currentState;
    Pebble.sendAppMessage( 
      {
        "status": 1, 
        "message": "ok",
        "mode": GoPro.state[ByteStates.mode],
        "current": GoPro.currentText(),
        "remain": GoPro.remainText(),
        "battery": GoPro.state[ByteStates.battery],
        "recording": GoPro.state[ByteStates.recording],
        "power": GoPro.power,
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
    case "SELECT_LOAD":
      if (GoPro.power === 0)
        GoPro.turnOn();
      break;
   
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