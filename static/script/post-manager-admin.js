// Load menu, footer
$('#menu').load('../static/page/menu-admin.html');
$('#footer').load('../static/page/footer.html');
///////////////////////////////////////////////////////////////////////////////////////////////

// Cột trái
///////////////////////////////////////////////////////////////////////////////////////////////

// Truy cập Bộ lọc bài đăng
if ($("select[name='status'] option:selected").val() == "handling") {
    for (let optDisabled of $("select[name='sortDate'] option")) {
        if ($(optDisabled).val() == 'acceptDateASC'
            || $(optDisabled).val() == 'acceptDateDESC'
            || $(optDisabled).val() == 'expireDateASC'
            || $(optDisabled).val() == 'expireDateDESC') {
                $(optDisabled).attr('disabled', true);
        } else if ($(optDisabled).val() == 'createDateASC'
                || $(optDisabled).val() == 'createDateDESC') {
                    $(optDisabled).attr('disabled', false);
        }
    }
    $("select[name='statistic']").attr('disabled', true);
    $("select[name='statistic']").css('cursor', 'default');
} else if ($("select[name='status'] option:selected").val() != "handling") {
    $("select[name='statistic']").attr('disabled', false);
    $("select[name='statistic']").css('cursor', 'pointer');
}
$("select[name='status']").click(function() {
    if ($("select[name='status'] option:selected").val() == "handling") {
        for (let optDisabled of $("select[name='sortDate'] option")) {
            if ($(optDisabled).val() == 'acceptDateASC'
                || $(optDisabled).val() == 'acceptDateDESC'
                || $(optDisabled).val() == 'expireDateASC'
                || $(optDisabled).val() == 'expireDateDESC') {
                    $(optDisabled).attr('disabled', true);
            } else if ($(optDisabled).val() == 'createDateASC'
                    || $(optDisabled).val() == 'createDateDESC') {
                        $(optDisabled).attr('disabled', false);
            }
        }
        $("select[name='statistic']").attr('disabled', true);
        $("select[name='statistic']").css('cursor', 'default');
    } else if ($("select[name='status'] option:selected").val() == "active") {
        for (let optDisabled of $("select[name='sortDate'] option")) {
            if ($(optDisabled).val() == 'createDateASC'
                || $(optDisabled).val() == 'createDateDESC') {
                    $(optDisabled).attr('disabled', true);
            } else if ($(optDisabled).val() == 'acceptDateASC'
                    || $(optDisabled).val() == 'acceptDateDESC'
                    || $(optDisabled).val() == 'expireDateASC'
                    || $(optDisabled).val() == 'expireDateDESC') {
                        $(optDisabled).attr('disabled', false);
            }
        }
        $("select[name='statistic']").attr('disabled', false);
        $("select[name='statistic']").css('cursor', 'pointer');
    } else if ($("select[name='status'] option:selected").val() == "expired") {
        for (let optDisabled of $("select[name='sortDate'] option")) {
            if ($(optDisabled).val() == 'createDateASC'
                || $(optDisabled).val() == 'createDateDESC') {
                    $(optDisabled).attr('disabled', true);
            } else if ($(optDisabled).val() == 'acceptDateASC'
                    || $(optDisabled).val() == 'acceptDateDESC'
                    || $(optDisabled).val() == 'expireDateASC'
                    || $(optDisabled).val() == 'expireDateDESC') {
                        $(optDisabled).attr('disabled', false);
            }
        }
        $("select[name='statistic']").attr('disabled', true);
        $("select[name='statistic']").css('cursor', 'default');
    } else if ($("select[name='status'] option:selected").val() == "extend") {
        for (let optDisabled of $("select[name='sortDate'] option")) {
            if ($(optDisabled).val() == 'createDateASC'
                || $(optDisabled).val() == 'createDateDESC') {
                    $(optDisabled).attr('disabled', true);
            } else if ($(optDisabled).val() == 'acceptDateASC'
                    || $(optDisabled).val() == 'acceptDateDESC'
                    || $(optDisabled).val() == 'expireDateASC'
                    || $(optDisabled).val() == 'expireDateDESC') {
                        $(optDisabled).attr('disabled', false);
            }
        }
        $("select[name='statistic']").attr('disabled', true);
        $("select[name='statistic']").css('cursor', 'default');
    } else if ($("select[name='status'] option:selected").val() == "refuse") {
        for (let optDisabled of $("select[name='sortDate'] option")) {
            if ($(optDisabled).val() == 'acceptDateASC'
                || $(optDisabled).val() == 'acceptDateDESC'
                || $(optDisabled).val() == 'expireDateASC'
                || $(optDisabled).val() == 'expireDateDESC') {
                    $(optDisabled).attr('disabled', true);
            } else if ($(optDisabled).val() == 'createDateASC'
                    || $(optDisabled).val() == 'createDateDESC') {
                        $(optDisabled).attr('disabled', false);
            }
        }
        $("select[name='statistic']").attr('disabled', true);
        $("select[name='statistic']").css('cursor', 'default');
    } else if ($("select[name='status'] option:selected").val() == "admin") {
        for (let optDisabled of $("select[name='sortDate'] option")) {
            if ($(optDisabled).val() == 'acceptDateASC'
                || $(optDisabled).val() == 'acceptDateDESC'
                || $(optDisabled).val() == 'expireDateASC'
                || $(optDisabled).val() == 'expireDateDESC') {
                    $(optDisabled).attr('disabled', true);
            } else if ($(optDisabled).val() == 'createDateASC'
                    || $(optDisabled).val() == 'createDateDESC') {
                        $(optDisabled).attr('disabled', false);
            }
        }
        $("select[name='statistic']").attr('disabled', false);
        $("select[name='statistic']").css('cursor', 'pointer');
    }
});

