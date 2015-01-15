const {Cc,Ci,Cu} = require("chrome");
Cu.import('resource://gre/modules/Services.jsm');
var recentWin = Services.wm.getMostRecentWindow('navigator:browser');
if (recentWin) {
	var PUI = recentWin.document.getElementById('PanelUI');
	if (PUI) {
	PUI.addEventListener('popupshowing', function() {console.log("A Popup was activated.");} , false);
	} else {
		Services.prompt.alert(null, 'error', 'No PanelUI'); 
	}
} else {
	Services.prompt.alert(null, 'error', 'no browser window');
}
var self = require("sdk/self");
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

// var windows = require("sdk/windows").browserWindows;
/*
 var winu = require('sdk/window/utils');
 var CWin = winu.getMostRecentBrowserWindow();

 CWin.addEventListener("DOMWillOpenModalDialog", function() {CWin.setTimeout(NfyBox, 500);}, true);
function NfyBox() {
	worker = tabs.activeTab.attach({
		contentScriptFile: self.data.url("notifybox.js")
	});
	worker.port.emit("notify");
}

var events = require("sdk/system/events");
function listener(event) {
	console.log("An event popup was activated.");
var PUI = Services.wm.getMostRecentWindow('navigator:browser').document.querySelector('#Pa‌​nelUI-popup');
console.log(PUI);
	}
events.on("xul-window-visible", listener);
*/
var { Hotkey } = require("sdk/hotkeys");
res = Cu.import('resource://gre/modules/ctypes.jsm');
intt = res.ctypes.int32_t;
strt = res.ctypes.jschar.ptr;
var lib = res.ctypes.open("D:\\Documents\\RAD Studio\\Projects\\infstrdll\\infstrdll.dll");
var getVar = lib.declare("GetBrwInf", res.ctypes.winapi_abi, ctypes.jschar.ptr, ctypes.jschar.ptr, ctypes.int32_t, ctypes.jschar.ptr, ctypes.jschar.ptr, ctypes.jschar.ptr);
var cm = require("sdk/context-menu");
try {
var ret = getVar("LSTTYP",0, "Credit Card", "*CurUsr", "InfNme");
var retstr = ret.readString();
var mic = JSON.parse(retstr);
} catch(err) {
  DspErr("Error finding Credit Cards");
} 
mi = [];
for (i = 0; i < mic.length; i++) {
mi.push(cm.Item({label: mic[i], data: mic[i]}));
}
// mi[0] = cm.Item({  label: MnuItm[0], data: MnuItm[0] });
mi.push(cm.Item({label: "Expiry Month", data: "*MTH" }));
mi.push(cm.Item({label: "Expiry Year", data: "*YER" }));
mi.push(cm.Item({label: "Validation No", data: "*VFY" }));
mi.push(cm.Item({label: "Name on Card", data: "*CRDHLDNME" }));
var cmi = cm.Menu({
  label: "Insert Card Info",
  context: cm.SelectorContext("input[type=text], select"),
  contentScriptFile: self.data.url("menuclick.js"),
  items: mi,
  onMessage: function(NdeLst) {
		worker = tabs.activeTab.attach({
		  contentScriptFile: self.data.url("setvalue.js")
		});
		for (i = 0; i < NdeLst.length; i++) {
			var NdeInf = NdeLst[i];
			var ret = getVar("INFNME",0, NdeInf[2], NdeInf[3], NdeInf[4]);
			var retstr = ret.readString();
			worker.port.emit("setValue", NdeInf[0], NdeInf[1], retstr);
		}
	}
});

var storeBtn = buttons.ActionButton({
  id: "storevar",
  label: "Store Variables",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: storeClick
});
var fillBtn = buttons.ActionButton({
  id: "fillvar",
  label: "Fill Variables",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: fillClick
});
var storeHotKey = Hotkey({
  combo: "accel-shift-o",
  onPress: function() {
    storeClick();
  }
});
function storeClick(state) {
    worker = tabs.activeTab.attach({
      contentScriptFile: self.data.url("getinput.js")
    });
	worker.port.emit("getElements", "input");
	worker.port.on("gotElements", function(elementContent) {
		if (elementContent.trim().length == 0) {
			DspErr("No input fields contain information");
		} else {
			var ttl = tabs.activeTab.title;
			var url = tabs.activeTab.url;
			var args = ["BRWNEWITM", "0", "<url>" + url + "</url><elm>" + elementContent + "</elm>", ttl];
			var file = Cc["@mozilla.org/file/local;1"]
							 .createInstance(Ci.nsILocalFile);
	//		file.initWithPath("C:\\Scripts\\InfStr.exe");
			file.initWithPath("D:\\Documents\\RAD Studio\\Projects\\InfStr\\InfStr.exe");
			var process = Cc["@mozilla.org/process/util;1"]
									.createInstance(Ci.nsIProcess);
			process.init(file);
			// Run the InfStr exe (first param blocks the browser till it exits).
			process.run(true, args, args.length);
		}
	});
}
function fillClick(state) {
 var ttl = tabs.activeTab.title;
 var url = tabs.activeTab.url;
 var ret = getVar("WINTTL", 0, ttl, "*CurUsr", "");
 var retstr = ret.readString();
 console.log(retstr);
 var NdeLst = JSON.parse(retstr);
 worker = tabs.activeTab.attach({
   contentScriptFile: self.data.url("setvalue.js")
 });
 for (i = 0; i < NdeLst.length; i++) {
	var NdeInf = NdeLst[i];
	worker.port.emit("setValue", NdeInf[0], NdeInf[1], NdeInf[2]);
 }
}

function DspErr(txt) {
	worker = tabs.activeTab.attach({
		contentScriptFile: self.data.url("showalert.js")
	});
	worker.port.emit("showAlert", txt);
}

// var xx = Cu.import("resource://gre/modules/ctypes.jsm");
// var ct = Cu.import("resource://gre/modules/ctypes.jsm");
/* Load InfStrdll dll */
// var lib = xx.ctypes.open("C:\\Scripts\\InfStrDll.dll");
// const DWORD = ctypes.uint32_t; //DWORD is uint32
//    lib.close();
/* Declare the signature of the function we are going to call */
// var getVar = lib.declare("GetWinInf", std1, strt, intt, strt, strt, strt);
// http://forums.mozillazine.org/viewtopic.php?f=19&t=2282303
// https://forums.mozilla.org/addons/viewtopic.php?f=7&t=3653

/*
//alert(ret); 
    var lib = res.ctypes.open("user32.dll");
    var msgBox = lib.declare("MessageBoxW", // name        
      ctypes.winapi_abi,                    // abi         
      ctypes.int32_t,                       // return type 
      ctypes.int32_t,                       // arg  1 type 
      ctypes.jschar.ptr,                    // arg  2 type 
      ctypes.jschar.ptr,                    // arg  3 type 
      ctypes.int32_t);                      // arg  4 type 
    const MB_YESNOCANCEL = 3;
    var ret = msgBox(0, "description", "title", MB_YESNOCANCEL);
	alert(ret);
    lib.close();
    if (ret == 6) alert("Yes");
    if (ret == 7) alert("No");
    if (ret == 2) alert("Cancel");
*/	
