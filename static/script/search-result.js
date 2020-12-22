// Load menu, footer
$('#menu').load('../static/page/menu-guest.html');
$('#footer').load('../static/page/footer.html');
///////////////////////////////////////////////////////////////////////////////////////////////

// Thanh trượt khoảng giá
$(document).ready(function() {
    $('#price_range').slider({
        range: true,
        min: 1.8,
        max: 20,
        values: [1.8, 20],
        step: 0.1,
        slide:function(event, ui) {
            $('#price_show').html(ui.values[0] + ' - ' + ui.values[1] + ' triệu/tháng');
        },
        stop:function(event, ui) {
            $('#min_price').val(ui.values[0]);
            $('#max_price').val(ui.values[1]);
            filter();
        }
    });
});

// Lưu bài viết
function saveFavourite(elmt) {
    if (elmt.classList.contains('red')) {
        elmt.classList.remove('red');
    } else {
        elmt.classList.add('red');
    }
}

function filter() {

}

function search() {

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