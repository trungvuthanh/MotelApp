// Load menu
$('#menu').load('../static/page/menu-admin.html');

// 
// $('#searchOwner').load('../static/page/searchOwner.html');

function renderEachResultSearch(typeAvt, fullName, username, hasBorderBottom) {
    temp = ""
    if (hasBorderBottom) {
        temp = " border-bottom"
    }
    return '<div class="col-sm-12 m-1'+ temp +'" id="res'+username+'">' +
                '<div class="row">' +
                    '<div class="col-sm-2 pl-0 pt-1">'+
                        '<img class="avatarOwner" src="../static/image/'+typeAvt+'.png">'+
                    '</div>'+
                    '<div class="col-sm-10 name p-1">'+
                        '<b>'+fullName+'</b>'+
                    '</div>'+
                '</div>'+
            '</div>'
}

function handleDate(stringDate) {
    stringDate = stringDate.split("-")
    return stringDate[2] + "/" + stringDate[1] + "/" + stringDate[0]
}



function renderEachElementOfListChat(isMe, classElement, typeAvt, fullName, message, hasBorderBottom, username, time) {
    // classElement in ["", "active-chat", "unread"]
    temp = ""
    if (hasBorderBottom) {
        temp = "border-bottom "
    }
    if (isMe) {
        isMe = "You: "
    } else {
        isMe = ""
    }
    return '<div class="col-sm-12 m-1 '+temp +'each-message-history '+classElement+'" id="mess'+username+'" onclick="selectedOwner(this)">'+
                '<div class="row">'+
                    '<div class="col-sm-2 pl-1 pt-1">'+
                        '<img class="avatarOwner" src="../static/image/'+typeAvt+'.png">'+
                    '</div>'+
                    '<div class="col-sm-10 name p-1">'+
                        '<b>'+fullName+'</b>'+
                        '<div class="row content">'+
                            '<div class="col-sm-7">'+
                                isMe + message+
                            '</div>'+
                            '<div class="col-sm-5 p-0 pl-3">'+
                                (time)+
                            '</div>'+                     
                        '</div>' +
                    '</div>' +                     
                '</div>'+
            '</div>'
}



$("#search-owner").focus(function() { 
    $(".search-result").css("display", "block"); 
    $(".history-chat").css("display", "none"); 
});
$("#search-owner").blur(function() { 
    $(".search-result").css("display", "none");
    $(".history-chat").css("display", "block"); 
});
firstOwner = "owner"
function loadCacTinNhanGanNhat() {
    fetch('/getListChatRecentsOfAdmin')
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        document.getElementById("listmessages").innerHTML = ""
                        for (var i = 0; i < data.length; i++) {
                            // classElement in ["", "active-chat", "unread"]
                            classElement = ""
                            if (data[i].status == "unread") {
                                classElement = "unread"
                            }
                            p = renderEachElementOfListChat(data[i].isMe, classElement, data[i].typeAvt, data[i].fullname, data[i].content, (i != data.length - 1), data[i].usernameOwner, data[i].time)
                            document.getElementById("listmessages").innerHTML += p
                            console.log(p)
                        }
                        firstOwner = document.querySelector(".each-message-history").id.substring(4)
                    }
                )
            }
        }
    )
}


function renderImageRead (typeRead, typeAvt) {
    if (typeRead == "read") {
        return "" 
    } else if (typeRead =="read-recent") {
        return '<img class="status-message-read-recent" src="../static/image/' + typeAvt + '.png">'
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
                            '<img class="avatarOwner" src="../static/image/' + typeAvt + '.png">' +
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

var socket = io.connect('http://127.0.0.1:5000');
//var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.on('connect', function() {
    socket.send('User has connected!');
});

socket.on('consoleLog', function(msg) {
    console.log(msg["data"]);
});




// $('#sendbutton').on('click', function() {
//     socket.send($('#myMessage').val());
//     $('#myMessage').val('');
// });




document.getElementById("send-message").onclick = ()=> {
    sendMessage()
}

$(document.getElementById("input-message")).keypress((e) => {
    if (e.keyCode == 13) {
        sendMessage()
    }
});
document.getElementsByClassName("send-message").onclick = renderMessageToHTML()


// Load footer
$('#footer').load('../static/page/footer.html');


function loadTinNhanCu(usernameOwner) {
    fetch('/getMessages/'+usernameOwner+'/1')
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        document.getElementById("message-right").innerHTML = ""
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].isMe) {
                                sender = "me"
                            } else {
                                sender = "you"
                            }
                            // typeRead in ["read", "read-recent", "unread", "loading-message"]
                            p = renderMessageToHTML(sender, data[i].content, data[i].status, data[i].typeAvt)
                            document.getElementById("message-right").innerHTML += p
                            document.getElementById("avtOwner").src = "../static/image/"+data[i].typeAvt+".png"
                            document.getElementById("nameChatTo").innerHTML = data[i].fullname
                        }
                        
                    }
                )
            }
        }
    )
}
loadCacTinNhanGanNhat()
loadTinNhanCu(firstOwner)
function selectedOwner(elmt) {
    // console.log()
    loadTinNhanCu(elmt.id.substring(4))
}

socket.on('roomMessage', function(data) {
    // {"id": row.id, "time": str(row.time), "content": row.content, "status": row.status, "ownerSend": row.ownerSend, "typeAvt": row.typeAvt, "usernameOwner": row.usernameOwner} 
    console.log(data)
    if (data.ownerSend == "true") {
        sender = "you"
    } else {
        sender = "me"
    }
    if (document.getElementById("usernameChating").innerHTML == data.usernameOwner) {
        document.getElementById("message-right").innerHTML += renderMessageToHTML(sender, data.content, data.status, data.typeAvt) 
        autoScroll()
        document.getElementById("input-message").focus()
    } else {
        // update bên trái
        loadCacTinNhanGanNhat()
    }
    
});

function sendMessage() {
    typeAvt = document.getElementById("avtOwner").src.replace (/[^\d.]/g,''); 
    text = document.getElementById("input-message").value
    document.getElementById("input-message").value = ""
    sender = "me"
    typeRead = "loading-message"
    if (text.trim() != "") {
        socket.emit("sendMessage", {"message": text.trim()});
        // document.getElementById("message-right").innerHTML += renderMessageToHTML(sender, text, typeRead, typeAvt) 
        // autoScroll()
        // document.getElementById("input-message").focus()
    }
    // Sau này call API

}
