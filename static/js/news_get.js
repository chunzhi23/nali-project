let news;
fetch("/parse_news")
.then((response) => response.text())
.then((data) => (news = JSON.parse(data)))
.then(() => {
    let N, newsFeed;
    if (document.getElementById("news_feed") == undefined){
        newsFeed = document.getElementById("news_detail");
        N = 5;
    }
    else {
        newsFeed = document.getElementById("news_feed");
        N = 3;
    }

    document.getElementById("pending_news").style.display = "none";
    for (var i = 0; i < N; i++) {
        let ul_tit = document.createElement("ul");
        let ul_sub = document.createElement("ul");
        let li_pad = document.createElement("li");
        let a_href = document.createElement("a");

        ul_tit.className = "title";
        ul_sub.className = "subtitle";
        a_href.className = "plain";
        a_href.href = news["link"][i];
        a_href.target = "_blank";

        ul_sub.innerHTML = "<li><span>" + news["des"][i] + "</span></li>";
        a_href.innerHTML = news['tit'][i];

        li_pad.append(a_href);
        ul_tit.append(li_pad, ul_sub);

        newsFeed.appendChild(ul_tit);
    }
  });