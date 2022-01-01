function fillZero(width, str){
    return str.length >= width ? str : new Array(width - str.length+1).join('0') + str;
}

var interval1 = setInterval(function (){
    /* 시간 가져온 후 적용 */
    var d = new Date();
    let hour = d.getHours();
    let min = d.getMinutes();
    let suffixTxt = "";

    if (hour == 0){
        hour = 12;
        suffixTxt = "AM";
    }
    else if (hour == 12){
        suffixTxt = "PM";
    }
    else {
        if (hour < 12){
            suffixTxt = "AM";
        }
        else if (hour > 12){
            suffixTxt = "PM";
            hour -= 12;
        }
    }

    let hourTxt = fillZero(2, hour.toString());
    let monthTxt = fillZero(2, min.toString());

    let htmlHour = document.getElementById("h");
    let htmlMonth = document.getElementById("m");
    let htmlSuffix = document.querySelector("span.suffix");
    
    htmlHour.innerHTML = hourTxt;
    htmlMonth.innerHTML = monthTxt;
    htmlSuffix.innerHTML = suffixTxt;

    if (document.getElementById("datetime") != null){
        let month = d.getMonth()+1;
        let date = d.getDate();
        let day = d.getDay();
        
        let monthTxt = fillZero(2, month.toString());
        let dateTxt = fillZero(2, date.toString());
        let dayTxt;
        switch (day){
            case 0: dayTxt = "Sun";
            break;
            case 1: dayTxt = "Mon";
            break;
            case 2: dayTxt = "Tue";
            break;
            case 3: dayTxt = "Wed";
            break;
            case 4: dayTxt = "Thu";
            break;
            case 5: dayTxt = "Fri";
            break;
            case 6: dayTxt = "Sat";
            break;
        }

        let htmlD = document.getElementById("datetime");

        htmlD.innerHTML = monthTxt +"/"+ dateTxt +"("+ dayTxt +")";
    }

    if (document.getElementById("ico_time") != null){
        let hour24 = d.getHours();

        if (hour24 >= 0 && hour24 < 5){
            // console.log("새벽");
            document.getElementById("ico_time").src = "/static/icons/time_night.png";
            document.querySelector("span.empha").innerHTML = "새벽";
            document.querySelector("span.empha").className = "empha dawn";
        }
        else if (hour24 >= 5 && hour24 < 9){
            // console.log("아침");
            document.getElementById("ico_time").src = "/static/icons/time_dawn.png";
            document.querySelector("span.empha").innerHTML = "아침";
            document.querySelector("span.empha").className = "empha noon";
        }
        else if (hour24 >= 9 && hour24 < 17){
            // console.log("낮");
            document.getElementById("ico_time").src = "/static/icons/time_noon.png";
            document.querySelector("span.empha").innerHTML = "낮";
            document.querySelector("span.empha").className = "empha noon";
        }
        else if (hour24 >= 17 && hour24 < 21){
            // console.log("저녁");
            document.getElementById("ico_time").src = "/static/icons/time_afternoon.png";
            document.querySelector("span.empha").innerHTML = "저녁";
            document.querySelector("span.empha").className = "empha afternoon";
        }
        else {
            // console.log("밤");
            document.getElementById("ico_time").src = "/static/icons/time_night.png";
            document.querySelector("span.empha").innerHTML = "밤";
            document.querySelector("span.empha").className = "empha night";
        }
    }
}, 1000);

var interval2 = setInterval(() => {
    /* 콜론 깜박거림 */
    let colon = document.getElementById("colon");
    colon.style.visibility = "hidden";
    setTimeout(() => {
        colon.style.visibility = "visible";
    }, 800);
}, 1800);