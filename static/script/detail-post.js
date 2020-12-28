var typeAcc;
var userFullname;
var typeAvt;
// Load menu, footer
fetch('/information-account')
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    typeAcc = data.typeAccount;
                    userFullname = data.fullname;
                    typeAvt = data.typeAvt;
                    $('#menu').load('/static/page/menu-' + data.typeAccount + '.html');
                    if (typeAcc != 'guest') {
                        document.getElementById('sessionRenterImageID').src = '/static/image/' + data.typeAvt + '.png';
                    } else {
                        document.getElementById('sessionRenterImageID').src = '/static/image/icon-account.png';
                    }                    
                }
            )
        }
    }
)
$('#footer').load('/static/page/footer.html');
///////////////////////////////////////////////////////////////////////////////////////////////

function formatMoney(amount) {
    try {
        result = amount.toString().split('.');
        if (result.length == 1) {
            return result + '.000.000'
        } else {
            return result[0] + '.' + result[1].padEnd(3, '0') + '.000'
        }
    } catch (e) {
        console.log(e)
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
function handleBep(status) {
    if (status == "khubeprieng") {
        return "Khu bếp riêng"
    } else if (status == "khubepchung") {
        return "Khu bếp chung"
    } else {
        return "Không nấu ăn"
    }
}

function imgLoad(url) {
    return new Promise(function(fulfill, reject) {
        let image = new Image()
        image.onload = () => {
            fulfill([url, image]);
        }
        image.onerror = () => {
            reject(Error("didn\'t" ));
        }
        image.src = url;
    });
}

fetch('/thong-tin-bai-dang/' + location.pathname.split('/')[2])
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    if (data.statusPost == 'active') {
                        idPost = data.idPost;
                        for (var image of data.images) {
                            imgLoad(image)
                            .then(function(data) {
                                url = data[0];
                                image = data[1];
                                let myImage = document.createElement("img");
                                myImage.className = 'mySlides';
                                myImage.src = url;
                                return myImage;
                            })
                            .then (function(resp) {
                                myImage = resp;
                                document.querySelector('.main-img').appendChild(myImage);
                                document.querySelector('.mySlides').style.display = 'block';
                            });
                        }
                        document.getElementById('gif').remove();
                        document.getElementById('fullname').innerHTML = data.nameAuthor;
                        document.getElementById('phoneNumber').innerHTML = data.phoneNumberAuthor;
                        document.getElementById('addressAuthor').innerHTML = data.addressAuthor
                        document.getElementById('createDate').innerHTML = data.createDate.split('-').reverse().join('/');
                        document.getElementById('expireDate').innerHTML = data.expireDate.split('-').reverse().join('/');
                        if (typeAcc == 'renter') {
                            fetch('/isFavoritePost/' + idPost)
                            .then(
                                resp => {
                                    if (resp.status == 200) {
                                        resp.json()
                                        .then(
                                            data => {
                                                if (data.isFavorite == true) {
                                                    document.getElementById('saveBtn').className = 'fas fa-heart';
                                                } else {
                                                    document.getElementById('saveBtn').className = 'far fa-heart';
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                        }
                        document.getElementById('titlePost').innerHTML = data.titlePost;
                        document.getElementById('addressDetail').innerHTML = data.addressDetail;
                        document.getElementById('address').innerHTML = data.addressWard + ', ' + data.addressDistrict + ', ' + data.addressProvince;
                        document.getElementById('statusHired').innerHTML = (data.statusHired == 'ready') ? 'Chưa thuê' : 'Đã thuê';
                        document.getElementById('views').innerHTML = data.totalView;
                        document.getElementById('likes').innerHTML = data.totalFavorite;
                        document.getElementById('itemType').innerHTML = handleTypeRoom(data.itemType);
                        document.getElementById('statusItem').innerHTML = (data.statusItem == 'chungchu') ? 'Chung chủ' : 'Không chung chủ';
                        document.getElementById('priceWater').innerHTML = data.priceWater;
                        document.getElementById('priceElectric').innerHTML = data.priceElectric;
                        document.getElementById('area').innerHTML = data.area;
                        document.getElementById('priceItem').innerHTML = formatMoney(data.priceItem);
                        document.getElementById('numOfRoom').innerHTML = data.numOfRoom;
                        document.getElementById('kitchen').innerHTML = handleBep(data.kitchen);
                        document.getElementById('bathroomType').innerHTML = (data.bathroom.split(' ')[0] == 'khepkin') ? 'WC Khép kín' : 'WC Không khép kín';
                        document.getElementById('bathroomWater').innerHTML = (data.bathroom.split(' ')[1] == 'nonglanh') ? 'Nóng lạnh' : 'Không nóng lạnh';
                        document.getElementById('aircondition').innerHTML = (data.aircondition == 1) ? 'Điều hòa' : 'Không điều hòa';
                        document.getElementById('balcony').innerHTML = (data.balcony == 1) ? 'Ban công' : 'Không ban công';
                        utilityRow = document.querySelector('.utility-row-other');
                        utility = utilityRow.querySelectorAll('img');
                        for (var i in data.otherUtility.split(' ')) {
                            if (data.otherUtility.split(' ')[i] == 0) {
                                utility[i].style.opacity = 0.3;
                            }
                        }
                        document.getElementById('contentPost').innerHTML = data.contentPost;
                        fetch('/guestOrRenterGetReView/' + idPost)
                        .then(
                            resp => {
                                if (resp.status == 200) {
                                    resp.json()
                                    .then(
                                        data => {
                                            var comment = '';
                                            for (var i = 0; i < data.length; i++) {
                                                star = '';
                                                for (var j = 0; j < data[i].stars; j++) {
                                                    star += '<img src="/static/image/star-fill.png">';
                                                }
                                                if (5 - data[i].stars > 0) {
                                                    for (var j = 0; j < 5 - data[i].stars; j++) {
                                                        star += '<img src="/static/image/star-unfill.png">';
                                                    }
                                                }
                                                comment = 
                                                    '<div class="each-comment row pt-3">' +
                                                        '<div class="col-sm-1">' +
                                                            '<img class="renterImageID" src="/static/image/' + data[i].typeAvt + '.png">' +
                                                        '</div>' +
                                                        '<div class="col-sm-11">' +
                                                            '<div class="row info-guest">' +
                                                                '<div class="col-sm-6 pt-2 pl-0">' +
                                                                    '<p><b>' + data[i].fullname + '</b></p>' +
                                                                    '<div class="hidden-stars bg-success text-white text-center rounded mr-3">' +
                                                                        '<span>' + data[i].stars + '</span>' +
                                                                    '</div>' +
                                                                '</div>' +
                                                                '<div class="col-sm-6 rating-history py-2">' +
                                                                    '<div class="stars">' +
                                                                        star +
                                                                    '</div>' +
                                                                '</div>' +
                                                            '</div>' +
                                                            '<div>' +
                                                                '<p class="mb-2">' + data[i].content + '</p>' +
                                                            '</div>' +
                                                            '<p class="mb-2">' + data[i].time.split(' ')[0].split('-').reverse().join('-') + '</p>' +
                                                        '</div>' +
                                                    '</div>' +
                                                    '<div class="border"></div>'
                                                document.querySelector('.guest-comment').innerHTML += comment;
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    } else {
                        alert('Bài đăng không khả dụng');
                        location.href = '/';
                    }
                }
            )
        }
    }
);

// Image slideshow
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function currentDiv(n) {
    showDivs(slideIndex = n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[slideIndex-1].style.display = "block";
}
///////////////////////////////////////////////////////////////////////////////////////////////

// Nút 'Báo cáo' mở hộp thoại báo cáo
$('.button-rp').click(function() {
    $('#blur').addClass('active');
    $('#popup-report').addClass('active');
});
// Nút 'X' tắt hộp thoại báo cáo
$('.rp-close').click(function() {
    $('#blur').removeClass('active');
    $('#popup-report').removeClass('active');
});
var fakeInfo = 0;
var fakePrice = 0;
// Đánh dấu/bỏ đánh dấu lý do 1
document.getElementById('lyDo1').onclick = function() {
    if (this.classList.contains('btnChecked')) {
        fakeInfo = 0;
        this.classList.remove('btnChecked');
    } else {
        fakeInfo = 1;
        this.classList.add('btnChecked');
    }
}
// Đánh dấu/bỏ đánh dấu lý do 2
document.getElementById('lyDo2').onclick = function() {
    if (this.classList.contains('btnChecked')) {
        fakePrice = 0;
        this.classList.remove('btnChecked');
    } else {
        fakePrice= 1;
        this.classList.add('btnChecked');
    }
}

// Gửi báo cáo
function sendRp() {
    if (typeAcc == 'renter') {
        var content = document.getElementById('otherReason').value;
        fetch('/sendreport/' + idPost + '/' + fakeInfo + '/' + fakePrice , {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({content: content}),
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
                            if (data.message == "success") {
                                alert("Gửi báo cáo thành công!");
                            } else {
                                alert("Gửi báo cáo thất bại!");
                            }
                        }
                    )
                } else alert("Gửi báo cáo thất bại.")
            }
        )
    } else {
        alert("Bạn cần đăng nhập để thực hiện điều này");
    }
    
}
///////////////////////////////////////////////////////////////////////////////////////////////

// Lưu bài viết
function saveFavourite() {
    if (typeAcc == 'renter') {
        status = '';
        post = document.getElementById('saveBtn');
        if (post.classList.contains('fas')) {
            status = 'remove';
        } else {
            status = 'add';
        }
        fetch('/updateFavoritePost/' + idPost + '/' + status)
        .then(
            resp => {
                if (resp.status == 200) {
                    resp.json()
                    .then(
                        data => {
                            if (data.result == 'success') {
                                if (status == 'add') {
                                    post.className = 'fas fa-heart';
                                } else {
                                    post.className = 'far fa-heart';
                                }
                            }
                            fetch('/thong-tin-bai-dang/' + location.pathname.split('/')[2])
                            .then(
                                resp => {
                                    if (resp.status == 200) {
                                        resp.json()
                                        .then(
                                            data => {
                                                document.getElementById('likes').innerHTML = data.totalFavorite;
                                            }
                                        )
                                    }
                                }
                            )
                        }
                    )
                }
            }
        );
    } else {
        alert("Bạn cần đăng nhập để thực hiện điều này");
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////

// Đánh giá sao
var status = 0;
var index = 0;
function ratedhover(elmt) {
    status = 2;
    for (var j = 1; j <= 5; j++) {
        document.getElementById('s' + j).src = "../static/image/star-unfill.png";
    }
    var id = parseInt(elmt.id[1]);
    for (var i = 1; i <= id; i++) {
        document.getElementById('s' + i).src = "../static/image/star-fill.png";
    }
}

function rated(elmt) {
    if (status == 1) {
        for (var j = 1; j <= 5; j++) {
            document.getElementById('s' + j).src = "../static/image/star-unfill.png";
        }
        status = 0;
    } else {
        status = 1;
        for (var j = 1; j <= 5; j++) {
            document.getElementById('s' + j).src = "../static/image/star-unfill.png";
        }
        var id = parseInt(elmt.id[1]);
        for (var i = 1; i <= id; i++) {
            document.getElementById('s' + i).src = "../static/image/star-fill.png";
        }
        index = id;
    }
}

function unrate(elmt) {
    var id = parseInt(elmt.id[1]);
    if (status == 2) {
        status = 1;
        for (var j = 1; j <= 5; j++) {
            document.getElementById('s' + j).src = "../static/image/star-unfill.png";
        }
        for (var i = 1; i <= index; i++) {
            document.getElementById('s' + i).src = "../static/image/star-fill.png";
        }
    }
}



// Gửi bình luận
function review() {
    stars = 0;
    rating = document.querySelector('#rate');
    starCheck = rating.querySelectorAll('img');
    for (var i = 0; i < 5; i++) {
        if (starCheck[i].src.includes('star-fill.png')) stars++;
    }
    content = document.getElementById('commentText').value;
    if ((stars > 0 && stars <= 5) && content != '') {
        fetch('/sendReview/' + idPost + '/' + stars + '/' + content, {
            method: "POST",
            credentials: "include",
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
                            if (data.message == "ok") {
                                alert("Thành công!");
                                $('.rate-status').show();
                            } else {

                            }
                        }
                    )
                }
            }
        )
    } else if (stars > 0 && content == '') {
        alert('Vui lòng nhập bình luận để đánh giá');
    } else if (stars == 0 && content != '') {
        alert('Vui lòng xếp hạng sao để đánh giá');
    } else { // stars == 0 && content == ''
        alert('Vui lòng xếp hạng sao và nhập bình luận để đánh giá');
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////