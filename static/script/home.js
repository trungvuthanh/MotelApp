$('#menu').load('../static/page/menu-home.html');


// Menu
window.addEventListener('scroll', function() {
    if (window.scrollY > 0) {
        document.getElementById('head-menu').className = "navbar navbar-expand-md navbar-light sticky";
    } else {
        document.getElementById('head-menu').className = "navbar navbar-expand-md navbar-light";
    }
});

// Thanh trượt khoảng giá
$(document).ready(function() {
    $('#price_range').slider({
        range: true,
        min: 1.8,
        max: 20,
        values: [3, 10],
        step: 0.2,
        slide:function(event, ui) {
            $('#price_show').html(ui.values[0] + ' - ' + ui.values[1] + ' triệu/tháng');
        },
        stop:function(event, ui) {
            $('#min_price').val(ui.values[0]);
            $('#max_price').val(ui.values[1]);
        }
    });
});

// Tìm kiếm
function search() {
    keyword;
    room_type;
    min_price = $('#min_price').val();
    max_price = $('#max_price').val();
    area_range;
    fetch('/tim-kiem', {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({keyword: keyword, room_type: room_type, min_price: min_price, max_price: max_price, area_range: area_range}),
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

let tabHeader = document.getElementsByClassName("tab-header")[0];
let tabIndicator = document.getElementsByClassName("tab-indicator")[0];
let tabBody = document.getElementsByClassName("tab-body")[0];

let tabsPane = tabHeader.getElementsByTagName("div");

for (let i=0; i<tabsPane.length; i++){
 	tabsPane[i].addEventListener("click", function() {
		tabHeader.getElementsByClassName("tab-active-head")[0].classList.remove("tab-active-head");
		tabsPane[i].classList.add("tab-active-head");
		tabBody.getElementsByClassName("tab-active-body")[0].classList.remove("tab-active-body");
		tabBody.getElementsByClassName("tab-content")[i].classList.add("tab-active-body");

		tabIndicator.style.left = `calc(calc(100% / 4) * ${i})`;
	});
}

$('#footer').load('../static/page/footer.html');