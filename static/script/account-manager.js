// Load menu, footer
$('#menu').load('../static/page/menu-admin.html');
$('#footer').load('../static/page/footer.html');
///////////////////////////////////////////////////////////////////////////////////////////////

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

// Button tìm kiếm
function search() {

}

// Hover đổi màu button
$('.button .btn-action').hover(function() {
	$(this).prev().css('color', '#ffffff');
	$(this).prev().css('background-color', '#212529');
});
$('.button .btn-action').mouseout(function() {
	$(this).prev().css('color', '#212529');
	$(this).prev().css('background-color', '#ffffff');
});

// Button mở/khóa chỉnh sửa
function edit(elmt) {
	if (elmt.previousElementSibling.childNodes[0].classList.contains('no-change')) {
		elmt.previousElementSibling.childNodes[0].classList.remove('no-change');
		elmt.innerHTML = 'Mở chỉnh sửa';
	} else {
		elmt.previousElementSibling.childNodes[0].classList.add('no-change');
		elmt.innerHTML = 'Khóa chỉnh sửa';
	}
}

// Button khóa
function block(elmt) {

}

// Button mở khóa
function unblock(elmt) {

}

// Button xóa
function remove(elmt) {

}

// Button chấp nhận
function accept(elmt) {

}

// Button từ chối
function refuse(elmt) {

}