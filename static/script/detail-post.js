// Load menu
$('#menu').load('../static/page/menu-admin.html');
///////////////////////////////////////////////////////////////////////////////////////////////

// Ảnh bài đăng
///////////////////////////////////////////////////////////////////////////////////////////////

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

// Thông tin người đăng
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

// Đánh dấu/bỏ đánh dấu lý do 1
$('#lyDo1').click(function() {
    $('#lyDo1').toggleClass('btnChecked');
    if ($('#lyDo1').hasClass('btnChecked')) {
        $('#lyDo1').val('report1');
    } else $('#lyDo1').val("");
});
// Đánh dấu/bỏ đánh dấu lý do 2
$('#lyDo2').click(function() {
    $('#lyDo2').toggleClass('btnChecked');
    if ($('#lyDo2').hasClass('btnChecked')) {
        $('#lyDo2').val('report2');
    } else $('#lyDo2').val("");
});



// Gửi báo cáo
function sendRp() {
    var content = [];
    var checkedRp = Array.from(document.querySelectorAll('.btnChecked'));
    for (var i = 0; i < checkedRp.length; i++) {
        content.push(checkedRp[i].value)
    }
    var textReasons = document.getElementById('otherReason').value;
    if (textReasons != "") content.push(textReasons);
    idPost = 1;
    usernameRenter = "renter1";
    fetch('/gui-bao-cao', {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({idPost: idPost, usernameRenter: usernameRenter, content: content}),
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
                        if (data.result == "success") {
                            alert("Gửi báo cáo thành công!")
                        } else {

                        }
                    }
                )
            } else alert("Gửi báo cáo thất bại.")
        }
    )
}
///////////////////////////////////////////////////////////////////////////////////////////////

// Lưu tin
function saveFavourite() {
    // API trả về idPost, trạng thái lưu/không lưu
    var save = document.getElementById('saveBtn');
    if (save.classList.contains('far')) {
        save.classList.remove('far');
        save.classList.add('fas');
        isSaved = true;
    }   else {
        save.classList.remove('fas');
        save.classList.add('far');
        isSaved = false;
    }
    // isSaved = true: lưu bài đăng
    // isSaved = false: không lưu bài đăng
    idPost = 1;
    fetch('/luu-bai-dang', {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({idPost: idPost, isSaved: isSaved}),
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
                        if (data.result == "success") {
                            alert("Thành công!")
                        } else {

                        }
                    }
                )
            }
        }
    )
}
///////////////////////////////////////////////////////////////////////////////////////////////

// Thông tin chi tiết bài đăng
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
        $('.rate-status').show();
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

// Gửi đánh giá sao
///////////////////////////////////////////////////////////////////////////////////////////////

// Gửi bình luận
function binhLuan() {
    var comment = "";
    reason += "<div>" + document.getElementById('#commentText').value + "<div>";
    fetch('/gui-binh-luan', {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({comment: comment}),
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
                        if (data.result == "success") {
                            alert("Thành công!")
                        } else {

                        }
                    }
                )
            }
        }
    )
}
///////////////////////////////////////////////////////////////////////////////////////////////

// Load bình luận active
///////////////////////////////////////////////////////////////////////////////////////////////

// Load footer
$('#footer').load('../static/page/footer.html');
