self.port.on("setValue", function(nodeid, nodename, retstr) {
var node = document.getElementById(nodeid);
// if (retstr.substring(0,3) == "KEY") {retstr = retstr.substring(3)}
console.log(retstr);
node.value = retstr;
});