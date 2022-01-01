let user;
fetch("/parse_user")
.then(response => response.text())
.then(data => user = JSON.parse(data))
.then(() => {
    document.getElementById("cover").style.display = "none";
});

function validateForm(){
    let ret = 0;

    let new_id = document.getElementById("id").value;
    let new_pw = document.getElementById("pw").value;
    let pw_chk = document.getElementById("pwChk").value;
    let new_nm = document.getElementById("name").value;

    let img_id = document.getElementById("status_id");
    let img_pw = document.getElementById("status_pw");
    let img_pwChk = document.getElementById("status_pwChk");
    let img_nm = document.getElementById("status_nm");
    
    let checkId = user["uid"].includes(new_id);
    if (checkId || new_id.replace(/\s+/g, '') == ""){
        // console.log("ID already exists");
        ret = 1;
        img_id.className = "";
        img_id.src = "";
    }
    else {
        img_id.className = "approved";
        img_id.src = "/static/icons/approved.png";
    }
    
    let pattern1 = /[0-9]/; // number
    let pattern2 = /[a-zA-Z]/; // letters
    let pattern3 = /[~!@#$%^&*()_+|<>?:{}]/; // special letters
    if (!pattern1.test(new_pw) || !pattern2.test(new_pw) || !pattern3.test(new_pw) || new_pw.length < 8){
        // console.log("invailed password");
        ret = 1;
        img_pw.className = "";
        img_pw.src = "";
    }
    else {
        img_pw.className = "approved";
        img_pw.src = "/static/icons/approved.png";
        if (new_pw != pw_chk){
            // console.log("password and confirm aren't the same");
            ret = 1;
            img_pwChk.className = "";
            img_pwChk.src = "";
        }
        else {
            img_pwChk.className = "approved";
            img_pwChk.src = "/static/icons/approved.png";
        }
    }

    let checkNm = user["usrn"].includes(new_nm);
    if (checkNm || new_nm.replace(/\s+/g, '') == ""){
        // console.log("username already exists");
        ret = 1;
        img_nm.className = "";
        img_nm.src = "";
    }
    else {
        img_nm.className = "approved";
        img_nm.src = "/static/icons/approved.png";
    }

    if (ret){
        return false;
    }
}