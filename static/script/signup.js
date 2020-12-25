function createImage(base64) {
    return '<div class = "frame-image"><div class="close" onclick="removeImage(this)">&times;</div><img src="'+ base64 +'"></div>';
}

var imgId;

function previewFile(input) {
    const [file] = input.files 
    const reader = new FileReader()
    reader.onloadend = function() {
        document.getElementById("preview").innerHTML += createImage(reader.result);
        imgId = reader.result
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
    if (numFile == 0 || numFile > 1) {
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
        document.querySelector("#row-cmnd").innerHTML = '<div class="form-row" id="row-cmnd">' +              
                                                            '<div class="col-md-6 mb-3">  ' +                 
                                                                '<label for="" class="chimuc">CMND/CCCD</label>' +
                                                                '<div id="inputCMND">' +
                                                                    '<input type="text" class="form-control" id="id" pattern="[0-9]{9,12}" placeholder="123456789">' +
                                                                '</div>' +
                                                                '<div class="invalid-feedback">Nhập CMND/CCCD</div>' +
                                                                '<div class="note"><i>CMND/CCCD phải gồm 9-12 chữ số</i></div>' +
                                                            '</div>' +
                                                            '<div class="col-md-6 mb-3">' +                                                                               
                                                                '<div class="form-group">' +
                                                                    '<label for="">Hình ảnh</label>' +
                                                                    '<input type="file" class="form-control-file"  accept="image/*" onchange = "previewFile(this);"  id="btnHinhAnh">' +
                                                                    '<div id = "preview"></div>' +
                                                                '</div> ' +                  
                                                            '</div>' +
                                                        '</div>'
    } else {
        document.querySelector("#row-cmnd").innerHTML = '<div class="form-row" id="row-cmnd">' +              
                                                            '<div class="col-md-6 mb-3">  ' +                 
                                                                '<label for="" class="chimuc">CMND/CCCD</label>' +
                                                                '<div id="inputCMND">' +
                                                                    '<input type="text" class="form-control" id="id" pattern="[0-9]{9,12}" placeholder="123456789" required>' +
                                                                '</div>' +
                                                                '<div class="invalid-feedback">Nhập CMND/CCCD</div>' +
                                                                '<div class="note"><i>CMND/CCCD phải gồm 9-12 chữ số</i></div>' +
                                                            '</div>' +
                                                            '<div class="col-md-6 mb-3">' +                                                                               
                                                                '<div class="form-group">' +
                                                                    '<label for="">Hình ảnh</label>' +
                                                                    '<input type="file" class="form-control-file"  accept="image/*" required onchange = "previewFile(this);"  id="btnHinhAnh">' +
                                                                    '<div class="invalid-feedback">Tải lên 1 ảnh.</div>' +
                                                                    '<div id = "preview"></div>' +
                                                                '</div> ' +                  
                                                            '</div>' +
                                                        '</div>'
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




function removeImage(elmt) {
    elmt.parentNode.remove();
}

// Chuẩn hóa tên
document.getElementById("name").onblur = function() {
	this.value = ChuanhoaTen(this.value);
};
// document.getElementById("name").onkeyup = function(e) {
// 	DoKeyup(e, this, 'diachi');
// };
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

function checkUsername() {
    username = document.getElementById('username').value;
    fetch('/kiem-tra-username', {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({username: username}),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })      
    })
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        if (data.message == 'exist') {
                            alert('Tài khoản đã tồn tại');
                            document.getElementById('username').value = '';
                            document.getElementById("username").classList.remove("is-valid");
                        } else if (data.message == 'not_exist') {document.getElementById("username").classList.add("is-valid");
                        }
                    }
                )
            }
        }
    )
}


var provinces = document.getElementById("province") 
var districts = document.getElementById("district")
var wards = document.getElementById("ward")  

fetch("/getProvinces")
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    provinces = data.provinces
                    for (var i = 0; i < provinces.length; i ++) {
                        document.getElementById("province").innerHTML += 
                        '<option value="' + provinces[i] + '">' + provinces[i] + '</option>'                       
                    }
                }
            )
        }
    }
)

