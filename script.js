$(document).ready(function () {
  const apikey = "166a433c57516f51dfab1f7edaed8413";
  let cities = [];

  function cityinfo() {
    let city = $(this).attr("data-name");
    let queryurl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=" +
      apikey;
    $.get(queryurl, function (response) {
      $("#selectedCity").text(response.name);
      $("#weatherIcon").attr(
        "src",
        "http://openweathermap.org/img/wn/" +
          response.weather[0].icon +
          "@2x.png"
      );
      $("#currentDate").text(moment().format("MMM DO, YYY"));
      $("#windspeed").text(response.wind.speed + "mph");
      $("#currentTemp").text(response.main.temp);
      $("#humidty").text(response.main.humidity + "%");
      let lon = response.coord.lon;
      let lat = response.coord.lat;
      getFiveDayForecast(lon, lat);
    });
  }
});
