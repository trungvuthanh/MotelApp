// Load menu
$('#menu').load('../static/page/menu-admin.html');

// Load footer
$('#footer').load('../static/page/footer.html');

function handleDate(stringDate) {
    stringDate = stringDate.split("-")
    return stringDate[2] + "/" + stringDate[1] + "/" + stringDate[0]
}

function acceptReview(elmt) {
    content = elmt.parentNode.parentNode.childNodes[0].childNodes[0].value
    id = elmt.parentNode.parentNode.parentNode.children[1].children[1].innerHTML.substring(5) - 0
    star = elmt.parentNode.parentNode.parentNode.children[2].children[0].children[0].children[0].value - 0
    fetch("/updateReview/accept/" + id + "/" + star + "/" + content)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {                     
                    }
                )
            }
        }
    )
    elmt.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
}

function denyReview(elmt) {
    content = elmt.parentNode.parentNode.childNodes[0].childNodes[0].value
    id = elmt.parentNode.parentNode.parentNode.children[1].children[1].innerHTML.substring(5) - 0
    star = elmt.parentNode.parentNode.parentNode.children[2].children[0].children[0].children[0].value - 0
    fetch("/updateReview/deny/" + id + "/" + star + "/" + content)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {                     
                    }
                )
            }
        }
    )
    elmt.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
}

function acceptReport(elmt) {
    idReport = elmt.parentNode.parentNode.parentNode.children[1].children[1].innerHTML.substring(6) - 0
    fetch("/updateReport/accept/" + idReport)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {                     
                    }
                )
            }
        }
    )
    elmt.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
}

function denyReport(elmt) {
    idReport = elmt.parentNode.parentNode.parentNode.children[1].children[1].innerHTML.substring(6) - 0
    fetch("/updateReport/deny/" + idReport)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {                     
                    }
                )
            }
        }
    )
    elmt.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
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

function renderButtonHandlerReview(status) {
    if (status == 'handling') {
        return '<div class="bg-success row mt-1 mr-1 accept-btn" onclick="acceptReview(this)" ><b>Chấp nhận</b></div> '+
        '<div class="bg-danger row mt-1 mr-1 deny-btn" onclick="denyReview(this)"><b>Từ chối</b></div> '
    } else if (status == 'deny') {
        return '<div class="bg-success row mt-1 mr-1 accept-btn" onclick="acceptReview(this)"><b>Chấp nhận lại</b></div> '
    } else {
        // accept
        return '<div class="bg-danger row mt-1 mr-1 deny-btn" onclick="denyReview(this)"><b>Hủy</b></div> '
    }
}

function renderButtonHandlerReport(status) {
    if (status == 'handling') {
        return '<div class="bg-success row mt-1 mr-1 accept-btn" onclick="acceptReport(this)" ><b>Chấp nhận</b></div> '+
        '<div class="bg-danger row mt-1 mr-1 deny-btn" onclick="denyReport(this)"><b>Từ chối</b></div> '
    } else if (status == 'deny') {
        return ''
    } else {
        // accept
        return '<div class="bg-danger row mt-1 mr-1 deny-btn" onclick="denyReport(this)"><b>Hủy</b></div> '
    }
}

function renderReview(status, typeAvt, fullname, date, rating, content, idPost, titlePost, id) {
    return '<div class="review-comment row border">'+
                '<div class="comment-section col-sm-12">'+
                    '<div class="col-md-12 guest-comment px-0">'+
                        '<div class="each-comment row pt-3">'+
                            '<div class="col-sm-1">'+
                                '<img class="renterImageID" src="../static/image/'+typeAvt+'.png">'+
                            '</div>'+
                            '<div class="col-sm-11">'+
                                '<div class="row info-guest">'+
                                    '<div class="col-sm-4 p-0"><p><b>'+fullname+'</b></p></div>'+
                                    '<div class="col-sm-4"><p>'+handleDate(date)+'</p></div>'+               
                                '</div>'+
                                '<div class="row average-rate p-0">'+
                                    '<div class="col-sm-10"><a class="title-post" href="'+hasLinkPost(idPost, titlePost)+'">'+titlePost+'</a> </div>'+
                                    '<div class="col-sm-2">ID: #'+id+'</div>'+
                                '</div>'+
                                '<div class="row average-rate p-0">'+
                                    '<div class="col-sm-1">'+
                                        '<div class="rate-point-container bg-success text-white text-center rounded mr-3">'+
                                            '<input class="point" value="'+rating+'"></span>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="row">'+
                                    '<div class="col-sm-9">'+
                                        '<textarea type="text" class="content" rows="4">'+content+'</textarea>'+
                                    '</div>'+
                                    '<div class="col-sm-3"> '+
                                        renderButtonHandlerReview(status)+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'
}

