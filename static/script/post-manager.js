// Load menu, footer
$('#menu').load('../static/page/menu-admin.html');
$('#footer').load('../static/page/footer.html');
///////////////////////////////////////////////////////////////////////////////////////////////

function readAll() {
    notis = document.querySelectorAll('.noti-item');
    for (let i = 0; i < notis.length; i++) {
        notis[i].classList.remove('unread');
    }
}

function read(elmt) {
    elmt.classList.toggle('unread');
}