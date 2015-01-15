self.port.on("getElements", function(tag) {
var result = "";
var elmlst = document.querySelectorAll("input[type=text], input[type=email], input[type=password], select");
for (var i = 0, elm; elm = elmlst[i++];) {
	var val = elm.value;
	var name = elm.name;
	var form = elm.form;
	var id = elm.id;
	if ((val.length > 0) && (elm.type != "hidden") && (name.length + id.length > 0) && (elm.offsetWidth > 0 || elm.offsetHeight > 0)) {
		result = result + "<fld><id>" + id + "</id><nme>" + name + "</nme><frm>" + form + "</frm><val>" + val + "</val></fld>";
	}
}
 var result = result + " ";
self.port.emit("gotElements", result);
});