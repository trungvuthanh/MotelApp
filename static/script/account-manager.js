// Load menu, footer
$('#menu').load('../static/page/menu-admin.html');
$('#footer').load('../static/page/footer.html');
///////////////////////////////////////////////////////////////////////////////////////////////

function setNumPage(typeAccount, num) {
	if (typeAccount == "owner") {
		document.getElementById("numpageOwner").innerHTML = num
	} else {
		document.getElementById("numpageRenter").innerHTML = num
	}
}

function getNumPage(typeAccount) {
	if (typeAccount == "owner") {
		return document.getElementById("numpageOwner").innerHTML - '0'
	} else {
		return document.getElementById("numpageRenter").innerHTML - '0'
	}
}

function setPage(typeAccount, hasPrev, hasNext, numpage) {
	if (hasPrev) {
		document.getElementById("prev" + typeAccount).classList = "numpage hasResults"
	} else {
		document.getElementById("prev" + typeAccount).classList = "numpage hasnotResults"
	}
	if (hasNext) {
		document.getElementById("next" + typeAccount).classList = "numpage hasResults"
	} else {
		document.getElementById("next" + typeAccount).classList = "numpage hasnotResults"
	}
	setNumPage(typeAccount, numpage)
}

function acceptCreateAccountOwner(elmt) {
	username = elmt.parentNode.parentNode.parentNode.children[1].children[0].children[1].innerText
	fetch("/lockAccount/active/" + username)
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
	elmt.parentNode.parentNode.parentNode.remove()
}

function denyCreateAccountOwner(elmt) {
	username = elmt.parentNode.parentNode.parentNode.children[1].children[0].children[1].innerText
	fetch("/lockAccount/deny/" + username)
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
	elmt.parentNode.parentNode.parentNode.remove()
}


