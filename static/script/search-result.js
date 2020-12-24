function imgLoad(url, idPost) {
    return new Promise(function(fulfill, reject) {
        let image = new Image()
        image.onload = () => {
            fulfill([url, idPost, image]);
        }
        image.onerror = () => {
            reject(Error("didn\'t" ));
        }
        image.src = url;
        // let request = new XMLHttpRequest();
        // request.open('GET', url);
        // request.responseType = 'blob';
        // request.onload = function() {
        //     if (request.status === 200) {
        //         fulfill(request.response, idPost);
        //     } else {
        //         reject(Error("didn\'t" ));
        //     }
        // }
        // request.send();
    });
}

pathname = location.pathname;
temp = pathname.split('/');
$('#min_price').val(temp[6] - 0);
$('#max_price').val(temp[7] - 0);
document.getElementById('area_range').value = temp[9] - 0
document.getElementById('itemType').value = temp[1]
document.getElementById('area_range').onchange = function() {
    pathname = location.pathname
    temp = pathname.split('/')
    temp[9] = document.getElementById('area_range').value
    location.href = temp.join('/');
}
document.getElementById('itemType').onchange = function() {
    pathname = location.pathname
    temp = pathname.split('/')
    temp[1] = document.getElementById('itemType').value
    location.href = temp.join('/');
}

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
///////////////////////////////////////////////////////////////////////////////////////////////

// Lấy từ khóa từ session
document.getElementById('keyword').innerHTML = '"' + sessionStorage.getItem('keyword') + '"';

function formatMoney(amount, decimalCount = 0, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
    
        const negativeSign = amount < 0 ? "-" : "";
    
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
    
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};

var pageNumber = 1
statusItem = 0

function bodyLoadData(statusItem, sort) {
    alert(statusItem)
    if (statusItem == 0) {
        if (sort == "") {
            return {pageNumber: pageNumber}
        }
        return {pageNumber: pageNumber, sort: sort}
    } else {
        if (sort == "") {
            return {pageNumber: pageNumber, statusItem: statusItem}
        }
        return {pageNumber: pageNumber, statusItem: statusItem, sort: sort}
    }
}

function hasLinkPost(idPost, titlePost) {
    text_create = titlePost.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
                            .replace(/đ/g, "d")
                            .replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y")
                            .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u")
                            .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g,"o")
                            .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e")
                            .replace(/ì|í|ị|ỉ|ĩ/g,"i")
                            .replaceAll(' ', '-');
    text_create = text_create.toLowerCase() + '-' + idPost;
    return '/bai-dang/' + text_create; 
}

