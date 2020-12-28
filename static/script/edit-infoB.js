// Load menu
$('#menu').load('../static/page/menu-renter.html');

var avatars = document.querySelectorAll(".ava img"); 
var active = avatars[0];
for (var i = 0; i < avatars.length; i++) {
    avatars[i].onclick = function() {
        $(active).removeClass("active-image");
        $(this).addClass("active-image");
        active = this;
    }
}

fetch("/information-account")
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    typeAvt = data.typeAvt;
                    username = data.username
                    document.getElementById("username").value = username
                    var listImages = document.querySelectorAll("div.tienich img");
                    for (var i = 0; i < listImages.length; i++) {
                        // $(listImages[typeAvt-1]).addClass("active-image")
                        $(listImages[typeAvt-1]).click()
                    }
                    
                }
            )
        }
    }
)

var provinces = document.getElementById("province") 
var districts = document.getElementById("district")
var wards = document.getElementById("ward")  

fetch("/getInfoDefaultB")
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    phoneNumber = data.phoneNumber
                    fullname = data.fullname
                    fullbirthday = data.birthday
                    email = data.email
                    addressProvince = data.addressProvince
                    addressDistrict = data.addressDistrict
                    addressWard = data.addressWard
                    addressDetail = data.addressDetail
                    document.getElementById("name").value = fullname
                    document.getElementById("phone").value = phoneNumber
                    document.getElementById("email").value = email
                    // function getValueAtIndex(index){
                    //     var str = fullbirthday 
                    //     return str.split("-")[index];
                    // }
                    // birthdayMonth = getValueAtIndex(1);
                    // birthdayDate = getValueAtIndex(2)
                    // birthdayYear = getValueAtIndex(0)
                    // birthday = birthdayDate + "-" + birthdayMonth + "-" + birthdayYear
                    // console.log(birthday)
                    document.getElementById("date").value = fullbirthday
                    document.getElementById("province").innerHTML = '<option value="' + addressProvince + '" selected>' + addressProvince +'</option>'
                    document.getElementById("district").innerHTML = '<option value="' + addressDistrict + '" selected>' + addressDistrict +'</option>'
                    document.getElementById("ward").innerHTML = '<option value="' + addressWard + '" selected>' + addressWard +'</option>'
                    document.getElementById("addressDetail").value = addressDetail
                }
            )
        }
    }
)

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

document.getElementById("repassword").onkeyup = function() {
	if (document.getElementById("password").value != document.getElementById("repassword").value || document.getElementById("repassword").value == "") {
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




function renderBodyEditInfoB() {
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
    addressDetail = document.getElementById("addressDetail").value
    return {password: password, repassword: repassword, fullname: fullname, phoneNumber: phoneNumber, email: email, birthday: birthday, addressProvince: province, addressDistrict: district, addressWard: ward, addressDetail: addressDetail, typeAvt: typeAvt}
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
            if (document.getElementById("password").value  != document.getElementById("repassword").value ) {
                document.getElementById("loi_repass").innerHTML = "Mật khẩu không khớp";
                document.getElementById("password").focus();
                event.stopPropagation();
            }
            if (form.checkValidity() === false ) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                var abc = renderBodyEditInfoB()               
                console.log(abc)
                fetch('/luuChinhSuaThongTinB', {
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
                                    if (data.message == "ok") {
                                        console.log(data.message)
                                        alert("Chỉnh sửa thành công")
                                        location.href = "/"
                                    } else if (data.message != "ok") {
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
                
            }
            form.classList.add('was-validated');
        }, false);
    });
}, false);

// Load footer
$('#footer').load('../static/page/footer.html');