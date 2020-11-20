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