var favorite;
idList = {}
idList2 = {}
var sort = document.getElementById('order');
function loadData() {
    fetch(location.pathname, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(bodyLoadData(statusItem, sort.value)),
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
                        document.getElementById('keyword').innerHTML = '"' + data[1].stringSearch + '"'
                        data = data[0]
                        if (data.hasPrev == false) {
                            document.getElementById('btnPrev').disabled = true;
                        } else {
                            document.getElementById('btnPrev').disabled = false;
                        }
                        if (data.hasNext == false) {
                            document.getElementById('btnNext').disabled = true;
                        } else {
                            document.getElementById('btnNext').disabled = false;
                        }
                        idList = {}
                        idList2 = {}
                        document.getElementsByClassName('result-rows')[0].children[0].innerHTML = ''
                        for (var i = 0; i < data.listPost.length; i++) {
                            idList[i] = data.listPost[i].idPost;
                            idList2[data.listPost[i].idPost] = i 
                            result = '<div class="item-result border">' + 
                                        '<div class="item-img">' +
                                            '<img id="gif' + data.listPost[i].idPost + '" src="/static/image/loading.gif">' +
                                            '<img id="img' + data.listPost[i].idPost + '" src="" style="display: none">' +
                                            '<div class="item-favourite">' +
                                                '<i class="fas fa-heart" onclick="saveFavourite(this)"></i>' +
                                            '</div>' +
                                        '</div>' +
                                        '<a href="' + hasLinkPost(data.listPost[i].idPost, data.listPost[i].titlePost) + '"><div class="item-info">' +
                                            '<div>' +
                                                '<h6><b>' + data.listPost[i].titlePost +'</b></h6>' +
                                            '</div>' +
                                            '<p class="item-price">Giá phòng: ' + data.listPost[i].priceItem + ' đ/tháng</p>' +
                                            '<p>Địa chỉ: ' + data.listPost[i].address + '</p>' +
                                            '<p>Diện tích: ' + data.listPost[i].area + ' m2 - ' + data.listPost[i].numOfRoom + ' Phòng ngủ</p>' +
                                            '<p>Giá nước: ' + data.listPost[i].priceWater + ' - Giá điện: ' + data.listPost[i].priceElectric + '</p>' +
                                            '<p></p>' +
                                        '</div></a>' +
                                    '</div>'
                            document.getElementsByClassName('result-rows')[0].children[0].innerHTML += result;
                        }
                        if (typeAcc == 'renter') {
                            favorite = document.querySelectorAll('i');
                            for (var i = 0; i < favorite.length; i++) {
                                fetch('/isFavoritePost/' + idList[i])
                                .then(
                                    resp => {
                                        if (resp.status == 200) {
                                            resp.json()
                                            .then(
                                                data => {
                                                    if (data.isFavorite == true) {

                                                        favorite[idList2[data.idPost]].classList.add('red');
                                                    }
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        }
                        for (var i = 0; i < data.listPost.length; i++) {
                            fetch('/getImagePost/' + idList[i] + '/one')
                            .then(
                                resp => {
                                    if (resp.status == 200) {
                                        resp.json()
                                        .then(
                                            data => {
                                                imgLoad(data.image, data.idPost)
                                                .then(function(data) {
                                                    url = data[0]
                                                    idPost = data[1]
                                                    image = data[2]
                                                    let myImage = document.createElement("img");
                                                    // myImage.src = window.URL.createObjectURL(resp);
                                                    myImage.src = url
                                                    return [myImage, idPost];
                                                })
                                                .then (function(resp) {
                                                    myImage = resp[0];
                                                    idPost = resp[1];
                                                    document.getElementById('gif' + idPost).style.display = 'none';
                                                    document.getElementById('img' + idPost).style.display = 'block';
                                                    document.getElementById('img' + idPost).src = myImage.src;
                                                });
                                            }
                                        )
                                    }
                                }
                            )
                        }
                    }
                )
            }
        }
    )
}
loadData();

function updateStatusItem() {
    checkedBox = document.querySelectorAll("input[type='checkbox']:checked");
    sum = 0;
    for (var i = 0; i < checkedBox.length; i++) {
        sum += parseInt(checkedBox[i].value);
    }
    if (sum == 0 || sum == 3) {
        statusItem = 0;
    } else {
        statusItem = sum
    }
    loadData();
}

// Thanh trượt khoảng giá
$(document).ready(function() {
    // $('#min_price').val(1.8);
    // $('#max_price').val(20);
    $('#price_range').slider({
        range: true,
        min: 1.8,
        max: 20,
        values: [temp[6] - 0, temp[7] - 0],
        step: 0.1,
        slide:function(event, ui) {
            $('#price_show').html(ui.values[0] + ' - ' + ui.values[1] + ' triệu/tháng');
        },
        stop:function(event, ui) {
            $('#min_price').val(ui.values[0]);
            $('#max_price').val(ui.values[1]);
            pathname = location.pathname
            temp = pathname.split('/')
            temp[6] = $('#min_price').val();
            temp[7] = $('#max_price').val();
            location.href = temp.join('/');
        }
    });
});

// Lưu bài viết
function saveFavourite(elmt) {
    status = '';
    if (typeAcc == 'renter') {
        if (elmt.classList.contains('red')) {
            status = 'remove';
            // elmt.classList.remove('red');
            
        } else {
            status = 'add';
            // elmt.classList.add('red');
        }
        idx = -1;
        for (var i = 0; i < favorite.length; i++) {
            if (favorite[i] == elmt) {
                idx = i;
                break;
            }
        }
        fetch('/updateFavoritePost/' + idList[idx] + '/' + status)
        .then(
            resp => {
                if (resp.status == 200) {
                    resp.json()
                    .then(
                        data => {
                            if (data.result == 'success') {
                                if (status == 'add') {
                                    elmt.classList.add('red');
                                } else {
                                    elmt.classList.remove('red');
                                }
                            }
                        }
                    )
                }
            }
        )
    }
}

var searchInput = document.getElementsByClassName('search-input')[0].parentElement;
function changeWidth(x) {
    if (x.matches) {
        searchInput.className = 'col-md-12 p-1 flex-column';
    } else {
        searchInput.className = 'col-md-10 p-1 flex-column';
    }
}
var x = window.matchMedia("(max-width: 992px)");
changeWidth(x);
x.addListener(changeWidth);

// Query input
const searchWrapper = document.querySelector('.search-input');
const inputBox = searchWrapper.querySelector('input');
const suggBox = searchWrapper.querySelector('.autocom-box');
suggestions = []

// Tìm kiếm
function searchRaw() {
    keyword = document.getElementById('searchInput').value;
    sessionStorage.setItem('keyword', keyword); // Lưu từ khóa vào session
    room_type = document.getElementById('itemType').value;
    min_price = document.getElementById('min_price').value;
    max_price = document.getElementById('max_price').value;
    area_range = document.getElementById('area_range').value;
    location.href = '/' + room_type + '/dia-chi/' + keyword + '/0/gia/' + min_price + '/' + max_price + '/dien-tich-tu/' + area_range;
    
    // fetch('/tim-kiem', {
    //     method: "POST",
    //     credentials: "include",
    //     body: JSON.stringify({keyword: keyword, room_type: room_type, min_price: min_price, max_price: max_price, area_range: area_range}),
    //     cache: "no-cache",
    //     headers: new Headers({
    //         "content-type": "application/json"
    //     })
    // })
    // .then(
    //     resp => {
    //         if (resp.status == 200) {
    //             resp.json()
    //             .then(
    //                 data => {
    //                     if (data.result == "success") {
                            
    //                     } else {

    //                     }
    //                 }
    //             )
    //         }
    //     }
    // )
}

inputBox.onkeyup = (e) => {
    if (e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.keyCode != 13) {
        let userData = e.target.value;
        // console.log(userData);
        let emptyArray = [];
        
        if (userData) {
            fetch('/recommendSearch/' + userData)
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
                                // console.log(emptyArray);
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
            searchRaw();
        }
    } 
}

function showSuggestions(list) {
    let listData;
    // if (!list.length) {
    //     userValue = inputBox.value;
    //     listData = '<div>'+ userValue +'</div>';
    // } else {
    //     listData = list.join('');
    // }
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
    location.href = '/' + room_type + '/dia-chi/' + text_create + '/gia/' + min_price + '/' + max_price + '/dien-tich-tu/' + area_range;
}
// $(inputBox).focus(function() {
//     $(suggBox).css('opacity', 1);
//     $(suggBox).css('pointer-events', 'auto');
// });
// inputBox.onblur = function() {
//     suggBox.style.opacity = 0;
//     $(suggBox).css('pointer-events', 'none');
// }