function createImage(base64) {
    return '<div class = "frame-image"><div class="close" onclick="removeImage(this)">&times;</div><img src="'+ base64 +'"></div>';
}

function previewFile(input) {
    const [file] = input.files 
    const reader = new FileReader()
    reader.onloadend = function() {
        document.getElementById("preview").innerHTML += createImage(reader.result);
        checkCountFileImage()
    } 
    reader.readAsDataURL(file)    
}
function onSelect(e) {
    if (e.files.length > 3) {
        alert("Only 3 files accepted.");
        e.preventDefault();
    }
}

function checkCountFileImage() {
    var numFile = document.getElementsByClassName("frame-image").length;
    if (numFile < 3) {
        document.getElementById("btnHinhAnh").className = "form-control-file is-invalid"
    } else {
        document.getElementById("btnHinhAnh").className = "form-control-file is-valid"
    }
}

var validation

'use strict';
window.addEventListener('load', function() {
    var forms = document.getElementsByClassName('needs-validation');
    validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            checkCountFileImage()
            if (form.checkValidity() === false ) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                alert("ok")
                
            }
            form.classList.add('was-validated');
        }, false);
    });
}, false);

var listImageUltities = document.querySelectorAll("div.tienich img");
for (var i = 0; i < listImageUltities.length; i++) {
    listImageUltities[i].onclick = function() {
        if ($(this).hasClass("active-image")) {
            $(this).removeClass("active-image");
        } else {
            $(this).addClass("active-image");
        }
    }
}

function removeImage(elmt) {
    elmt.parentNode.remove();
}

function hienThiThemThongTin(elmt) {
    icon = elmt.childNodes[1]
    if (icon.className == 'fa fa-caret-down') {
        icon.className = 'fa fa-caret-down open'
    } else {
        icon.className = 'fa fa-caret-down'
    }
    
    elmt = document.getElementById("huongDan");
    $(elmt).slideToggle();
}

function convertToHTML(string) {
    bold = 0
    while (string.match(/\*\*/g)!=null) {
        if (bold == 0) {
            string = string.replace(/\*\*/i, "<b>")
            bold = 1
        } else {
            string = string.replace(/\*\*/i, "</b>")
            bold = 0
        }
    }
    italic = 0
    while (string.match(/\/\//g)!=null) {
        if (italic == 0) {
            string = string.replace(/\/\//i, "<i>")
            italic = 1
        } else {
            string = string.replace(/\/\//i, "</i>")
            italic = 0
        }
    }
    par = string.split("\n")
    res = "<div>"
    list = 0
    for (var i = 0 ; i < par.length; i++) {
        sen = par[i]
        if (sen.substring(0, 3) == "-- ") {
            sen = sen.substring(3)
            if (list == 0) {
                res += "<ul><li>" + sen + "</li>"
                list = 1
            } else {
                res += "<li>" + sen + "</li>"
            } 
        } else {
            if (list == 0) {
                res += "<div>" + sen + "</div>"
            } else {
                res += "</ul><div>" + sen + "</div>"
                list = 0
            }     	
        }
    }
    if (list == 1) {
        res += "</ul></div>"
    } else {
        res += "</div>"
    }
    return res;
}

contentPost = document.getElementById("noidungbaiviet")
contentPost.onkeyup = function() {
    document.getElementById("contentHTML").innerHTML = convertToHTML(contentPost.value)
}

// convertToHTML(document.getElementById("noidungbaiviet").value)

// document.getElementById("xemtruocbaiviet").onclick = function() {
    
// }