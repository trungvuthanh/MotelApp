// Load menu, footer
$('#menu').load('../static/page/menu-admin.html');
$('#footer').load('../static/page/footer.html');

function renderNotification(image, titleNotification, contentNotification, time, id, status) {
    return '<div class="noti-item '+status+'" onclick="read(this)">'+
                '<img class="noti-img" src="../static/image/'+image+'">'+
                '<div class="noti-content">'+
                    '<h3 class="noti-title">'+titleNotification+'</h3>'+
                    '<div>ID: #'+id+'</div>'+
                    '<div>'+contentNotification+'</div>'+
                    '<h4 class="noti-time">'+time+'</h4>'+
                '</div>'+
            '</div>'
}

function renderBodyLoadPost() {
    statusPost = document.getElementById("statusPost").value
    sortDate = document.getElementById("sortDate").value
    access = document.getElementById("access").value
    province = document.getElementById("tinhthanh").value
    district = document.getElementById("quanhuyen").value
    ward = document.getElementById("xaphuong").value
    if (province == "allcity") {
        province = "";
        district = "";
        ward = "";
    }
    if (district == "alldistrict") {
        district = "";
        ward = "";
    }
    if (ward == "allward") {
        ward = ""
    }
    return {"statusPost": statusPost, "sortDate": sortDate, "access": access, "province": province, "district": district, "ward": ward}
}

function handleDate(stringDate) {
    stringDate = stringDate.split("-")
    return stringDate[2] + "/" + stringDate[1] + "/" + stringDate[0]
}
function handleChungChu(status) {
    if (status == "khongchungchu") {
        return "Không"
    } else {
        return "Có"
    }
}
function handlePhongTam(status) {
    if (status == "khongkepkin khongnonglanh") {
        return "Không khép kín - Không nóng lạnh"
    } else if (status == "khongkepkin nonglanh") {
        return "Không khép kín - Có nóng lạnh"
    } else if (status == "khepkin khongnonglanh") {
        return "Khép kín - Không nóng lạnh"
    } else {
        return "Khép kín - Có nóng lạnh"
    }
}
function handleBep(status) {
    if (status == "khubeprieng") {
        return "Riêng"
    } else if (status == "khubepchung") {
        return "Chung"
    } else {
        return "Không nấu ăn"
    }
}
function handleOtherUltities(status) {
    // Tủ lạnh, máy giặt, tủ quần áo, tv, wifi
    // điều hòa, ban công
    status = status.replaceAll("0", "Không").replaceAll("1", "Có")
    return status.split(" ")
}

function handleDieuHoaBanCong(status) {
    if (status == 1) {
        return "Có"
    } else {
        return "Không"
    }
}
function handleTypeRoom(status) {
    if (status == "phongtro") {
        return "Phòng trọ"
    } else if (status == "chungcunguyencan") {
        return "Chung cư nguyên căn"
    } else if (status == "chungcumini") {
        return "Chung cư mini"
    } else {
        return "Nhà nguyên căn"
    }
}

function renderPostContent(statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image) {
    return '<div class="space-between">'+
                '<div>'+
                    '<div class="form-title"><div class="title">Chung chủ:</div><p>'+handleChungChu(statusItem)+'</p></div>'+
                    '<div class="form-title"><div class="title">Số phòng ngủ:</div><p>1</p></div>'+
                    '<div class="form-title"><div class="title">Phòng tắm:</div><p>' + handlePhongTam(bathroom) +'</p></div>'+
                    '<div class="form-title"><div class="title">Khu bếp</div><p>'+handleBep(kitchen)+'</p></div>'+
                '</div>'+
                '<div>'+
                    '<div class="form-title"><div class="title">Điều hòa:</div><p>'+handleDieuHoaBanCong(aircondition)+'</p></div>'+
                    '<div class="form-title"><div class="title">Ban công:</div><p>'+handleDieuHoaBanCong(balcony)+'</p></div>'+
                    '<div class="form-title"><div class="title">Giá điện:</div><p>'+priceElectric+'</p></div>'+
                    '<div class="form-title"><div class="title">Giá nước:</div><p>'+priceWater+'</p></div>'+
                '</div>'+
                '<div></div><div></div>'+
            '</div>'+
            '<div class="text-area">'+
                '<div class="relate-place"><div class="form-title"><div class="title">Địa điểm lân cận:</div>'+locationRelate+'</div></div>'+
                '<div class="content"><div class="form-title"><div class="title">Nội dung:</div>'+contentPost+'</div></div>'+
                '<img src="'+image+'">'+
            '</div>'
}
function handleHire(status) {
    if (status == "ready") {
        return `<div class="hire-label">Chưa thuê</div>
        <div class="w-auto">
            <div type="checkbox" name="hire" class="hire-status"></div>
        </div>`
    } else {
        return `<div class="hire-label">Đã thuê</div>
        <div class="w-auto">
            <div type="checkbox" name="hire" class="hire-status hired"></div>
        </div>`
    }
}

