if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    $.ajax({
      type: "POST",
      url: "/parse_loc",
      dataType: "JSON",
      contentType: "application/json",
      data: JSON.stringify({
          "lat": latitude,
          "lng": longitude,
      }),
      success: function(data){
        let region_city = data.information.results[0].region.area2.name;
        let region_town = data.information.results[0].region.area3.name;
        let lat = data.coords.lat;
        let lng = data.coords.lng;
    
        document.getElementById("city").innerHTML = region_city;
        document.getElementById("town").innerHTML = region_town;
    
        let APIKey = "fa30caf43a889fdee1f9f2981b588266";
        let openweathermap_url =
          "https://api.openweathermap.org/data/2.5/onecall" +
          "?lat=" +
          lat +
          "&lon=" +
          lng +
          "&exclude=minutely&appid=" +
          APIKey;
    
        let weather_data;
        fetch(openweathermap_url)
          .then((response) => response.text())
          .then((data) => (weather_data = JSON.parse(data)))
          .then(() => {
            const env = weather_data.current.weather[0].main;
            const t = weather_data.current.temp - 273.15;
            const h = weather_data.current.humidity;
    
            let Func_arr = weatherTxt(env);
            let env_KR = Func_arr[0];
            let env_img = Func_arr[1];
    
            document.getElementById("status").innerHTML = env_KR;
            if (env_img != undefined) {
              document.getElementById("ico_weather").src = env_img;
            } else {
              document.getElementById("ico_weather").style.visibility = "hidden";
            }
    
            if (document.getElementById("th") == null) {
              drawChart(weather_data);
    
              document.getElementById("temperature").innerHTML = t.toFixed(0) + "℃";
              document.getElementById("humidity").innerHTML = h + "%";
    
              var unix_timestamp = weather_data.current.dt;
              var date = new Date(unix_timestamp * 1000);
              var day = date.getDate();
    
              for (let i = 0; i < weather_data.daily.length; i++) {
                if (weather_data.daily[i].dt > day) {
                  let tm_t_min = (weather_data.daily[i].temp.min - 273.15).toFixed(0);
                  let tm_t_max = (weather_data.daily[i].temp.max - 273.15).toFixed(0);
                  let tm_h = weather_data.daily[i].humidity;
    
                  document.getElementById("tm_tmp_min").innerHTML = tm_t_min + "℃";
                  document.getElementById("tm_tmp_max").innerHTML = tm_t_max + "℃";
                  document.getElementById("tm_humidity").innerHTML = tm_h + "%";
    
                  let tm_env = weather_data.daily[i].weather[0].main;
                  let Func_tm_arr = weatherTxt(tm_env);
                  let tm_env_KR = Func_tm_arr[0];
                  let tm_env_img = Func_tm_arr[1];
    
                  document.getElementById("tm_status").innerHTML = tm_env_KR;
                  document.getElementById("ico_tm_weather").src = tm_env_img;
    
                  break;
                }
              }
            }
          });
      },
      error: function (error){
          console.log(error);
      }
    });
  });
} else {
  alert("위치를 찾을 수 없습니다.");
}

function weatherTxt(env) {
  let env_KR, env_img;

  switch (env) {
    case "Clear":
      env_KR = "맑음";
      env_img = "/static/icons/weather_clear.png";
      break;
    case "Clouds":
      env_KR = "구름";
      env_img = "/static/icons/weather_cloudy.png";
      break;
    case "Rain":
      env_KR = "비";
      env_img = "/static/icons/weather_rain.png";
      break;
    case "Drizzle":
      env_KR = "이슬비";
      env_img = "/static/icons/weather_rain.png";
      break;
    case "Thunderstorm":
      env_KR = "뇌우";
      env_img = "/static/icons/weather_rain.png";
      break;
    case "Snow":
      env_KR = "눈";
      env_img = "/static/icons/weather_snow.png";
      break;
    case "Mist":
      env_KR = "옅은 안개";
      env_img = "/static/icons/weather_fog.png";
      break;
    case "Fog":
      env_KR = "안개";
      env_img = "/static/icons/weather_fog.png";
      break;
    case "Haze":
      env_KR = "실안개";
      env_img = "/static/icons/weather_fog.png";
      break;
    case "Smoke":
      env_KR = "스모그";
      env_img = "/static/icons/weather_dust.png";
      break;
    case "Sand":
    case "Dust":
      env_KR = "황사";
      env_img = "/static/icons/weather_dust.png";
      break;
    case "Squall":
      env_KR = "돌풍";
      env_img = "/static/icons/weather_wind.png";
      break;
    case "Tornado":
      env_KR = "태풍";
      env_img = "/static/icons/weather_wind.png";
      break;
    default:
      env_KR = "기타";
  }
  return [env_KR, env_img];
}
