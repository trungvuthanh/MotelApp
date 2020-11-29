// console.log("abc")
document.getElementById("username").focus();

document.getElementById("hoten").onblur = function() {
	this.value = ChuanhoaTen(this.value);
};

document.getElementById("hoten").onkeyup = function(e) {
	DoKeyup(e, this, 'diachi');
};

document.getElementById("repassword").onkeyup = function() {
	if (document.getElementById("password").value != document.getElementById("repassword").value ) {
		document.getElementById("repassword").className = 'form-control invalid';
	}
	else if (document.getElementById("password").value = document.getElementById("repassword").value ) {
		document.getElementById("repassword").className = 'form-control valid';
	}
}  

// Chuẩn hóa tên (Viết hoa kí tự đầu)
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

// Preview và giới hạn 1 ảnh
function createImage(base64) {
	return '<div class = "frame-image"><div class="close" onclick="removeImage(this)">&times;</div><img src="'+ base64 +'" height=200px></div>';
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
    if (numFile < 1) {
        document.getElementById("btnHinhAnh").className = "loi_anh myinvalid"
    } else {
        document.getElementById("btnHinhAnh").className = "loi_anh myvalid"
    }
}
'use strict';
window.addEventListener('load', function() {
    var forms = document.getElementsByClassName('needs-validation');
    validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            checkCountFileImage()
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

var listImageUltities = document.querySelectorAll("div.tienich img");
for (var i = 0; i < listImageUltities.length; i++) {
    listImageUltities[i].onclick = function() {
        if ($(this).hasClass("active-image")) {
            $(this).removeClass("active-image");
        } else {
            $(this).addClass("active-image");
        }
    }
}

function removeImage(elmt) {
    elmt.parentNode.remove();
}

const inputs = document.querySelectorAll('input');

// Regex
const patterns = {
  username: /^[a-z\d]{5,12}$/i,
  password: /^[\d\w@-]{8,20}$/i,
  email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
  hoten: /^[a-z]{2,25}$/i,
  phone: /^\d{10}$/,
  id: /^\d/
};
document.getElementById("username").onchange = function() { 
	var username = document.getElementById("username")
	parttern = /^[a-z\d]{5,12}$/i
	if (parttern.test(username.value)) {
		username.className = 'nhapusername myvalid';
	} else {
		username.className = 'nhapusename myinvalid';
	}
}
document.getElementById("password").onchange = function() { 
	console.log(document.getElementById("password"))
	var password = document.getElementById("password")
	parttern = /^[\d\w@-]{8,20}$/i
	if (parttern.test(password.value)) {
		password.className = 'nhappassword1 myvalid';
	} else {
		password.className = 'nhappassword1 myinvalid';
	}
}
document.getElementById("repassword").onchange = function() {
	console.log(document.getElementById("repassword"))
	console.log(document.getElementById("password"))
	if (document.getElementById("password").value != document.getElementById("repassword").value ) {
		document.getElementById("repassword").className = 'nhappassword2 myinvalid';

	} else {
		document.getElementById("repassword").className = 'nhappassword2 myvalid';
	}
}  
document.getElementById("hoten").onchange = function() { 
	var hoten = document.getElementById("hoten")
	parttern = /^[a-z\s]{2,25}$/i
	if (parttern.test(hoten.value)) {
		hoten.className = 'nhapten myvalid';
	} else {
		hoten.className = 'nhapten myinvalid';
	}
}
document.getElementById("phone").onchange = function() { 
	var phone = document.getElementById("phone")
	parttern = /^\d{10}$/
	if (parttern.test(phone.value)) {
		phone.className = 'nhapsdt myvalid';
	} else {
		phone.className = 'nhapsdt myinvalid';
	}
}
document.getElementById("email").onchange = function() { 
	var email = document.getElementById("email")
	parttern = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/
	if (parttern.test(email.value)) {
		email.className = 'nhapemail myvalid';
	} else {
		email.className = 'nhapemail myinvalid';
	}
}
document.getElementById("id").onchange = function() { 
	var id = document.getElementById("id")
	parttern = /^\d/
	if (parttern.test(id.value)) {
		id.className = 'nhapcmt myvalid';
	} else {
		id.className = 'nhapcmt myinvalid';
	}
}

// Kiểm tra form
function Chapnhan() {
	// var okie = true; //chua co loi
	//xoa cac thong bao loi
	// document.getElementById("loi_repass").innerHTML = "";
	if (document.getElementById("password").value  != document.getElementById("repassword").value ) {
		document.getElementById("loi_repass").innerHTML = "Mật khẩu không khớp";
		document.getElementById("password").focus();
		// okie = false;
	} else {
		document.getElementById("loi_repass").innerHTML = "";
		// okie = true;
		// console.log("abc");
	}
	if (document.getElementById("username").value != /^[a-z\d]{5,12}$/) {
		document.getElementById("loi_username").innerHTML = "Username không hợp lệ";
		// okie = false;
	} else {
		document.getElementById("loi_username").innerHTML = "";
	}
	if (document.getElementById("password").value != /^[a-z\d]{5,12}$/) {
		document.getElementById("loi").innerHTML = "Mật khẩu không hợp lệ";
		// okie = false;
	} else {
		document.getElementById("loi_email").innerHTML = "";
	}
	if (document.getElementById("hoten").value != /^[a-z\d]{5,12}$/) {
		document.getElementById("loi_hoten").innerHTML = "Tên không hợp lệ";
		// okie = false;
	} else {
		document.getElementById("loi_hoten").innerHTML = "";
	}
	if (document.getElementById("phone").value != /^[a-z\d]{5,12}$/) {
		document.getElementById("loi_sdt").innerHTML = "SĐT không hợp lệ";
		// okie = false;
	} else {
		document.getElementById("loi_sdt").innerHTML = "";
	}
	if (document.getElementById("email").value != /^[a-z\d]{5,12}$/) {
		document.getElementById("loi_email").innerHTML = "Email không hợp lệ";
		// okie = false;
	} else {
		document.getElementById("loi_email").innerHTML = "";
	}
	if (document.getElementById("id").value != /^[a-z\d]{5,12}$/) {
		document.getElementById("loi_id").innerHTML = "ID không hợp lệ";
		// okie = false;
	} else {
		document.getElementById("loi_id").innerHTML = "";
	}
	// return okie
}