// Load menu, footer
$('#menu').load('../static/page/menu-owner.html');
$('#footer').load('../static/page/footer.html');
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
    } else if ($("select[name='status'] option:selected").val() == "reported") {
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

// Mở rộng thêm thông tin
$('.read-more').click(function() {
    $(this).parent().parent().next().slideToggle(500);
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

// Đổi giá gia hạn
$("select[name='duration']").click(function() {
    let price = $(this).parent().next().children()[1];
    switch ($("select[name='duration'] option:selected").val()) {
        case '7':
            $(price).html('50,000 VNĐ');
            break;
        case '30':
            $(price).html('100,000 VNĐ');
            break;
        case '90':
            $(price).html('200,000 VNĐ');
            break;
        case '180':
            $(price).html('300,000 VNĐ');
            break;
        case '365':
            $(price).html('400,000 VNĐ');
            break;
        default:
            $(price).html('50,000 VNĐ');
    }
});

// Chuyển đến trang chỉnh sửa
function edit(elmt) {

}

// Trả phí gia hạn
function pay(elmt) {

}

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