function handleThoiGianDang(postDuation) {
    if (postDuation == 7) {
        return ["1 tuần", "300,000 VNĐ"]
    } else if (postDuation == 30) {
        return ["1 tháng", "500,000 VNĐ"]
    } else if (postDuation == 180) {
        return ["6 tháng", "1,000,000 VNĐ"]
    } else {
        return ["1 năm", "1,500,000 VNĐ"]
    }
}

function getMoreInfo() {
    
    // Mở rộng thêm thông tin
    $('.read-more').parent().css('cursor', 'pointer');
    $('.read-more').parent().click(function() {
        $(this).parent().next().next().slideToggle(500);
        if ($(this).children().last().children().hasClass('fas fa-caret-down')) {
            $(this).children().last().children().removeClass('fas fa-caret-down');
            $(this).children().last().children().addClass('fas fa-caret-up');
        } else {
            $(this).children().last().children().removeClass('fas fa-caret-up');
            $(this).children().last().children().addClass('fas fa-caret-down');
        }
    });

    // Đánh dấu cho thuê
    $('.hire-status').click(function() {
        idPost = this.parentNode.parentNode.parentNode.parentNode.childNodes[1].children[0].childNodes[1].innerHTML.substring(1)
        $(this).toggleClass('hired');
        if ($('.hire-status').hasClass('hired')) {
            $(this).parent().prev().html('Đã thuê');
            statusHired = "hired"
        } else {
            $(this).parent().prev().html('Chưa thuê');
            statusHired = "ready"
        }
        fetch("/updateStatusHired/" + idPost+"/"+statusHired)
        .then(
            resp => {
                if (resp.status == 200) {
                    resp.json()
                    .then(
                        data => {
                        }
                    )
                }
            }
        )
    });
}

function accept(elmt) {
    idPost = elmt.parentNode.parentNode.parentNode.parentNode.children[0].children[1].children[0].children[1].innerHTML.substring(1)
    time = elmt.parentNode.parentNode.parentNode.parentNode.parentNode.children[0].children[2].children[1].children[1].innerHTML
    
    postDuation = {"1 tuần": 7, "7 ngày": 7, "1 tháng": 30, "30 ngày": 30, "3 tháng": 90, "90 ngày": 90, "6 tháng": 180, "180 ngày": 180, "1 năm": 365, "365 ngày": 365}[time]
    console.log(idPost + " " + postDuation)
    fetch("/active/" + idPost + "/" + postDuation)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                    }
                )
            }
        }
    )
    elmt.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
}

function acceptGiaHan(elmt) {
    idPost = (elmt.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[1]).childNodes[0].childNodes[1].innerHTML.substring(1)
    time = elmt.parentNode.parentNode.parentNode.parentNode.parentNode.children[0].children[3].children[0].children[1].innerHTML
    postDuation = {"1 tuần": 7, "1 tháng": 30, "3 tháng": 90, "6 tháng": 180, "1 năm": 365}[time]
    fetch("/active/" + idPost + "/" + postDuation)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                    }
                )
            }
        }
    )
    elmt.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
}

function refuse(elmt) {
    idPost = elmt.parentNode.parentNode.parentNode.children[1].childNodes[1].children[1].innerHTML.substring(1)
    fetch("/deny/" + idPost)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                    }
                )
            }
        }
    )
    elmt.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
}

// Button từ chối
function refuseGiaHan(elmt) {
    alert("deny")
    idPost = (elmt.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[1]).childNodes[0].childNodes[1].innerHTML.substring(1)
    // console.log(idPost)
    fetch("/deny/" + idPost)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                    }
                )
            }
        }
    )
    elmt.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
}


