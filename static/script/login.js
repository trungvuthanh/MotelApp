function submitLogin() {
    username = document.querySelector("#form11").value;
    password = md5(document.querySelector("#form12").value);
    fetch("../submit-dang-nhap", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({username: username, password: password}),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        if (data.message == 'active' || data.message == 'handling') {
                            location.href = '/';
                        } else if (data.message == 'block') {
                            document.getElementById('alert').innerHTML = 'Tài khoản đã bị block!';
                        } else if (data.message == 'null') {
                            document.getElementById('alert').innerHTML = 'Username hoặc mật khẩu sai';
                        }
                    }
                )
            }
        }
    )
}
