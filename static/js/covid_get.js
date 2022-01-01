let covid;
fetch("/parse_COVID")
.then((response) => response.text())
.then((data) => (covid = JSON.parse(data)))
.then(() => {
    document.getElementById("pending_cvd").style.display = "none";
    document.getElementById("data").innerHTML = covid[0];
    document.getElementById("when").innerHTML = covid[1];
});