function unblock(elmt) {
    idPost = (elmt.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].innerHTML.substring(1))
    fetch("/unblockPost/" + idPost)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                    }
                )
            }
        }
    )
    elmt.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
}
function renderHandlingPost(titlePost, addressProvince, addressDistrict, addressWard, priceItem, typeRoom, idPost, area, createDate, postDuation, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image, name, phoneNumber, address) {
    return `<div class="post-item border">
                <div class="basic-info">
                    <div class="space-between px-15"><div>
                        <div class="form-title"><div class="title">Tiêu đề:</div><p>`+titlePost+`</p></div>
                        <div class="form-title"><div class="title">Địa chỉ:</div>
                            <p>`+ addressWard + ', ' + addressDistrict + ', ' + addressProvince +`</p>
                        </div>
                        <div class="form-title"><div class="title">Giá phòng:</div><p>`+ priceItem +` triệu/tháng</p></div>
                        <div class="form-title"><div class="title">Loại phòng:</div><p>`+handleTypeRoom(typeRoom)+`</p></div></div>
                        <div>
                            <div class="form-title"><div class="title">ID:</div><p>#`+idPost+`</p></div>
                            <div class="form-title"></div>
                            <div class="form-title"><div class="title">Diện tích:</div><p>`+area+` m2</p></div>
                        </div>
                        <div class="result-action">
                            <div class="form-control status-action handling">Đang chờ duyệt</div>
                            <div class="justify-content-center align-items-center">
                                <button class="status-action form-control bg-green text-white align-items-center" onclick="accept(this)">Chấp nhận</i></button>
                                <button class="status-action form-control bg-red text-white align-items-center" onclick="refuse(this)">Từ chối</button>
                            </div>
                        </div>
                    </div><div class="border"></div>
                    <div class="space-between px-15">
                        <div class="form-title"><div class="title">Ngày tạo:</div><p>`+handleDate(createDate)+`</p></div>
                        <div class="form-title"><div class="title">Thời gian đăng:</div><p>`+postDuation+` ngày</p></div>
                        <div class="read-more"><i class="fas fa-caret-down"></i></div>
                    </div>
                </div><div class="border"></div>
                <div class="post-content px-15">`+
                    renderPostContent(statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image)+
                `</div>
                <div class="author space-between px-15">
                    <div class="form-title"><div class="title">Người đăng:</div><p>`+name+`</p></div>
                    <div class="form-title"><div class="title">SĐT:</div><p>`+phoneNumber+`</p></div>
                    <div class="form-title"><div class="title">Địa chỉ:</div><p>`+address+`</p></div>
                </div>
            </div>`
}

function renderPostOfAdmin(titlePost, addressProvince, addressDistrict, addressWard, priceItem, typeRoom, idPost, area, createDate, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image, totalView, totalFavorite, avgRating, acceptDate, statusHired, expiredDate) {
    return '<div class="post-item border">'+
    '<div class="basic-info">'+
        '<div class="space-between px-15">'+
            '<div><div class="form-title">'+
                    '<div class="title">Tiêu đề:</div>'+
                    '<p>'+titlePost+'</p>'+
                '</div>'+
                '<div class="form-title">'+
                    '<div class="title">Địa chỉ:</div>'+
                    '<p>'+addressWard + ", " + addressDistrict + ", " + addressProvince +'</p>'+
                '</div>'+
                '<div class="form-title">'+
                    '<div class="title">Giá phòng:</div>'+
                    '<p>'+priceItem+' triệu/tháng</p>'+
                '</div>'+
                '<div class="form-title">'+
                    '<div class="title">Loại phòng:</div>'+
                    '<p>'+handleTypeRoom(typeRoom)+'</p>'+
                '</div>'+
                '<div class="space-between">'+
                    '<div class="form-title">'+
                        '<div class="title">Lượt xem:</div>'+
                        '<p>'+totalView+' <i class="fas fa-eye"></i></p>'+
                    '</div>'+
                    '<div class="form-title">'+
                        '<div class="title">Yêu thích:</div>'+
                        '<p>'+totalFavorite+' <i class="fas fa-heart"></i></p>'+
                    '</div>'+
                '</div></div>'+
            '<div><div class="form-title">'+
                    '<div class="title">ID:</div>'+
                    '<p>#'+idPost+'</p>'+
                '</div>'+
                `<div class="form-title"></div>
                <div class="form-title">
                    <div class="title">Diện tích:</div>
                    <p>`+area+` m2</p>
                </div>
                <div class="form-title"></div>
                <div class="form-title">
                    <div class="title">Đánh giá:</div>
                    <div class="avg-rating text-center text-white rounded">
                        <span>`+avgRating+`</span>
                    </div>
                </div></div>

            <div class="result-action">
                <div class="form-control status-action posted">Đã đăng</div>
                <div class="flex-row align-items-center space-between w-100 border-0 hire-action mt-2">
                    `+handleHire(statusHired)+`
                </div>
            </div>
        </div>
        <div class="border"></div>
        <div class="space-between px-15">
            <div class="form-title">
                <div class="title">Ngày tạo:</div>
                <p>`+handleDate(createDate)+`</p>
            </div>
            <div class="form-title">
                <div class="title">Ngày đăng:</div>
                <p>`+handleDate(acceptDate)+`</p>
            </div>
            <div class="form-title">
                <div class="title">Ngày hết hạn</div>
                <p>`+handleDate(expiredDate)+`</p>
            </div>
            <div class="read-more"><i class="fas fa-caret-down"></i></div>
        </div>
    </div>
    <div class="border"></div>
    <div class="post-content px-15">`
        +renderPostContent(statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image)+
    '</div>'+
    '<div class="author space-between px-15">'+
        '<div class="form-title">'+
            '<div class="title">Người đăng:</div>'+
            '<p>ADMIN</p>'+
        '</div>'+
    '</div>'+
'</div>'
}