document.getElementById("province").onchange = function() {
    province = document.getElementById("province").value
    fetch("/getDistricts/" + province)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        districts = data.districts
                        document.getElementById("district").innerHTML = '<option value="">Quận/huyện</option>'
                        document.getElementById("ward").innerHTML = '<option value="">Phường/xã</option>'
                        for (var i = 0; i < districts.length; i ++) {
                            document.getElementById("district").innerHTML += 
                            '<option value="' + districts[i] + '">' + districts[i] + '</option>'                       
                        }
                    }
                )
            }
        }
    )
}

document.getElementById("district").onchange = function() {
    province = document.getElementById("province").value
    district = document.getElementById("district").value
    fetch("/getWards/" + province + "/" + district)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        wards = data.wards
                        document.getElementById("ward").innerHTML = '<option value="">Phường/xã</option>'
                        for (var i = 0; i < wards.length; i ++) {
                            document.getElementById("ward").innerHTML += 
                            '<option value="' + wards[i] + '">' + wards[i] + '</option>'                       
                        }
                    }
                )
            }
        }
    )
}


// function submitDangKy() {
//     fetch('/submit-dang-ky', {
//         method: "POST",
//         credentials: "include",
//         body: JSON.stringify(renderBodySubmitSignin()),
//         cache: "no-cache",
//         headers: new Headers({
//             "content-type": "application/json"
//         })
//     })
//     .then(
//         resp => {
//             if (resp.status == 200) {
//                 resp.json()
//                 .then(
//                     data => {
//                         if (data.message == "success") {
//                             location.href = "/"
//                         } else if (data.message == "error") {
//                             alert("Hệ thống đang bận, vui lòng thử lại sau")
//                         }                      
//                     }
//                 )
//             }
//         }
//     )
// }

function renderBodySubmitSignin() {
    typeAcc = document.getElementById("typeacc").value
    username = document.getElementById("username").value
    password = md5(document.getElementById("password").value)
    repassword = md5(document.getElementById("repassword").value)
    typeAvt = document.querySelector(".active-image").src.split("/")
    typeAvt = parseInt(typeAvt[typeAvt.length-1].split(".")[0])
    fullname = document.getElementById("name").value
    phoneNumber = document.getElementById("phone").value
    email =  document.getElementById("email").value
    birthday = document.getElementById("date").value  
    province = document.getElementById("province").value
    district = document.getElementById("district").value
    ward = document.getElementById("ward").value
    detailLocaion = document.getElementById("detailLocation").value
    if (typeAcc == "renter") {
        return {username: username, password: password, repassword: repassword, fullname: fullname, phoneNumber: phoneNumber, email: email, birthday: birthday, addressProvince: province, addressDistrict: district, addressWard: ward, addressDetail: detailLocation, typeAvt: typeAvt, typeAccount: typeAcc, imageID: "", "ID": ""}
    } else if (typeAcc == "owner") {
        id = document.getElementById("id").value
        imgId = document.querySelector(".frame-image img").src
        return {username: username, password: password, repassword: repassword, fullname: fullname, phoneNumber: phoneNumber, email: email, birthday: birthday, "ID": id, addressProvince: province, addressDistrict: district, addressWard: ward, addressDetail: detailLocation, typeAvt: typeAvt, typeAccount: typeAcc, imageID: imgId }
    }
}

var validation
function mysleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
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
                // alert("ok1")
                // console.log("123")
                var abc = renderBodySubmitSignin()               
                console.log(abc)
                fetch('/submit-dang-ky', {
                    method: "POST",
                    body: JSON.stringify(abc),
                    headers: new Headers({
                        "content-type": "application/json"
                    })
                })
                .then(
                    resp => {
                        if (resp.status == 200) {
                            resp.json()
                            .then(
                                data => {
                                    // alert(data.message)
                                    if (data.message == "success") {
                                        console.log(data.message)
                                        location.href = "/"
                                    } else if (data.message == "error") {
                                        alert("Hệ thống đang bận, vui lòng thử lại sau")
                                    } else {alert(data.message)}                    
                                }
                            )
                        } else {
                            alert(resp.status)
                        }
                    }
                )
                mysleep(2000)
                // alert("ok")
                
            }
            form.classList.add('was-validated');
        }, false);
    });
}, false);

// Load footer
// $('#footer').load('../static/page/footer.html');