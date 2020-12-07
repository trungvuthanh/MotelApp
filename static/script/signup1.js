function createImage(base64) {
    return '<div class = "frame-image"><div class="close" onclick="removeImage(this)">&times;</div><img src="'+ base64 +'"></div>';
}

function previewFile(input) {
    const [file] = input.files 
    const reader = new FileReader()
    reader.onloadend = function() {
        document.getElementById("preview").innerHTML += createImage(reader.result);
        checkCountFileImage()
    } 
    reader.readAsDataURL(file)    
}
function onSelect(e) {
    if (e.files.length > 1) {
        alert("Only 1 files accepted.");
        e.preventDefault();
    }
}

function checkCountFileImage() {
    var numFile = document.getElementsByClassName("frame-image").length;
    if (numFile > 1) {
        document.getElementById("btnHinhAnh").className = "form-control-file is-invalid"
    } else {
        document.getElementById("btnHinhAnh").className = "form-control-file is-valid"
    }
}

document.getElementById("repassword").onkeyup = function() {
	if (document.getElementById("password").value != document.getElementById("repassword").value ) {
        document.getElementById("loi_repass").innerHTML = "Mật khẩu không khớp";
        document.getElementById("repassword").className = "form-control is-invalid"
	}
	else {
        document.getElementById("loi_repass").innerHTML = "";
        document.getElementById("repassword").className = "form-control is-valid"
	}
}
document.getElementById("password").onkeyup = function() {
	if (document.getElementById("password").value != document.getElementById("repassword").value && document.getElementById("repassword") != "" ) {
		document.getElementById("loi_repass").innerHTML = "Mật khẩu không khớp";
	}
	else if (document.getElementById("password").value == document.getElementById("repassword").value) {
        document.getElementById("loi_repass").innerHTML = "";
        document.getElementById("repassword").className = "form-control is-valid"
	}
}
document.getElementById("typeacc").onchange  = function() {
    if (this.value == "renter") {
        document.querySelector("#inputCMND").innerHTML = '<input type="text" class="form-control" id="id" pattern="[0-9]{9,12}" placeholder="123456789" >'
        document.querySelector("#inputFileCMND").innerHTML = '<input type="file" class="form-control-file" multiple = "multiple" accept="image/*" onchange = "previewFile(this);"  id="btnHinhAnh">'
    } else {
        document.querySelector("#inputCMND").innerHTML = '<input type="text" class="form-control" id="id" pattern="[0-9]{9,12}" placeholder="123456789" required>'
        document.querySelector("#inputFileCMND").innerHTML = '<input type="file" class="form-control-file" multiple = "multiple" accept="image/*" required onchange = "previewFile(this);"  id="btnHinhAnh">'
    } 
}


var avatars = document.querySelectorAll(".ava img"); 
var active = avatars[0];
// var listImageUltities = document.querySelectorAll("div.tienich img");
for (var i = 0; i < avatars.length; i++) {
    avatars[i].onclick = function() {
        $(active).removeClass("active-image");
        $(this).addClass("active-image");
        active = this;
        // if ($(this).hasClass("active-image")) {
        //     $(this).removeClass("active-image");
        // } else {
            
        // }
    }
}

var validation

'use strict';
window.addEventListener('load', function() {
    var forms = document.getElementsByClassName('needs-validation');
    validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            checkCountFileImage()
            if (document.getElementById("password").value  != document.getElementById("repassword").value ) {
                document.getElementById("loi_repass").innerHTML = "Mật khẩu không khớp";
                document.getElementById("password").focus();
                event.stopPropagation();
            }
            if (form.checkValidity() === false ) {
                
                event.preventDefault();
                event.stopPropagation();
            } else {
                
                alert("ok")
                
            }
            form.classList.add('was-validated');
        }, false);
    });
}, false);

function removeImage(elmt) {
    elmt.parentNode.remove();
}

// function hienThiThemThongTin(elmt) {
//     icon = elmt.childNodes[1]
//     if (icon.className == 'fa fa-caret-down') {
//         icon.className = 'fa fa-caret-down open'
//     } else {
//         icon.className = 'fa fa-caret-down'
//     }
    
//     elmt = document.getElementById("huongDan");
//     $(elmt).slideToggle();
// }

// function convertToHTML(string) {
//     bold = 0
//     while (string.match(/\*\*/g)!=null) {
//         if (bold == 0) {
//             string = string.replace(/\*\*/i, "<b>")
//             bold = 1
//         } else {
//             string = string.replace(/\*\*/i, "</b>")
//             bold = 0
//         }
//     }
//     italic = 0
//     while (string.match(/\/\//g)!=null) {
//         if (italic == 0) {
//             string = string.replace(/\/\//i, "<i>")
//             italic = 1
//         } else {
//             string = string.replace(/\/\//i, "</i>")
//             italic = 0
//         }
//     }
//     par = string.split("\n")
//     res = "<div>"
//     list = 0
//     for (var i = 0 ; i < par.length; i++) {
//         sen = par[i]
//         if (sen.substring(0, 3) == "-- ") {
//             sen = sen.substring(3)
//             if (list == 0) {
//                 res += "<ul><li>" + sen + "</li>"
//                 list = 1
//             } else {
//                 res += "<li>" + sen + "</li>"
//             } 
//         } else {
//             if (list == 0) {
//                 res += "<div>" + sen + "</div>"
//             } else {
//                 res += "</ul><div>" + sen + "</div>"
//                 list = 0
//             }     	
//         }
//     }
//     if (list == 1) {
//         res += "</ul></div>"
//     } else {
//         res += "</div>"
//     }
//     return res;
// }

// contentPost = document.getElementById("noidungbaiviet")
// contentPost.onkeyup = function() {
//     document.getElementById("contentHTML").innerHTML = convertToHTML(contentPost.value)
// }

// convertToHTML(document.getElementById("noidungbaiviet").value)

// document.getElementById("xemtruocbaiviet").onclick = function() {
    
// }

// Chuẩn hóa tên
document.getElementById("name").onblur = function() {
	this.value = ChuanhoaTen(this.value);
};
document.getElementById("name").onkeyup = function(e) {
	DoKeyup(e, this, 'diachi');
};
function ChuanhoaTen(ten) {
	dname = ten;
	ss = dname.split(' ');
	dname = "";
	for (i = 0; i < ss.length; i++)
		if (ss[i].length > 0) {
			if (dname.length > 0) dname = dname + " ";
			dname = dname + ss[i].substring(0, 1).toUpperCase();
			dname = dname + ss[i].substring(1).toLowerCase();
		}
	return dname;
} 

// Load footer
// $('#footer').load('../static/page/footer.html');