// Button mở/khóa chỉnh sửa
function edit(elmt) {
	if (elmt.previousElementSibling.childNodes[0].classList.contains('no-change')) {
		elmt.previousElementSibling.childNodes[0].classList.remove('no-change');
		elmt.innerHTML = 'Mở chỉnh sửa';
		username = elmt.parentNode.parentNode.parentNode.children[1].children[0].children[1].innerText
		fetch("/chinhsua/enable/" + username)
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
	} else {
		elmt.previousElementSibling.childNodes[0].classList.add('no-change');
		elmt.innerHTML = 'Khóa chỉnh sửa';
		username = elmt.parentNode.parentNode.parentNode.children[1].children[0].children[1].innerText
		fetch("/chinhsua/unenable/" + username)
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
}


function block(elmt) {
	username = elmt.parentNode.parentNode.parentNode.children[1].children[0].children[1].innerText
	fetch("/lockAccount/block/" + username)
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
	elmt.parentNode.parentNode.parentNode.remove()
}

function unblock(elmt) {
	username = elmt.parentNode.parentNode.parentNode.children[1].children[0].children[1].innerText
	fetch("/lockAccount/active/" + username)
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
	elmt.parentNode.parentNode.parentNode.remove()
}


function acceptEditAccountOwner(elmt) {
	username = elmt.parentNode.parentNode.parentNode.children[1].children[0].children[1].innerText
	fetch("/chinhsua/accept/" + username)
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
	elmt.parentNode.parentNode.parentNode.remove()
}

function denyEditAccountOwner(elmt) {
	username = elmt.parentNode.parentNode.parentNode.children[1].children[0].children[1].innerText
	fetch("/chinhsua/deny/" + username)
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
	elmt.parentNode.parentNode.parentNode.remove()
}




function renderButon(typeAccount, status, enableEdit) {
	if (typeAccount == "owner") {
		if (status == "handling") {
			return '<div class="button flex-row align-items-center border">'+
						'<div class="icon border-right"><i class="fas fa-check"></i></div>'+
						'<div class="btn-action bg-green text-white" onclick="acceptCreateAccountOwner(this)">Chấp nhận</div></div>'+
					'<div class="button flex-row align-items-center border">'+
						'<div class="icon border-right"><i class="fas fa-times"></i></div>'+
						'<div class="btn-action bg-red text-white" onclick="denyCreateAccountOwner(this)">Từ chối</div></div>'
		} else if (status == "active") {
			// console.log(enableEdit)
			if (enableEdit == true) {
				return '<div class="button flex-row align-items-center border change-button">'+
						'<div class="icon border-right"><i class="fas fa-pen"></i></div>'+
						'<div class="btn-action bg-blue text-white" onclick="edit(this)">Mở chỉnh sửa</div></div>'+
					'<div class="button flex-row align-items-center border">'+
						'<div class="icon border-right"><i class="fas fa-lock"></i></div>'+
						'<div class="btn-action bg-red text-white" onclick="block(this)">Block</div></div>'
			} 
			return '<div class="button flex-row align-items-center border change-button">'+
						'<div class="icon border-right"><i class="fas fa-pen no-change"></i></div>'+
						'<div class="btn-action bg-blue text-white" onclick="edit(this)">Khóa chỉnh sửa</div></div>'+
					'<div class="button flex-row align-items-center border">'+
						'<div class="icon border-right"><i class="fas fa-lock"></i></div>'+
						'<div class="btn-action bg-red text-white" onclick="block(this)">Block</div></div>'
		} else if (status == "edit") {
			return '<div class="button flex-row align-items-center border">'+
						'<div class="icon border-right"><i class="fas fa-check"></i></div>'+
						'<div class="btn-action bg-green text-white" onclick="acceptEditAccountOwner(this)">Chấp nhận</div></div>'+
					'<div class="button flex-row align-items-center border">'+
						'<div class="icon border-right"><i class="fas fa-times"></i></div>'+
						'<div class="btn-action bg-red text-white" onclick="denyEditAccountOwner(this)">Từ chối</div></div>'
		} else if (status == "block") {
			return '<div class="button flex-row align-items-center border">'+
						'<div class="icon border-right"><i class="fas fa-lock-open"></i></div>'+
						'<div class="btn-action bg-green text-white" onclick="unblock(this)">Gỡ block</div></div>'
		}
	} else if (typeAccount == "renter") {
		if (status == "active") {
			return '<div class="button flex-row align-items-center border">'+
						'<div class="icon border-right"><i class="fas fa-lock"></i></div>'+
						'<div class="btn-action bg-red text-white" onclick="block(this)">Block</div></div>'
		} else if (status == "block") {
			return '<div class="button flex-row align-items-center border">'+
						'<div class="icon border-right"><i class="fas fa-lock-open"></i></div>'+
						'<div class="btn-action bg-green text-white" onclick="unblock(this)">Gỡ block</div></div>'
		}
	}
}
function handleDate(stringDate) {
    stringDate = stringDate.split("-")
    return stringDate[2] + "/" + stringDate[1] + "/" + stringDate[0]
}

function handleStatus(status) {
	return {"handling": "chờ duyệt", "edit": "chỉnh sửa thông tin", "block": "đã khóa", "active": "đã duyệt"}[status]
}

function renderImage(image, id) {
	if (image == "null") {
		return ["", ""]
	} else {
		return ['<div class="form-title"><div class="title">CMND:</div><p>'+id+'</p></div>', 
				'<div class="item-img"><img src="'+image+'" alt=""></div>']
	}
}

function renderResultAccount(status, typeAccount, fullname, birthday, address, id , email, username, phoneNumber, createDate, imageID, enableEdit) {
	temp = renderImage(imageID, id)
	return '<div class="item flex-row space-between border">'+
				'<div><div class="form-title">'+
						'<div class="title">Họ tên:</div><p>'+fullname+'</p></div>'+
					'<div class="form-title">'+
						'<div class="title">Ngày sinh:</div><p>'+handleDate(birthday)+'</p></div>'+
					'<div class="form-title">'+
						'<div class="title">Địa chỉ:</div><p>'+address+'</p></div>'+
					temp[0]+
					'<div class="form-title">'+
						'<div class="title">Email:</div><p>'+email+'</p></div></div>'+
				'<div><div class="form-title">'+
						'<div class="title">Username:</div><p>'+username+'</p></div>'+
					'<div class="form-title">'+
						'<div class="title">SĐT:</div><p>'+phoneNumber+'</p></div>'+
					'<div class="form-title">'+
						'<div class="title">Trạng thái:</div><p>'+handleStatus(status)+'</p></div>'+
					'<div class="form-title">'+
						'<div class="title">Ngày tạo:</div><p>'+handleDate(createDate)+'</p></div></div>'+
				temp[1] +
				'<div class="result-action flex-column justify-content-center">'+
					renderButon(typeAccount, status, enableEdit)+
				'</div>'+
			'</div>'
}
// numPage = 1
function loadData() {
	typeAccount = {"Chủ nhà trọ": "owner", "Khách thuê trọ": "renter"}[document.querySelector(".tab-active-head").children[0].innerHTML]
	status = document.querySelector("#select" + typeAccount).value
	// console.log(status)
	fetch("/getAccount/"+typeAccount+"/" + status + "/" + getNumPage(typeAccount))
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => { 
						// console.log(data)
						typeAccount = {"Chủ nhà trọ": "owner", "Khách thuê trọ": "renter"}[document.querySelector(".tab-active-head").children[0].innerHTML]
						status = document.querySelector(".tab-active-head").parentNode.parentNode.children[1].children[1].children[0].children[0].children[0].children[1].value
						document.getElementById("result" + typeAccount).innerHTML = ""
						setPage(typeAccount, data.hasPrev, data.hasNext, getNumPage(typeAccount))
						data = data.result;
						for (var i = 0; i < data.length; i++) {
							if (data[i].status == "edit" || data[i].typeAccount == "renter") {
								image = "null"
								id = ""
								enableEdit = false
							} else {
								image = data[i].imageID
								id = data[i].ID
								enableEdit = data[i].enableEdit
							}
							document.getElementById("result" + typeAccount).innerHTML += renderResultAccount(data[i].status, data[i].typeAccount, data[i].fullname, data[i].birthday, data[i].address, id, data[i].email, data[i].username, data[i].phoneNumber, data[i].createDate, image, enableEdit) 
						}
                    }
                )
            }
        }
    )
}
loadData()

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
		loadData()
		// tabIndicator.style.left = 'calc(calc(100% / 4) * ${i})';
	});
}

