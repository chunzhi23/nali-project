function drawChart(weather_data) {
  let unix_timestamp = weather_data.current.dt;
  let date = new Date(unix_timestamp * 1000);
  let day = date.getDate();
  let hour = date.getHours();
  
  let now_tmp = weather_data.current.temp - 273.15;
  let now_fall = 0;
  
  if (weather_data.current.rain != undefined){
    now_fall = weather_data.current.rain["1h"];
  }
  else if (weather_data.current.snow != undefined){
    now_fall = weather_data.current.snow["1h"];
  }

  let labels = ["현재"]; // +15
  let tem_data = [now_tmp];
  let fall_data = [now_fall];

  for (let i = 0; i < weather_data.hourly.length; i++){
    if (weather_data.hourly[i].dt > unix_timestamp){
      for (let j = i; j < i+14; j++){
        var for_date = new Date(weather_data.hourly[j].dt * 1000);
        var for_hour = for_date.getHours();
        var label_res;
        
        if (for_hour == 0){
          label_res = for_date.getMonth()+1 +"/"+ for_date.getDate();
        }
        else if (for_hour == 12){
          label_res = for_hour +"pm";
        }
        else {
          if (for_hour < 12){
            label_res = for_hour +"am";
          }
          else if (for_hour > 12){
            label_res = for_hour - 12 +"pm";
          }
        }
        labels.push(label_res);

        var for_tmp = weather_data.hourly[j].temp - 273.15;
        tem_data.push(for_tmp);
        
        var for_fall = 0;
        if (weather_data.hourly[j].rain != undefined){
          for_fall = weather_data.hourly[j].rain["1h"];
        }
        else if (weather_data.hourly[j].snow != undefined){
          for_fall = weather_data.hourly[j].snow["1h"];
        }
        fall_data.push(for_fall); 
      }
      break;
    }
  }

  const data = {
    labels: labels,
    datasets: [
      {
        type: "line",
        label: "기온",
        backgroundColor: "#EB6E4B",
        borderColor: "#EB6E4B",
        data: tem_data,
        yAxisID: "y",
      },
      {
        type: "bar",
        label: "강수량",
        backgroundColor: "#91D4CB",
        borderColor: "#91D4CB",
        data: fall_data,
        yAxisID: "y1",
      },
    ],
  };
  const config = {
    data: data,
    options: {
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          titleColor: "black",
          titleFont: {
            family: "NanumBarunpenR",
            weight: "bold",
            size: 16,
          },
          bodyColor: "black",
          bodyFont: {
            family: "NanumBarunpenR",
            size: 15,
          },
          callbacks: {
            label : function (context){
              if (context.datasetIndex === 0){
                return " "+ context.dataset.label +": "+ context.formattedValue +"℃";
              }
              else if (context.datasetIndex === 1){
                return " "+ context.dataset.label +": "+ context.formattedValue +"㎜";
              }
            }
          }
        },
      },
      scales: {
        x: {
          position: "top",
          grid: {
            display: false,
          },
        },
        y: {
          type: "linear",
          display: true,
          position: "left",

          grid: {
            display: false,
          },
        },
        y1: {
          type: "linear",
          display: false,
        },
      },
    },
  };
  const myChart = new Chart(document.getElementById("weather_chart"), config);
}
