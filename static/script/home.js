// Load menu, footer
var typeAcc;
fetch('/information-account')
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    typeAcc = data.typeAccount;
                    $('#menu').load('/static/page/menu-home-' + data.typeAccount + '.html');
                }
            )
        }
    }
)
$('#footer').load('../static/page/footer.html');

// Thanh trượt khoảng giá
$(document).ready(function() {
    $('#min_price').val(1.8);
    $('#max_price').val(20);
    $('#price_range').slider({
        range: true,
        min: 1.8,
        max: 20,
        values: [1.8, 20],
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

// Query input
const searchWrapper = document.querySelector('.search-input');
const inputBox = searchWrapper.querySelector('input');
const suggBox = searchWrapper.querySelector('.autocom-box');
suggestions = []

// Tìm kiếm
function searchRaw() {
    keyword = document.getElementById('searchInput').value;
    room_type = document.getElementById('itemType').value;
    min_price = document.getElementById('min_price').value;
    max_price = document.getElementById('max_price').value;
    area_range = document.getElementById('area_range').value;
    location.href = '../' + room_type + '/dia-chi/' + keyword + '/0/gia/' + min_price + '/' + max_price + '/dien-tich-tu/' + area_range;
}

inputBox.onkeyup = (e) => {
    if (e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.keyCode != 13) {
        let userData = e.target.value;
        let emptyArray = [];
        
        if (userData) {
            fetch('../recommendSearch/' + userData)
            .then(
                resp => {
                    if (resp.status == 200) {
                        resp.json()
                        .then(
                            data => {
                                suggestions = []
                                for (var i = 0; i < data.length; i++) {
                                    suggestions.push(data[i].address);
                                }
                                emptyArray = suggestions;
                                emptyArray = emptyArray.map((data) => {
                                    return data = '<div>'+ data +'</div>';
                                });
                                searchWrapper.classList.add('active');
                                showSuggestions(emptyArray);
                                let allList = suggBox.querySelectorAll('div');
                                for (let i = 0; i < allList.length; i++) {
                                    allList[i].setAttribute('onclick', 'searchSelect(this)');
                                }
                            }
                        )
                    }
                }
            )
        } else {
            searchWrapper.classList.remove('active');
        }
    } else {
        if (e.keyCode == 40) {
            if (document.querySelector('.pointed') == null) {
                suggBox.firstElementChild.classList.add('pointed');
                document.querySelector('.autocom-box').scrollIntoView(false);
            } else {
                if (document.querySelector('.pointed') == suggBox.lastElementChild) {
                    document.querySelector('.pointed').scrollIntoView(false);
                    document.querySelector('.pointed').classList.remove('pointed');
                    suggBox.firstElementChild.classList.add('pointed');
                    document.querySelector('.pointed').scrollIntoView(false);
                } else {
                    document.querySelector('.pointed').nextElementSibling.classList.add('pointed');
                    document.querySelector('.pointed').classList.remove('pointed');
                    document.querySelector('.autocom-box').scrollIntoView(false);
                    if (document.querySelector('.pointed') == suggBox.lastElementChild) {
                        document.querySelector('.pointed').scrollIntoView(false);
                    }
                }
            }
        } else if (e.keyCode == 38) {
            if (document.querySelector('.pointed') == null) {
                suggBox.lastElementChild.classList.add('pointed');
                document.querySelector('.pointed').scrollIntoView(false);
            } else {
                if (document.querySelector('.pointed') == suggBox.firstElementChild) {
                    document.querySelector('.pointed').classList.remove('pointed');
                    suggBox.lastElementChild.classList.add('pointed');
                    document.querySelector('.pointed').scrollIntoView(false);
                } else {
                    var nodes = document.querySelectorAll('.pointed');
                    document.querySelector('.pointed').previousElementSibling.classList.add('pointed');
                    nodes[nodes.length - 1].classList.remove('pointed');
                    document.querySelector('.autocom-box').scrollIntoView(false);
                    if (document.querySelector('.pointed') == suggBox.firstElementChild) {
                        document.querySelector('.pointed').scrollIntoView(false);
                    }
                }
            }
        } else if (e.keyCode == 13) {
            if (document.querySelector('.pointed') != null) searchSelect(document.querySelector('.pointed'));
            else
            searchRaw();

        }
    } 
}

function showSuggestions(list) {
    let listData;
    listData = list.join('');
    suggBox.innerHTML = listData;
}
function searchSelect(elmt) {
    keyword = elmt.textContent.toLowerCase();
    text_create = keyword.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g,"o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g,"i");
    text_create = text_create.toLowerCase().split(', ');
    if (text_create.length == 1) {
        text_create = text_create[0].replaceAll(' ', '-') + '/1';
    } else {
        text_create = text_create[1].replaceAll(' ', '-') + '/' + text_create[0].replaceAll(' ', '-')
    }
    room_type = document.getElementById('itemType').value;
    min_price = document.getElementById('min_price').value;
    max_price = document.getElementById('max_price').value;
    area_range = document.getElementById('area_range').value;
    location.href = '../' + room_type + '/dia-chi/' + text_create + '/gia/' + min_price + '/' + max_price + '/dien-tich-tu/' + area_range;
}

// Chuyển giữa các tab gợi ý
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
