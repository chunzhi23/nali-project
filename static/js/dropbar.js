let drop = 0;
document.getElementById("dropMainButton")
.addEventListener("click", function (){
    let ico_down = document.getElementById("ico_down");
    let drop_nav = document.getElementById("dropdown");

    if (drop){
        ico_down.style.display = "inline-block";
        drop_nav.style.visibility = "hidden";
        drop = 0;
    }
    else {
        ico_down.style.display = "none";
        drop_nav.style.visibility = "unset";
        drop = 1;
    }
}, false);

const ico = document.querySelectorAll("#floatingButton > .bottom #dropdown span");
for (let i = 0; i < ico.length; i++){
    ico[i].addEventListener("click", function (){
        if (ico[i].id == 'ico_home'){
            location.href = "/";
        } else {
            let target = (ico[i].id).split("_")[1];
            location.href = "/"+ target;
        }
    }, false);
}