// Truy cập Bộ lọc địa chỉ
if ($("select[name='city'] option:selected").val() == "allcity") {
    $("select[name='district']").attr('disabled', true);
    $("select[name='district']").css('cursor', 'default');
    $("select[name='ward']").attr('disabled', true);
    $("select[name='ward']").css('cursor', 'default');
} else if ($("select[name='city'] option:selected").val() != "allcity") {
    $("select[name='district']").attr('disabled', false);
    $("select[name='district']").css('cursor', 'pointer');
}
$("select[name='city']").click(function() {
    if ($("select[name='city'] option:selected").val() == "allcity") {
        $("select[name='district']").attr('disabled', true);
        $("select[name='district']").css('cursor', 'default');
        $("select[name='ward']").attr('disabled', true);
        $("select[name='ward']").css('cursor', 'default');
    } else if ($("select[name='city'] option:selected").val() != "allcity") {
        $("select[name='district']").attr('disabled', false);
        $("select[name='district']").css('cursor', 'pointer');
    }
});
$("select[name='district']").click(function() {
    if ($("select[name='district'] option:selected").val() == "alldistrict") {
        $("select[name='ward']").attr('disabled', true);
        $("select[name='ward']").css('cursor', 'default');
    } else if ($("select[name='district'] option:selected").val() != "alldistrict") {
        $("select[name='ward']").attr('disabled', false);
        $("select[name='ward']").css('cursor', 'pointer');
    }
});

// Mở rộng thêm thông tin
$('.read-more').click(function() {
    fetch('/', {

    })
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
    $(this).parent().parent().next().next().slideToggle(500);
    if ($(this).children().hasClass('fas fa-caret-down')) {
        $(this).children().removeClass('fas fa-caret-down');
        $(this).children().addClass('fas fa-caret-up');
    } else {
        $(this).children().removeClass('fas fa-caret-up');
        $(this).children().addClass('fas fa-caret-down');
    }
});

// Đánh dấu cho thuê
$('.hire-status').click(function() {
    $(this).toggleClass('hired');
    if ($('.hire-status').hasClass('hired')) {
        $(this).parent().prev().html('Đã thuê');
    } else {
        $(this).parent().prev().html('Chưa thuê');
    }
});

// Button chấp nhận/khôi phục
function accept(elmt) {

}

// Button từ chối
function refuse(elmt) {

}

// Button xóa
function remove(elmt) {
    
}

// Cột phải
///////////////////////////////////////////////////////////////////////////////////////////////

// Đọc tất cả thông báo
function readAll() {
    notis = document.querySelectorAll('.noti-item');
    for (let i = 0; i < notis.length; i++) {
        notis[i].classList.remove('unread');
    }
}

// Đọc 1 thông báo
function read(elmt) {
    elmt.classList.toggle('unread');
}