function renderActivePost(titlePost, addressProvince, addressDistrict, addressWard, priceItem, typeRoom, idPost, area, createDate, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image, totalView, totalFavorite, avgRating, acceptDate, statusHired, expiredDate, name, address, phoneNumber) {
    return '<div class="post-item border">'+
    '<div class="basic-info">'+
        '<div class="space-between px-15">'+
            '<div><div class="form-title">'+
                    '<div class="title">Tiêu đề:</div>'+
                    '<p>'+titlePost+'</p>'+
                '</div>'+
                '<div class="form-title">'+
                    '<div class="title">Địa chỉ:</div>'+
                    '<p>'+addressWard + ", " + addressDistrict + ", " + addressProvince +'</p>'+
                '</div>'+
                '<div class="form-title">'+
                    '<div class="title">Giá phòng:</div>'+
                    '<p>'+priceItem+' triệu/tháng</p>'+
                '</div>'+
                '<div class="form-title">'+
                    '<div class="title">Loại phòng:</div>'+
                    '<p>'+handleTypeRoom(typeRoom)+'</p>'+
                '</div>'+
                '<div class="space-between">'+
                    '<div class="form-title">'+
                        '<div class="title">Lượt xem:</div>'+
                        '<p>'+totalView+' <i class="fas fa-eye"></i></p>'+
                    '</div>'+
                    '<div class="form-title">'+
                        '<div class="title">Yêu thích:</div>'+
                        '<p>'+totalFavorite+' <i class="fas fa-heart"></i></p>'+
                    '</div>'+
                '</div></div>'+
            '<div><div class="form-title">'+
                    '<div class="title">ID:</div>'+
                    '<p>#'+idPost+'</p>'+
                '</div>'+
                `<div class="form-title"></div>
                <div class="form-title">
                    <div class="title">Diện tích:</div>
                    <p>`+area+` m2</p>
                </div>
                <div class="form-title"></div>
                <div class="form-title">
                    <div class="title">Đánh giá:</div>
                    <div class="avg-rating text-center text-white rounded">
                        <span>`+avgRating+`</span>
                    </div>
                </div></div>

            <div class="result-action">
            <div class="form-control status-action posted">Đã đăng</div>
            </div>
        </div>
        <div class="border"></div>
        <div class="space-between px-15">
            <div class="form-title">
                <div class="title">Ngày tạo:</div>
                <p>`+handleDate(createDate)+`</p>
            </div>
            <div class="form-title">
                <div class="title">Ngày đăng:</div>
                <p>`+handleDate(acceptDate)+`</p>
            </div>
            <div class="form-title">
                <div class="title">Ngày hết hạn</div>
                <p>`+handleDate(expiredDate)+`</p>
            </div>
            <div class="read-more"><i class="fas fa-caret-down"></i></div>
        </div>
    </div>
    <div class="border"></div>
    <div class="post-content px-15">`
        +renderPostContent(statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image)+
    '</div>'+
    `<div class="author space-between px-15">
    <div class="form-title">
        <div class="title">Người đăng:</div>
        <p>`+name+`</p>
    </div>
    <div class="form-title">
        <div class="title">SĐT:</div>
        <p>`+phoneNumber+`</p>
    </div>
    <div class="form-title">
        <div class="title">Địa chỉ:</div>
        <p>`+address+`</p>
    </div>
</div>`+
'</div>'
}

