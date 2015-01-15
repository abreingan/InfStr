self.on("click", function (node, data) {
	var NdeLst = [];
	var sch = "*LAST";
	var schsub = " ";
	var fldsel = "";
	if (data == "*YER") {
		if (( node.tagName.toLowerCase() == "select" ) && (node.options[1].value.length > 2 )) {
				fldsel = "ExpDte;Y4";
		} else {
				fldsel = "ExpDte;Y";
			}
	} else if (data == "*MTH") {
		if (( node.tagName.toLowerCase() == "select" ) && (node.options[1].value.length > 2 )) {
				fldsel = "ExpDte;M3";
		} else {
				fldsel = "ExpDte;M";
			}
	} else if (data == "*VFY") {
		fldsel = "CrdVrf";
	} else if (data == "*CRDHLDNME") {
		fldsel = "CrdHldNme";
	} else {
		sch = data;
		schsub = "*CurUsr";
		fldsel = "CrdNbr";
	}
	NdeLst.push([node.id, node.name, sch, schsub, fldsel]);
	if (data.substring(0,1) != '*') {
	var elmlst = document.querySelectorAll("input[type=text], input[type=email], input[type=password]");
	for (var i = 0, elm; elm = elmlst[i++];) {
		var ws = elm.id.toLowerCase() + ' ' + elm.name.toLowerCase();
		if ((ws.indexOf('ccv') > -1 ) || ((ws.indexOf('verif') > -1 ) && ((ws.indexOf('card') > -1 ) || (ws.indexOf('credit') > -1 )))) {
			NdeLst.push([elm.id, elm.name, "*LAST", "", "CrdVrf"]);
		} else if (((ws.indexOf('name') > -1 ) && ((ws.indexOf('card') > -1 ) || (ws.indexOf('holder') > -1 )))) {
			NdeLst.push([elm.id, elm.name, "*LAST", "", "CrdHldNme"]);
		} 
	}
	var elmlst = document.querySelectorAll("select");
	for (var i = 0, elm; elm = elmlst[i++];) {
		var ws = elm.id.toLowerCase() + ' ' + elm.name.toLowerCase();
		if ((ws.indexOf('exp') > -1 ) && ((ws.indexOf('month') > -1 ) || (ws.indexOf('mm') > -1 ) || (ws.indexOf('mth') > -1 ))) {
			if (( node.tagName.toLowerCase() == "select" ) && (node.options[1].value.length > 2 )) {
				NdeLst.push([elm.id, elm.name, "*LAST", "", "ExpDte;M3"]);
			} else {
				NdeLst.push([elm.id, elm.name, "*LAST", "", "ExpDte;M"]);
			}
		}
		else if ((ws.indexOf('exp') > -1 ) && ((ws.indexOf('year') > -1 ) || (ws.indexOf('yy') > -1 ) )) {
			if (( node.tagName.toLowerCase() == "select" ) && (node.options[1].value.length > 2 )) {
					NdeLst.push([elm.id, elm.name, "*LAST", "", "ExpDte;Y4"]);
			} else {
					NdeLst.push([elm.id, elm.name, "*LAST", "", "ExpDte;Y"]);
			}
			}
	}
	}
	self.postMessage(NdeLst);
});

