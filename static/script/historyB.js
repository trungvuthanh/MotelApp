// Load menu
$('#menu').load('../static/page/menu-renter.html');

function removeImage(elmt) {
    elmt.parentNode.remove();
}


function saveFavourite(elmt) {
    if (elmt.classList.contains('red')) {
        elmt.classList.remove('red');
    } else {
        elmt.classList.add('red');
    }
    console.log("abc")
}

document.getElementById('delete-all-btn').onclick = function(){
    document.getElementById("list-view").innerHTML=""
}



// Load footer
$('#footer').load('../static/page/footer.html');