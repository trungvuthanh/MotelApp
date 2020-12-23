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

function renderImageRead (typeRead, typeAvt) {
    if (typeRead == "read") {
        return "" 
    } else if (typeRead =="read-recent") {
        return '<img class="status-message-read-recent" src="' + typeAvt + '.png">'
    } else if (typeRead == "unread") {
        return '<img class="status-message" src="../static/image/unread.png">'
    } else if (typeRead == "loading-message") {
        return '<img class="status-message" src="../static/image/loading-message.png">'
    }
}


function renderMessageToHTML(sender, text, typeRead, typeAvt) {
    if (sender == "you") {
        return '<div class="col-sm-12 mt-1">' +
                    '<div class="row">' +
                        '<div class="col-sm-1 pl-0 pr-0">' +
                            '<img class="avatarOwner" src="' + typeAvt + '.png">' +
                        '</div>' +
                        '<div class="col-sm-8 mt-0 pl-0">' +                     
                            '<div class="chatFromYou">'+ text +'</div>' + 
                        '</div>' + 
                        '<div class="col-sm-3 each-message">' + renderImageRead(typeRead, typeAvt) + '</div>' +
                    '</div>' +
                '</div>'
    } else if (sender == "me") {
        return '<div class="col-sm-12 mt-2">' +
                    '<div class="row m-0">' +
                        '<div class="col-sm-4 pl-0"></div>' +
                        '<div class="col-sm-8 pl-2 pr-2 pt-1">' +
                            '<span class="chatFromMe ">' + text + '</span>' +                          
                            renderImageRead(typeRead, typeAvt) +               
                        '</div>' + 
                    '</div>' +
                '</div>' 
    }
}

function autoScroll() {
    $('#message-right').animate({
        scrollTop: $('#message-right').get(0).scrollHeight
    }, 100);
}
autoScroll()


function sendMessage() {
    typeAvt = document.getElementById("avtOwner").src.replace (/[^\d.]/g,''); 
    text = document.getElementById("input-message").value
    document.getElementById("input-message").value = ""
    sender = "me"
    typeRead = "loading-message"
    console.log(renderMessageToHTML(sender, text, typeRead, typeAvt) )
    if (text.trim() != "") {
        document.getElementById("message-right").innerHTML += renderMessageToHTML(sender, text, typeRead, typeAvt) 
        autoScroll()
        document.getElementById("input-message").focus()
    }
    // Sau này call API

}


document.getElementById("send-message").onclick = ()=> {
    sendMessage()
}

$(document.getElementById("input-message")).keypress((e) => {
    if (e.keyCode == 13) {
        sendMessage()
    }
});
document.getElementsByClassName("send-message").onclick = renderMessageToHTML()

document.querySelectorAll(".each-message-history").forEach(element => {
    element.onclick = function() {
        document.querySelectorAll(".each-message-history").forEach(element => {
            element.classList.remove("active-chat")
        });
        this.classList.add("active-chat")
    }   
});


// Load footer
$('#footer').load('../static/page/footer.html');