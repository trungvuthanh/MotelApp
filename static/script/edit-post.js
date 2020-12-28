var provinces = document.getElementById("province") 
var districts = document.getElementById("district")
var wards = document.getElementById("ward") 
var pr;
var di;
var wa;

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

// str= window.location.href;
// temp = str.split("/");
// var idPost = temp[temp.length];
// console.log(idPost)
function getIdPost(index){
    var str = window.location.href
    return str.split("/")[index];
}
idPost = getIdPost(4)
console.log(idPost)

function getDefaultInfoPost() {
    fetch("/thong-tin-bai-dang/" + idPost)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        titlePost = data.titlePost
                        itemType = data.itemType
                        pr = data.addressProvince
                        di = data.addressDistrict
                        wa = data.addressWard
                        addressDetail = data.addressDetail
                        area = data.area
                        numOfRoom = data.numOfRoom
                        priceItem = data.priceItem
                        statusItem = data.statusItem
                        bathroom = data.bathroom
                        function getValueAtIndex(index){
                            var str = bathroom
                            return str.split(" ")[index];
                        }
                        bathroom1 = getValueAtIndex(0)
                        bathroom2 = getValueAtIndex(1)
                        kitchen = data.kitchen
                        priceElectric = data.priceElectric
                        priceWater = data.priceWater
                        document.getElementById("tieudebaiviet").value = titlePost
                        document.getElementById("itemType").value = itemType
                        document.getElementById("province").innerHTML = '<option value="' + pr + '" selected>' + pr +'</option>'
                        document.getElementById("district").innerHTML = '<option value="' + di + '" selected>' + di +'</option>'
                        document.getElementById("ward").innerHTML = '<option value="' + wa + '" selected>' + wa +'</option>'
                        document.getElementById("addressDetail").value = addressDetail
                        document.getElementById("area").value = area
                        document.getElementById("numOfRoom").value = numOfRoom
                        document.getElementById("priceItem").value = priceItem
                        document.getElementById("statusItem").value = statusItem
                        document.getElementById("bathroom1").value = bathroom1
                        document.getElementById("bathroom2").value = bathroom2
                        document.getElementById("kitchen").value = kitchen
                        document.getElementById("priceElectric").value = priceElectric
                        document.getElementById("priceWater").value = priceWater
                        otherUtility = data.otherUtility
                        console.log(data.otherUtility)
                        function getValueTienIch(index){
                            var str = otherUtility
                            return str.split(" ")[index];
                        }
                        washingMachine = getValueTienIch(1)
                        wardrobe = getValueTienIch(2)
                        tv = getValueTienIch(3)
                        wifi = getValueTienIch(4)
                        aircondition = data.aircondition
                        balcony = data.balcony
                        console.log(washingMachine, wardrobe, tv, wifi, aircondition, balcony)
                                           
                        if (aircondition == 1) {
                            $(listImageUltities[0]).addClass("active-image");
                        } if (balcony == 1) {
                            $(listImageUltities[1]).addClass("active-image");
                        } if (washingMachine == 1) {
                            $(listImageUltities[2]).addClass("active-image");
                        } if (wardrobe == 1) {
                            $(listImageUltities[3]).addClass("active-image");
                        } if (tv == 1) {
                            $(listImageUltities[4]).addClass("active-image");
                        } if (wifi == 1) {
                            $(listImageUltities[5]).addClass("active-image");
                        }
                        for(let i=0;i<data.images.length;i++){
                            document.getElementById("preview").innerHTML += '<div class = "frame-image"><div class="close" onclick="removeImage(this)">&times;</div><img src="'+ data.images[i] +'"></div>';
                        }
                        console.log(data.postDuration)
                        // if(data.postDuration==7){
                            document.getElementById("postDuration").value = data.postDuration
                        // } if(data.postDuration==30){
                        //     document.getElementById("postDuration").value = data.postDuration
                        // } 
                        document.getElementById("contentHTML").innerHTML = data.contentPost
                    }
                )
            }
        }
    )
}


fetch("/getProvinces")
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    provinces = data.provinces
                    for (var i = 0; i < provinces.length; i ++) {
                        // if(provinces[i] == pr){
                        //     document.getElementById("province").innerHTML += 
                        //     '<option value="' + provinces[i] + '" selected>' + provinces[i] + '</option>'  
                        // } else {
                            document.getElementById("province").innerHTML += 
                        '<option value="' + provinces[i] + '">' + provinces[i] + '</option>'  
                        // }
                                             
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



console.log(getDefaultInfoPost())
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
                fetch('/editPost/' + idPost, {
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