function renderExpiredPost(titlePost, addressProvince, addressDistrict, addressWard, priceItem, typeRoom, idPost, area, createDate, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image, totalView, totalFavorite, avgRating, acceptDate, expiredDate, name, address, phoneNumber) {
    return '<div class="post-item border">'+
    '<div class="basic-info">'+
        '<div class="space-between px-15">'+
            '<div><div class="form-title">'+
                    '<div class="title">Tiêu đề:</div>'+
                    '<p>'+titlePost+'</p>'+
                '</div>'+
                '<div class="form-title">'+
                    '<div class="title">Địa chỉ:</div>'+
                    '<p>'+addressWard + ", " + addressDistrict + ", " + addressProvince +'</p>'+
                '</div>'+
                '<div class="form-title">'+
                    '<div class="title">Giá phòng:</div>'+
                    '<p>'+priceItem+' triệu/tháng</p>'+
                '</div>'+
                '<div class="form-title">'+
                    '<div class="title">Loại phòng:</div>'+
                    '<p>'+handleTypeRoom(typeRoom)+'</p>'+
                '</div>'+
                '<div class="space-between">'+
                    '<div class="form-title">'+
                        '<div class="title">Lượt xem:</div>'+
                        '<p>'+totalView+' <i class="fas fa-eye"></i></p>'+
                    '</div>'+
                    '<div class="form-title">'+
                        '<div class="title">Yêu thích:</div>'+
                        '<p>'+totalFavorite+' <i class="fas fa-heart"></i></p>'+
                    '</div>'+
                '</div></div>'+
            '<div><div class="form-title">'+
                    '<div class="title">ID:</div>'+
                    '<p>#'+idPost+'</p>'+
                '</div>'+
                `<div class="form-title"></div>
                <div class="form-title">
                    <div class="title">Diện tích:</div>
                    <p>`+area+` m2</p>
                </div>
                <div class="form-title"></div>
                <div class="form-title">
                    <div class="title">Đánh giá:</div>
                    <div class="avg-rating text-center text-white rounded">
                        <span>`+avgRating+`</span>
                    </div>
                </div></div>

            <div class="result-action">
            
            <div class="form-control status-action expired">Hết hạn</div>
       
            </div>
        </div>
        <div class="border"></div>
        <div class="space-between px-15">
            <div class="form-title">
                <div class="title">Ngày tạo:</div>
                <p>`+handleDate(createDate)+`</p>
            </div>
            <div class="form-title">
                <div class="title">Ngày đăng:</div>
                <p>`+handleDate(acceptDate)+`</p>
            </div>
            <div class="form-title">
                <div class="title">Ngày hết hạn</div>
                <p>`+handleDate(expiredDate)+`</p>
            </div>
            <div class="read-more"><i class="fas fa-caret-down"></i></div>
        </div>
    </div>
    <div class="border"></div>
    <div class="post-content px-15">`
        +renderPostContent(statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image)+
    '</div>'+
    `<div class="author space-between px-15">
    <div class="form-title">
        <div class="title">Người đăng:</div>
        <p>`+name+`</p>
    </div>
    <div class="form-title">
        <div class="title">SĐT:</div>
        <p>`+phoneNumber+`</p>
    </div>
    <div class="form-title">
        <div class="title">Địa chỉ:</div>
        <p>`+address+`</p>
    </div>
</div>`+
'</div>'
}

