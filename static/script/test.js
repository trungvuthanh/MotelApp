fetch("../test")
.then(
    resp => {
        if (resp.status == 200) {
            resp.json()
            .then(
                data => {
                    if (data[0].status == "SUC") {
                        document.getElementById("id").innerHTML = data[1].id;
                        document.getElementById("province").innerHTML = data[1].province;
                        document.getElementById("district").innerHTML = data[1].district
                        document.getElementById("ward").innerHTML = data[1].ward;
                    } else {
                        document.getElementById("error").innerHTML = "Fetching data unsuccessfully";
                    }
                }
            )
        }
    }
)

document.getElementById("en").onclick = function() {
    fetch("./getImage", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({"image": document.getElementById("encrypt").innerHTML}),
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
                        alert(data.status);
                    }
                )
            }
        }
    )
};

document.getElementById("t").onclick = function() {
    fetch("../preview")
    .then(
        resp => {
            if (resp.status == 200) {
                resp.json()
                .then(
                    data => {
                        document.getElementById("abc").src = data.status;
                    }
                )
            }
        }
    )
};