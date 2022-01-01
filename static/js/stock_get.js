let stock;

fetch("/parse_stock")
  .then((response) => response.text())
  .then((data) => (stock = JSON.parse(data)))
  .then(() => {
    let stockFeed = document.querySelector("#stock_table tbody");
    const N = stock['name'].length > 5 ? 5 : stock['name'].length;

    document.getElementById("pending_stk").style.display = "none";
    for (let i = 0; i < N; i++){
        var tr = document.createElement("tr");
        var state;
        if (stock['change'][i] > 0) state = "red";
        else if (stock['change'][i] < 0) state = "blue";
        else state = "default";

        tr.innerHTML += "<td>"+ stock['name'][i] +"</td>";
        tr.innerHTML += "<td class='"+ state +"'>"+ stock['val'][i] +"</td>";
        tr.innerHTML += "<td class='"+ state +"'>"+ stock['change'][i] +"%</td>";
        stockFeed.appendChild(tr);
    }
  });