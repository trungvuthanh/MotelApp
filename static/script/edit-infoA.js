// Load menu
$('#menu').load('../static/page/menu-owner.html');

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


function renderBodyEditInfoB() {
    password = md5(document.getElementById("password").value)
    repassword = md5(document.getElementById("repassword").value)
    avt = document.querySelector(".active-image").src.split("/")
    avt = parseInt(avt[avt.length-1].split(".")[0])
    return {password: password, repassword: repassword, typeAvt: avt}
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
            
            if (document.getElementById("password").value  != document.getElementById("repassword").value || document.getElementById("password").value == "" || document.getElementById("repassword").value == "" ) {
                document.getElementById("loi_repass").innerHTML = "Mật khẩu không khớp";
                document.getElementById("password").focus();
                event.stopPropagation();

            }
            if (form.checkValidity() === false ) {
                
                event.preventDefault();
                event.stopPropagation();
            } else {
                
                // alert("ok")
                abc = renderBodyEditInfoB()
                console.log(abc)
                fetch('/luuChinhSuaMatKhauVaAvatarA', {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify(abc),
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
                                    // alert(data.message)
                                    if (data.message == "ok") {
                                        console.log(data.message)
                                        alert("Chỉnh sửa thành công")
                                        location.href = "/"
                                    } else if (data.message != "ok") {
                                        alert("Hệ thống đang bận, vui lòng thử lại sau")
                                    }                     
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
// $('#footer').load('../static/page/footer.html');