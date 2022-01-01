let kbo_list;
fetch("/parse_kbo")
  .then((response) => response.text())
  .then((data) => (kbo_list = JSON.parse(data)))
  .then(() => {
    let KBOFeed = document.querySelector("table#kbo_table tbody");

    document.getElementById("pending_kbo").style.display = "none";
    for (let i = 0; i < kbo_list.team.length; i++) {
      let tr = document.createElement("tr");

      tr.innerHTML += "<td>" + kbo_list.team[i] + "</td>";
      tr.innerHTML += "<td>" + kbo_list.win[i] + "</td>";
      tr.innerHTML += "<td>" + kbo_list.lose[i] + "</td>";
      tr.innerHTML += "<td>" + kbo_list.tie[i] + "</td>";
      tr.innerHTML += "<td>" + kbo_list.rate[i] + "</td>";
      tr.innerHTML += "<td>" + kbo_list.behind[i] + "</td>";
      KBOFeed.appendChild(tr);
    }
  });

let pre_list;
fetch("/parse_premier")
  .then((response) => response.text())
  .then((data) => (pre_list = JSON.parse(data)))
  .then(() => {
    let preFeed = document.getElementById("pre_table");
    if (!pre_list.length) {
      document.getElementById("pre_none").style.display = "block";
      document.getElementById("pre_none").innerText = "예정된 경기 정보가 없습니다.";
    } else {
      let cnt = 0, cntj = 0;

      for (let i = 0; i < 4; i++) {
        if (pre_list[cnt][i] == undefined) {
          cnt++; cntj = 0;
          if (cnt > pre_list[cnt].length) break;
        }
        
        var div = document.createElement("div"),
        left = document.createElement("div"),
        right = document.createElement("div");
        
        div.className = "sch_box";
        left.className = "left";
        right.className = "right";
        
        left.innerHTML += "<span>" + pre_list[cnt][i].homeTeamName + "</span>";
        left.innerHTML += "<span>" + pre_list[cnt][i].awayTeamName + "</span>";
        
        var matchdate = pre_list[cnt][cntj].startDate.split("");
        var matchtime = pre_list[cnt][cntj].startTime.split("");
        
        matchdate.splice(4, 0, "-");
        matchdate.splice(7, 0, "-");
        matchtime.splice(2, 0, ":");
        
        var time = new Date(matchdate.join("") + "T" + matchtime.join(""));
        time.setHours(time.getHours() + 9);
        
        var month = time.getMonth() + 1;
        var day = time.getDate();
        var hour = time.getHours();
        var minute = time.getMinutes();
        var ampm = hour >= 12 ? "오후" : "오전";
        hour = hour % 12;
        hour = hour ? hour : 12;
        minute = minute < 10 ? "0" + minute : minute;
        
        right.innerHTML += "<span>" + month + "월 " + day + "일 (" + dateKR(time.getDay()) + ")</span>";
        right.innerHTML += "<span>" + ampm + " " + hour + ":" + minute + "</span>";
        
        div.append(left);
        div.append(right);
        preFeed.appendChild(div);
        cntj++;
      }
    }
    document.getElementById("pending_pre").style.display = "none";
  });
  
let ksp_list;
fetch("/parse_ksp")
  .then((response) => response.text())
  .then((data) => (ksp_list = JSON.parse(data)))
  .then(() => {
    let kspFeed = document.getElementById("ksp_table");
    if (!ksp_list.length) {
      document.getElementById("ksp_none").style.display = "block";
      document.getElementById("ksp_none").innerText = "예정된 경기 정보가 없습니다.";
    } else {
      let cnt = ksp_list.length > 4 ? 4 : ksp_list.length;

      for (let i = 0; i < cnt; i++) {
        var div = document.createElement("div"),
          left = document.createElement("div"),
          right = document.createElement("div");

        div.className = "sch_box";
        left.className = "left";
        right.className = "right";

        left.innerHTML += "<span>" + ksp_list[i].awayTeamName + "</span>";
        left.innerHTML += "<span>" + ksp_list[i].homeTeamName + "</span>";

        var time = new Date(ksp_list[i].gameDate);
        var hour = parseInt(ksp_list[i].gameTime.split(":")[0]);
        var minute = parseInt(ksp_list[i].gameTime.split(":")[1]);
        var ampm = hour >= 12 ? "오후" : "오전";
        hour = hour % 12;
        hour = hour ? hour : 12;
        minute = minute < 10 ? "0" + minute : minute;

        right.innerHTML += "<span>" + (time.getMonth() + 1) + "월 " + time.getDate() + "일 (" + dateKR(time.getDay()) + ")</span>";
        right.innerHTML += "<span>" + ampm + " " + hour + ":" + minute + "</span>";

        div.append(left);
        div.append(right);
        kspFeed.appendChild(div);
      }
    }
    document.getElementById("pending_ksp").style.display = "none";
  });

function dateKR(n) {
  let ret;
  switch (n) {
    case 0: ret = "일";
      break;
    case 1: ret = "월";
      break;
    case 2: ret = "화";
      break;
    case 3: ret = "수";
      break;
    case 4: ret = "목";
      break;
    case 5: ret = "금";
      break;
    case 6: ret = "토";
      break;
  }
  return ret;
}