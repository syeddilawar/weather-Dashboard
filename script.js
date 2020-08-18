$(document).ready(function () {
  const apikey = "166a433c57516f51dfab1f7edaed8413";
  let cities = [];

  function CityInfo() {
    let city = $(this).attr("data-name");
    let queryurl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=" +
      apikey;
    $.get(queryurl, function (response) {
      $("#City").text(response.name);
      $("#weather").attr(
        "src",
        "http://openweathermap.org/img/wn/" +
          response.weather[0].icon +
          "@2x.png"
      );
      $("#currentDate").text(moment().format("MMM DA, YYY"));
      $("#windspeed").text(response.wind.speed + "mph");
      $("#currentTemp").text(response.main.temp);
      $("#humidty").text(response.main.humidity + "%");
      let lon = response.coord.lon;
      let lat = response.coord.lat;
      getDaysForecast(lon, lat);
    });
  }
  function getDaysForecast(lon, lat) {
    $.get(
      "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apikey,
      function (response) {
        $("#uvIndex").text(response.current.uvi);
        if (response.current.uvi <= 3) {
          $("#uvIndex").css("background-color", "blue");
        } else if (response.current.uvi <= 6) {
          $("#uvIndex").css("background-color", "green");
        } else if (response.current.uvi <= 10) {
          $("#uvIndex").css("background-color", "red");
        } else {
          $("#uvIndex").css("background-color", "orange");
        }
        FiveDay(response.daily);
      }
    );
  }
  function FiveDay(arr) {
    $(".DaysContainers").empty();

    for (let i = 0; i < 5; i++) {
      const forecastDays = $("<div>").addClass("forecastDays");
      const forecastDate = $("<p>").text(
        moment().add(i, "days").format("ddd-Do")
      );
      const forecastIcon = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/wn/" + arr[i].weather[0].icon + "@2x.png"
      );
      const forecastTemp = $("<p>").text("Temp: " + arr[i].temp.day);
      const forecastHumidity = $("<p>").text("Humidity: " + arr[i].humidity);
      forecastDays.append(
        forecastDate,
        forecastIcon,
        forecastTemp,
        forecastHumidity
      );
      $(".DaysContainers").append(forecastDays);
    }
  }

  function renderCityButtons() {
    $("#cityButtonsContainer").empty();
    for (var i = 0; i < cities.length; i++) {
      var cityButton = $("<button>");

      cityButton.addClass("city");

      cityButton.attr("data-name", cities[i]);

      cityButton.text(cities[i]);

      $("#cityButtonsContainer").append(cityButton);
    }
  }

  $("#searchCity").on("click", function (event) {
    event.preventDefault();

    if ($("#cityInput").val() == "") {
      return false;
    }
    var city = $("#cityInput").val().trim();

    cities.push(city);
    renderCityButtons();

    $("#cityInput").val("");
    storeCityInfo();
  });

  $(document).on("click", ".city", CityInfo);

  function storeCityInfo() {
    localStorage.setItem("cities", JSON.stringify(cities));
  }

  function getCities() {
    if (localStorage.getItem("cities")) {
      const savedCities = JSON.parse(localStorage.getItem("cities"));
      cities.push(...savedCities);
    }
  }
  getCities();
  renderCityButtons();

  $("button:last-child").click();
});