function renderExtendPost(titlePost, addressProvince, addressDistrict, addressWard, priceItem, typeRoom, idPost, area, createDate, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image, totalView, totalFavorite, avgRating, postDuation, name, address, phoneNumber) {
    temp = handleThoiGianDang(postDuation)
    return '<div class="post-item border">'+
    '<div class="basic-info">'+
        '<div class="space-between px-15">'+
            '<div><div class="form-title">'+
                    '<div class="title">Tiêu đề:</div>'+
                    '<p>'+titlePost+'</p>'+
                '</div>'+
                '<div class="form-title">'+
                    '<div class="title">Địa chỉ:</div>'+
                    '<p>'+addressWard + ", " + addressDistrict + ", " + addressProvince +'</p>'+
                '</div>'+
                '<div class="form-title">'+
                    '<div class="title">Giá phòng:</div>'+
                    '<p>'+priceItem+' triệu/tháng</p>'+
                '</div>'+
                '<div class="form-title">'+
                    '<div class="title">Loại phòng:</div>'+
                    '<p>'+handleTypeRoom(typeRoom)+'</p>'+
                '</div>'+
                '<div class="space-between">'+
                    '<div class="form-title">'+
                        '<div class="title">Lượt xem:</div>'+
                        '<p>'+totalView+' <i class="fas fa-eye"></i></p>'+
                    '</div>'+
                    '<div class="form-title">'+
                        '<div class="title">Yêu thích:</div>'+
                        '<p>'+totalFavorite+' <i class="fas fa-heart"></i></p>'+
                    '</div>'+
                '</div></div>'+
            '<div><div class="form-title">'+
                    '<div class="title">ID:</div>'+
                    '<p>#'+idPost+'</p>'+
                '</div>'+
                `<div class="form-title"></div>
                <div class="form-title">
                    <div class="title">Diện tích:</div>
                    <p>`+area+` m2</p>
                </div>
                <div class="form-title"></div>
                <div class="form-title">
                    <div class="title">Đánh giá:</div>
                    <div class="avg-rating text-center text-white rounded">
                        <span>`+avgRating+`</span>
                    </div>
                </div></div>

            <div class="result-action">
            <div class="form-control status-action extend">Gia hạn</div>
            </div>
        </div>
        <div class="border"></div>
        <div class="space-between px-15">
            <div class="form-title">
                <div class="title">Ngày tạo:</div>
                <p>`+handleDate(createDate)+`</p>
            </div>
            <div class="read-more"><i class="fas fa-caret-down"></i></div>
        </div>
        <div class="space-between px-15 mb-2">
            <div class="form-title">
                <div class="title">Gia hạn:</div>
                <p>`+temp[0]+`</p>
            </div>
            <div class="form-title">
                <div class="title">Phí gia hạn:</div>
                <p>`+temp[1]+`</p>
            </div>
            <div class="result-action">
                <div class="justify-content-center align-items-center">
                    <button class="status-action form-control bg-green text-white align-items-center" onclick="acceptGiaHan(this)">Chấp nhận</i></button>
                    <button class="status-action form-control bg-red text-white align-items-center" onclick="refuseGiaHan(this)">Từ chối</button>
                </div>
            </div>
        </div>
    </div>
    <div class="border"></div>
    <div class="post-content px-15">`
        +renderPostContent(statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image)+
    '</div>'+
    `<div class="author space-between px-15">
    <div class="form-title">
        <div class="title">Người đăng:</div>
        <p>`+name+`</p>
    </div>
    <div class="form-title">
        <div class="title">SĐT:</div>
        <p>`+phoneNumber+`</p>
    </div>
    <div class="form-title">
        <div class="title">Địa chỉ:</div>
        <p>`+address+`</p>
    </div>
</div>`+
'</div>'
}

