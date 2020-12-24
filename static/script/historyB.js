// Load menu
$('#menu').load('../static/page/menu-renter.html');

function saveFavourite(elmt) {
    idPost = elmt.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].innerHTML.substring(1)
    if (elmt.classList.contains('red')) {
        status = "remove"
        elmt.classList.remove('red');
        
    } else {
        status = "add"
        elmt.classList.add('red');
    }
    fetch("/updateFavoritePost/"+ idPost + "/" + status  )
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

function removeImage(elmt) {
    idPost = elmt.parentNode.childNodes[2].childNodes[0].childNodes[0].innerHTML.substring(1)
    fetch("/deleteHistoryView/" + idPost)
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
    elmt.parentNode.remove();
}



fetch("/getHistoryView")
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                    .then(
                        data => {
                            for (var i = 0; i < data.length; i++) {
                                
                                document.getElementById("list-view").innerHTML +=
                                    '<div class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12 frame-image">' +
                                        '<div class="close" onclick="removeImage(this)">&times;</div>' +
                                        '<img class="image-view" src="' + data[i].image + '" alt="product">' +

                                        '<span class="info">' +
                                            '<p class="id"><a href="' + hasLinkPost(data[i].idPost, data[i].titlePost) + '">#' + data[i].idPost + ' </a></p>' +
                                            '<p class="titlepost"><a href="">' + data[i].titlePost + '</a></p>' +
                                            '<p class="diachi">' +
                                                data[i].addressDetail + ', ' + data[i].addressWard + ', ' + data[i].addressDistrict + ', ' + data[i].addressProvince +
                                            '</p>' +
                                            '<p class="gia">' +
                                                data[i].priceItem + ' triệu/tháng' +
                                            '</p>' +
                                        '</span>' +
                                    '</div>'
                            }
                        }
                    )
            }
        }
    )


fetch("/getHistoryFavorite")
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
                .then(
                    data => {
                        for (var i = 0; i < data.length; i++) {
                            document.getElementById("list-favorite").innerHTML += 
                            '<div class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">' +
                                '<div class="card">' +
                                    '<div class="card-img-top">' +
                                        '<a class="wp-post-image">' +
                                            '<img class="image-cover" src="'+ data[i].image +'" alt="product">' +
                                            '<div class="item-favourite">' +
                                                '<i class="fas fa-heart red" onclick="saveFavourite(this)"></i>' + 
                                            '</div>' +
                                        '</a>' +
                                    '</div>' +
                                    '<div class="card-body">' +
                                        '<p class="card-title"><a href="' + hasLinkPost(data[i].idPost, data[i].titlePost) +'">#' + data[i].idPost + '</a></p>' +
                                        '<p class="woocommerce-loop-product__title"><a href="">' +
                                        data[i].titlePost +'</a></p>' +

                                        '<span class="price">' +
                                            '<ins>' +
                            '<span class="woocommerce-Price-amount amount">' +
                            '<span class="woocommerce-Price-currencySymbol">' + data[i].addressDetail + ', ' + data[i].addressWard + ', ' + data[i].addressDistrict + ', ' + data[i].addressProvince + '</span>' +
                            '</span>' +
                            '</ins>' +
                            '</span>' +
                            '<p class="gia">' +
                            data[i].priceItem + ' triệu/tháng' +
                            '</p>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                        }
                    }
                )
        }
    }
)



document.getElementById("delete-all-btn").onclick = function() {
    fetch("/deleteAllHistoryView")
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        if (data.message == "ok") {
                            document.getElementById("list-view").innerHTML = ""
                        }
                    }
                )
            }
        }
    )
}





    

function deleteAllHistoryView() {
    usernameRenter = document.getElementById();
}




document.getElementById('delete-all-btn').onclick = function () {
    document.getElementById("list-view").innerHTML = ""
}



// Load footer
$('#footer').load('../static/page/footer.html');