function loadReview() {
    status = document.getElementById("statusReview").value
    fetch("/adminGetReviews/" + status)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        document.getElementById("review").innerHTML = ""
                        for (var i = 0; i < data.length; i++) {
                            document.getElementById("review").innerHTML += renderReview(data[i].status, data[i].typeAvt, data[i].fullname, data[i].time, data[i].stars, data[i].content, data[i].idPost, data[i].titlePost, data[i].id) 
                        }                        
                    }
                )
            }
        }
    )
}
loadReview()

function renderHashtag(fakeInfo, fakePrice) {
    if (fakeInfo == 1 && fakePrice == 1) {
        return '<span class="hashtag">#fakeInfo</span><span class="hashtag">#fakePrice</span>'
    } else if (fakeInfo == 1 && fakePrice == 0) {
        return '<span class="hashtag">#fakeInfo</span>'
    } else if (fakeInfo == 0 && fakePrice == 1) {
        return '<span class="hashtag">#fakePrice</span>'
    }
    return ""
}

function renderReport(status, typeAvt, fullname, date, idPost, titlePost, id, fakeInfo, fakePrice, content) {
    return '<div class="review-comment row border">'+
                '<div class="comment-section col-sm-12">'+
                    '<div class="col-md-12 guest-comment px-0">'+
                        '<div class="each-comment row pt-3">'+
                            '<div class="col-sm-1">'+
                                '<img class="renterImageID" src="../static/image/'+typeAvt+'.png">'+
                            '</div>'+
                            '<div class="col-sm-11">'+
                                '<div class="row info-guest">'+
                                    '<div class="col-sm-4 p-0"><p><b>'+fullname+'</b></p></div>'+
                                    '<div class="col-sm-4"><p>'+handleDate(date)+'</p></div>'+
                                '</div>'+
                                '<div class="row">'+
                                    '<div class="col-sm-10"><a class="title-post" href="'+hasLinkPost(idPost, titlePost)+'">'+titlePost+'</a> </div>'+
                                    '<div class="col-sm-2"> ID: #'+id+'</div>'+
                                '</div>'+
                                '<div class="row mb-2 mt-2 ">'+
                                    '<div class="col-sm-12">'+
                                        renderHashtag(fakeInfo, fakePrice) +
                                    '</div>'+
                                '</div>'+
                                '<div class="row">'+
                                    '<div class="col-sm-9">'+
                                        '<textarea type="text" class="content" rows="4">'+content+'</textarea>'+
                                    '</div>'+
                                    '<div class="col-sm-3">'+
                                        renderButtonHandlerReport(status) + 
                                    '</div>'+
                                '</div>'+                                
                            '</div>'+
                        '</div>'+                        
                    '</div>'+
                '</div>'+
            '</div>'
}

function loadReport() {
    status = document.getElementById("statusReport").value
    fetch("/adminGetReports/" + status)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        document.getElementById("report").innerHTML = ""
                        for (var i = 0; i < data.length; i++) {
                            document.getElementById("report").innerHTML += renderReport(data[i].status, data[i].typeAvt, data[i].fullname, data[i].time, data[i].idPost, data[i].titlePost, data[i].id, data[i].fakeInfo, data[i].fakePrice, data[i].content)
                        }                        
                    }
                )
            }
        }
    )
}

loadReport()