function renderBlockPost(titlePost, addressProvince, addressDistrict, addressWard, priceItem, typeRoom, idPost, area, createDate, postDuation, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image, name, phoneNumber, address) {
    return '<div class="post-item border">'+
                '<div class="basic-info">'+
                    '<div class="space-between px-15"><div>'+
                        '<div class="form-title"><div class="title">Tiêu đề:</div><p>'+titlePost+'</p></div>'+
                        '<div class="form-title"><div class="title">Địa chỉ:</div>'+
                            '<p>'+ addressWard + ', ' + addressDistrict + ', ' + addressProvince +'</p>'+
                        '</div>'+
                        '<div class="form-title"><div class="title">Giá phòng:</div><p>'+ priceItem +' triệu/tháng</p></div>'+
                        '<div class="form-title"><div class="title">Loại phòng:</div><p>'+handleTypeRoom(typeRoom)+'</p></div></div>'+
                        '<div>'+
                            '<div class="form-title"><div class="title">ID:</div><p>#'+idPost+'</p></div>'+
                            '<div class="form-title"></div>'+
                            '<div class="form-title"><div class="title">Diện tích:</div><p>'+area+' m2</p></div>'+
                        '</div>'+
                        '<div class="result-action">'+
                        '<div class="form-control status-action">Đã từ chối</div>'+
                        '<div class="justify-content-center align-items-center">'+
                            '<button class="status-action form-control bg-green text-white align-items-center" onclick="unblock(this)">Khôi phục</i></button>'+
                    '</div>'+
                        '</div>'+
                    '</div><div class="border"></div>'+
                    '<div class="space-between px-15">'+
                        '<div class="form-title"><div class="title">Ngày tạo:</div><p>'+handleDate(createDate)+'</p></div>'+
                        '<div class="form-title"><div class="title">Thời gian đăng:</div><p>'+postDuation+' ngày</p></div>'+
                        '<div class="read-more"><i class="fas fa-caret-down"></i></div>'+
                    '</div>'+
                '</div><div class="border"></div>'+
                '<div class="post-content px-15">'+
                    renderPostContent(statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image)+
                '</div>'+
                '<div class="author space-between px-15">'+
                    '<div class="form-title"><div class="title">Người đăng:</div><p>'+name+'</p></div>'+
                    '<div class="form-title"><div class="title">SĐT:</div><p>'+phoneNumber+'</p></div>'+
                    '<div class="form-title"><div class="title">Địa chỉ:</div><p>'+address+'</p></div>'+
                '</div>'+
            '</div>'
}
// console.log(renderBodyLoadPost())
function loadPost() {
    fetch('/managePost', {
        method: "POST",
        body: JSON.stringify(renderBodyLoadPost()),
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
                        document.getElementById("ketqua").innerHTML = ""
                        for (var i = 0; i < data.length; i++) {
                            post = data[i]
                            row = post
                            idPost = post.idPost
                            postDuration = post.postDuration
                            titlePost = post.titlePost
                            addressProvince = post.addressProvince, 
                            addressDistrict = post.addressDistrict
                            addressWard = post.addressWard
                            itemType = row.itemType
                            typeRoom = row.itemType
                            priceItem = row.priceItem
                            statusItem = row.statusItem
                            createDate = row.createDate
                            acceptDate = row.acceptDate
                            expireDate = row.expireDate
                            expiredDate = row.expireDate
                            statusPost = row.statusPost
                            statusHired = row.statusHired
                            totalView = row.totalView
                            totalFavorite = row.totalFavorite
                            avgRating = row.avgRating
                            moreInfo = row.moreInfo
                            idPost = moreInfo.idPost
                            contentPost = moreInfo.contentPost
                            locationRelate = moreInfo.locationRelate
                            numOfRoom = moreInfo.numOfRoom
                            area = moreInfo.area
                            bathroom = moreInfo.bathroom
                            kitchen = moreInfo.kitchen
                            aircondition = moreInfo.aircondition
                            balcony = moreInfo.balcony
                            priceElectric = moreInfo.priceElectric
                            priceWater = moreInfo.priceWater
                            otherUtility = moreInfo.otherUtility
                            usernameAuthorPost = moreInfo.usernameAuthorPost
                            typeAccountAuthor = moreInfo.typeAccountAuthor
                            postDuration = moreInfo.postDuration
                            fullname = moreInfo.name
                            phoneNumber = moreInfo.phoneNumber
                            address = moreInfo.address
                            image = moreInfo.image
                            if (document.getElementById("statusPost").value == "postOfAdmin") {
                                p = renderPostOfAdmin(titlePost, addressProvince, addressDistrict, addressWard, priceItem, typeRoom, idPost, area, createDate, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image, totalView, totalFavorite, avgRating, acceptDate, statusHired, expiredDate)
                            } else if (post.statusPost == "handling") {
                                p = renderHandlingPost(post.titlePost, addressProvince, addressDistrict, addressWard, priceItem, typeRoom, idPost, area, createDate, postDuration, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image, fullname, phoneNumber, address)
                            } else if (post.statusPost == "active") {
                                p = renderActivePost(titlePost, addressProvince, addressDistrict, addressWard, priceItem, typeRoom, idPost, area, createDate, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image, totalView, totalFavorite, avgRating, acceptDate, statusHired, expiredDate, fullname, address, phoneNumber)
                            } else if (post.statusPost == "expired") {
                                p = renderExpiredPost(titlePost, addressProvince, addressDistrict, addressWard, priceItem, typeRoom, idPost, area, createDate, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image, totalView, totalFavorite, avgRating, acceptDate, expiredDate, fullname, address, phoneNumber)
                            } else if (post.statusPost == "block") {
                                p = renderBlockPost(titlePost, addressProvince, addressDistrict, addressWard, priceItem, typeRoom, idPost, area, createDate, postDuration, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image, fullname, phoneNumber, address)
                            } else {
                                p = renderExtendPost(titlePost, addressProvince, addressDistrict, addressWard, priceItem, typeRoom, idPost, area, createDate, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, locationRelate, contentPost, image, totalView, totalFavorite, avgRating, postDuration, fullname, address, phoneNumber)
                            }
                            document.getElementById("ketqua").innerHTML += p
                        }
                        getMoreInfo()
                    }
                )
            } 
        }
    )
}

