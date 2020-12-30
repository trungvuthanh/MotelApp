var typeAcc;
// Load menu, footer
fetch('/information-account')
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    typeAcc = data.typeAccount
                    $('#menu').load('/static/page/menu-' + data.typeAccount + '.html');
                }
            )
        }
    }
)
$('#footer').load('/static/page/footer.html');

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
    if (e.files.length > 3) {
        alert("Only 3 files accepted.");
        e.preventDefault();
    }
}

function checkCountFileImage() {
    var numFile = document.getElementsByClassName("frame-image").length;
    if (numFile < 3) {
        document.getElementById("btnHinhAnh").className = "form-control-file is-invalid"
    } else {
        document.getElementById("btnHinhAnh").className = "form-control-file is-valid"
    }
}



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

function hienThiThemThongTin(elmt) {
    icon = elmt.childNodes[1]
    if (icon.className == 'fa fa-caret-down') {
        icon.className = 'fa fa-caret-down open'
    } else {
        icon.className = 'fa fa-caret-down'
    }
    
    elmt = document.getElementById("huongDan");
    $(elmt).slideToggle();
}

function convertToHTML(string) {
    bold = 0
    while (string.match(/\*\*/g)!=null) {
        if (bold == 0) {
            string = string.replace(/\*\*/i, "<b>")
            bold = 1
        } else {
            string = string.replace(/\*\*/i, "</b>")
            bold = 0
        }
    }
    italic = 0
    while (string.match(/\/\//g)!=null) {
        if (italic == 0) {
            string = string.replace(/\/\//i, "<i>")
            italic = 1
        } else {
            string = string.replace(/\/\//i, "</i>")
            italic = 0
        }
    }
    par = string.split("\n")
    res = "<div>"
    list = 0
    for (var i = 0 ; i < par.length; i++) {
        sen = par[i]
        if (sen.substring(0, 3) == "-- ") {
            sen = sen.substring(3)
            if (list == 0) {
                res += "<ul><li>" + sen + "</li>"
                list = 1
            } else {
                res += "<li>" + sen + "</li>"
            } 
        } else {
            if (list == 0) {
                res += "<div>" + sen + "</div>"
            } else {
                res += "</ul><div>" + sen + "</div>"
                list = 0
            }     	
        }
    }
    if (list == 1) {
        res += "</ul></div>"
    } else {
        res += "</div>"
    }
    return res;
}

contentPost = document.getElementById("noidungbaiviet")
contentPost.onkeyup = function() {
    document.getElementById("contentHTML").innerHTML = convertToHTML(contentPost.value)
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

document.getElementById("postDuration").onchange = function() {
    term = document.getElementById("postDuration").value
    term2 = document.getElementById("phi") 
    if (term == 7) {
        term2.innerHTML = "Phí: 300,000 VNĐ"
    } else if (term == 30) {
        term2.innerHTML = "Phí: 500,000 VNĐ"
    } else if (term == 90) {
        term2.innerHTML = "Phí: 1,000,000 VNĐ"
    } else if (term == 180) {
        term2.innerHTML = "Phí: 1,500,000 VNĐ"
    } else if (term == 365) {
        term2.innerHTML = "Phí: 1,800,000 VNĐ"
    } 
}

fetch("/thong-tin-lien-he")
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    document.getElementById("fullname").value = data.name
                    document.getElementById("phoneNumber").value = data.phoneNumber
                    document.getElementById("address").value = data.address
                }
            )
        }
    }
)


function renderBodyCreatePost() {
    titlePost = document.getElementById("tieudebaiviet").value
    itemType = document.getElementById("itemType").value
    addressProvince = document.getElementById("province").value
    addressDistrict = document.getElementById("district").value
    addressWard = document.getElementById("ward").value
    addressDetail = document.getElementById("addressDetail").value
    locationRelate = convertToHTML(document.getElementById("locationRelate").value)
    area = document.getElementById("area").value
    numOfRoom = document.getElementById("numOfRoom").value
    priceItem = document.getElementById("priceItem").value
    statusItem = document.getElementById("statusItem").value
    bathroom = document.getElementById("bathroom1").value + " " + document.getElementById("bathroom2").value
    kitchen = document.getElementById("kitchen").value
    priceElectric = document.getElementById("priceElectric").value
    priceWater = document.getElementById("priceWater").value
    if (document.querySelector("#aircondition img").classList.contains("active-image")) {
        aircondition = 1;
    } else { aircondition = 0 }
    if (document.querySelector("#balcony img").classList.contains("active-image")) {
        balcony = 1;
    } else { balcony = 0 }
    if (document.querySelector("#washing-machine img").classList.contains("active-image")) {
        washingMachine = 1;
    } else { washingMachine = 0 }
    if (document.querySelector("#wardrobe img").classList.contains("active-image")) {
        wardrobe = 1;
    } else { wardrobe = 0 }
    if (document.querySelector("#tv img").classList.contains("active-image")) {
        tv = 1;
    } else { tv = 0 }
    if (document.querySelector("#wifi img").classList.contains("active-image")) {
        wifi = 1;
    } else { wifi = 0 }
    refri = 0;
    // (Tủ lạnh, máy giặt, tủ quần áo, tv, wifi)
    otherUtility = refri + " " + washingMachine + " " + wardrobe + " " + tv + " " + wifi
    console.log(otherUtility)
    allImages = document.querySelectorAll(".frame-image img")
    listImages = []
    for (var i = 0; i < allImages.length; i ++) {
        listImages.push(allImages[i].src)
    }
    contentPost = convertToHTML(document.getElementById("noidungbaiviet").value)
    postDuration = document.getElementById("postDuration").value
    return {titlePost: titlePost, contentPost: contentPost, addressProvince: addressProvince, addressDistrict: addressDistrict, addressWard: addressWard, addressDetail: addressDetail, 
        locationRelate: locationRelate, itemType: itemType, numOfRoom: numOfRoom, priceItem: priceItem, area: area, statusItem: statusItem, bathroom: bathroom, kitchen: kitchen, aircondition: aircondition, 
        balcony: balcony, priceElectric: priceElectric, priceWater: priceWater, otherUtility: otherUtility, postDuration: postDuration, listImages: listImages}
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
            if (form.checkValidity() === false ) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // alert("ok")
                var abc = renderBodyCreatePost()
                fetch('/createPost', {
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
                                        alert("Đã tạo thành công bài đăng")
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
// convertToHTML(document.getElementById("noidungbaiviet").value)

// document.getElementById("xemtruocbaiviet").onclick = function() {
    
// }
