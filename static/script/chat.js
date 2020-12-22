// Load menu
$('#menu').load('../static/page/menu-admin.html');

// 
// $('#searchOwner').load('../static/page/searchOwner.html');

$("#search-owner").focus(function() { 
    $(".search-result").css("display", "block"); 
    $(".history-chat").css("display", "none"); 
});
$("#search-owner").blur(function() { 
    $(".search-result").css("display", "none");
    $(".history-chat").css("display", "block"); 
});

document.querySelectorAll(".each-message-history").forEach(element => {
    element.onclick = function() {
        document.querySelectorAll(".each-message-history").forEach(element => {
            element.classList.remove("active")
        });
        this.classList.add("active")
    }   
});


// Load footer
$('#footer').load('../static/page/footer.html');