loadPost()

// Button chấp nhận/khôi phục

// Cột phải
///////////////////////////////////////////////////////////////////////////////////////////////

// Đọc tất cả thông báo
function readAll() {
    notis = document.querySelectorAll('.noti-item');
    for (let i = 0; i < notis.length; i++) {
        notis[i].classList.remove('unread');
    }
    fetch("/readallnotification")
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                    }
                )
            }
        }
    )
}

// Đọc 1 thông báo
function read(elmt) {
    elmt.classList.toggle('unread');
    idNotification = elmt.children[1].children[1].innerHTML.substring(5) - 0
    if (elmt.classList.contains("unread")) {
        temp = "unreadnotification"
    } else {
        temp = "readnotification"
    }
    fetch("/"+temp+"/" + idNotification)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                    }
                )
            }
        }
    )
}

document.querySelectorAll("select").forEach(elmt => {
    elmt.onchange = loadPost()
})

fetch("/getProvinces")
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    provinces = data.provinces
                    for (var i = 0; i < provinces.length; i ++) {
                        document.getElementById("tinhthanh").innerHTML += 
                        '<option value="' + provinces[i] + '">' + provinces[i] + '</option>'                       
                    }
                }
            )
        }
    }
)

document.getElementById("tinhthanh").onchange = function() {
    province = document.getElementById("tinhthanh").value
    fetch("/getDistricts/" + province)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        districts = data.districts
                        document.getElementById("quanhuyen").innerHTML = '<option value="alldistrict">Tất cả quận, huyện</option>'
                        document.getElementById("xaphuong").innerHTML = '<option value="allward">Tất cả xã, phường</option>'
                        for (var i = 0; i < districts.length; i ++) {
                            document.getElementById("quanhuyen").innerHTML += 
                            '<option value="' + districts[i] + '">' + districts[i] + '</option>'                       
                        }
                    }
                )
            }
        }
    )
    loadPost()
}

document.getElementById("quanhuyen").onchange = function() {
    province = document.getElementById("tinhthanh").value
    district = document.getElementById("quanhuyen").value
    fetch("/getWards/" + province + "/" + district)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        wards = data.wards
                        document.getElementById("xaphuong").innerHTML = '<option value="allward">Tất cả xã, phường</option>'
                        for (var i = 0; i < wards.length; i ++) {
                            document.getElementById("xaphuong").innerHTML += 
                            '<option value="' + wards[i] + '">' + wards[i] + '</option>'                       
                        }
                    }
                )
            }
        }
    )
    loadPost()
}
document.getElementById("xaphuong").onchange = function() {
    loadPost()
}
document.getElementById("statusPost").onchange = function() {
    loadPost()
}
document.getElementById("sortDate").onchange = function() {
    loadPost()
}
document.getElementById("access").onchange = function() {
    loadPost()
}

setInterval(function() {
    fetch("/notification")
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        document.getElementById("thongbao").innerHTML = ""
                        for (var i = 0; i < data.length; i++) {
                            // console.log(data[i].titleNotification)
                            document.getElementById("thongbao").innerHTML += renderNotification(data[i].icon, data[i].titleNotification, data[i].content, data[i].time, data[i].id, data[i].status)
                        }
                    }
                )
            }
        }
    )
}, 3000);