document.querySelectorAll(".numpage").forEach(e => {
	e.onclick = function() {
		if (e.classList.contains("hasResults")) {
			typeAccount = {"Chủ nhà trọ": "owner", "Khách thuê trọ": "renter"}[document.querySelector(".tab-active-head").children[0].innerHTML]
			if (e.innerHTML == "&lt;&lt;") {
				setNumPage(typeAccount, getNumPage(typeAccount) - 1)
			} else {
				setNumPage(typeAccount, getNumPage(typeAccount) + 1)
			}			
			loadData();
		}
	}
})

function changeOption() {
	typeAccount = {"Chủ nhà trọ": "owner", "Khách thuê trọ": "renter"}[document.querySelector(".tab-active-head").children[0].innerHTML]
	setNumPage(typeAccount, 1)
	loadData()
}

function searchOwner() {
	stringSearch = document.getElementById("searchOwner").value;
	typeAccount = {"Chủ nhà trọ": "owner", "Khách thuê trọ": "renter"}[document.querySelector(".tab-active-head").children[0].innerHTML]
	setNumPage(typeAccount, 1)
	fetch("/search/owner/" + stringSearch)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => { 
						typeAccount = {"Chủ nhà trọ": "owner", "Khách thuê trọ": "renter"}[document.querySelector(".tab-active-head").children[0].innerHTML]
						status = document.querySelector(".tab-active-head").parentNode.parentNode.children[1].children[1].children[0].children[0].children[0].children[1].value
						document.getElementById("result" + typeAccount).innerHTML = ""
						setPage(typeAccount, false, false, 1)
						for (var i = 0; i < data.length; i++) {
							if (data[i].status == "edit" || data[i].typeAccount == "renter") {
								image = "null"
								id = ""
								enableEdit = false
							} else {
								image = data[i].imageID
								id = data[i].ID
								enableEdit = data[i].enableEdit
							}
							document.getElementById("result" + typeAccount).innerHTML += renderResultAccount(data[i].status, data[i].typeAccount, data[i].fullname, data[i].birthday, data[i].address, id, data[i].email, data[i].username, data[i].phoneNumber, data[i].createDate, image, enableEdit) 
						}
                    }
                )
            }
        }
    )
}

function searchRenter() {
	stringSearch = document.getElementById("searchRenter").value;
	typeAccount = {"Chủ nhà trọ": "owner", "Khách thuê trọ": "renter"}[document.querySelector(".tab-active-head").children[0].innerHTML]
	setNumPage(typeAccount, 1)
	fetch("/search/renter/" + stringSearch)
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => { 
						typeAccount = {"Chủ nhà trọ": "owner", "Khách thuê trọ": "renter"}[document.querySelector(".tab-active-head").children[0].innerHTML]
						status = document.querySelector(".tab-active-head").parentNode.parentNode.children[1].children[1].children[0].children[0].children[0].children[1].value
						document.getElementById("result" + typeAccount).innerHTML = ""
						setPage(typeAccount, false, false, 1)
						for (var i = 0; i < data.length; i++) {
							if (data[i].status == "edit" || data[i].typeAccount == "renter") {
								image = "null"
								id = ""
								enableEdit = false
							} else {
								image = data[i].imageID
								id = data[i].ID
								enableEdit = data[i].enableEdit
							}
							document.getElementById("result" + typeAccount).innerHTML += renderResultAccount(data[i].status, data[i].typeAccount, data[i].fullname, data[i].birthday, data[i].address, id, data[i].email, data[i].username, data[i].phoneNumber, data[i].createDate, image, enableEdit) 
						}
                    }
                )
            }
        }
    )
}