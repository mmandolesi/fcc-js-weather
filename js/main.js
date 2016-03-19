$(document).ready(function(){
  var longitude, latitude, urlforecast, iconURL, urlcurrent;
  //var weatherAPI = http://api.openweathermap.org/data/2.5/forecast/weather?lat=position.coords.latitude&lon=position.coords.longitude&APPID=dc5c471a3ee9bd58ab9eba6bc4d12e73;
  //http://api.openweathermap.org/data/2.5/forecast/weather?lat=38.8950897&lon=-77.0737036&APPID=dc5c471a3ee9bd58ab9eba6bc4d12e73

  var GeoOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(autoSearch, fallbackSearch, GeoOptions);
  }

  function autoSearch(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    urlforecast = "http://api.openweathermap.org/data/2.5/forecast/weather?lat="+latitude+"&lon="+longitude+"&APPID=dc5c471a3ee9bd58ab9eba6bc4d12e73&units=imperial";
    urlcurrent = "http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&APPID=dc5c471a3ee9bd58ab9eba6bc4d12e73&units=imperial";
    $(".forcast-container").append("<div class=input-group>");
    $(".input-group").append("<input type='text' class='form-control' id='searchbar' placeholder='For example: Moscow or Rio de Janeiro'>");
    $(".input-group").append("<span class='input-group-btn'>");
    $(".input-group-btn").append("<button class='btn btn-default' id='searchbutton' type='button'>Go!</button>");
    $("#searchbutton").on("click", function() {
      var location = $("#searchbar").val();
      urlforecast = "http://api.openweathermap.org/data/2.5/forecast?q="+location+"&APPID=dc5c471a3ee9bd58ab9eba6bc4d12e73&units=imperial";
      urlcurrent = "http://api.openweathermap.org/data/2.5/weather?q="+location+"&APPID=dc5c471a3ee9bd58ab9eba6bc4d12e73&units=imperial";
      getWeatherCurrent();
      setTimeout(getWeatherForecast, 500);
    });
    getWeatherCurrent();
    setTimeout(getWeatherForecast, 500);
  }

  function fallbackSearch(PositionError) {
    $(".forcast-container").append("<div id=warning>");
    $(".forcast-container").append("<div class=input-group>");
    // $("#warning").html("Don't want to share your location? No problem. Search for a location here:");

    $(".input-group").append("<input type='text' class='form-control' id='searchbar' placeholder='For example: Moscow or Rio de Janeiro'>");
    $(".input-group").append("<span class='input-group-btn'>");
    $(".input-group-btn").append("<button class='btn btn-default' id='searchbutton' type='button'>Go!</button>");
    $("#searchbutton").on("click", function() {
      var location = $("#searchbar").val();
      urlforecast = "http://api.openweathermap.org/data/2.5/forecast?q="+location+"&APPID=dc5c471a3ee9bd58ab9eba6bc4d12e73&units=imperial";
      urlcurrent = "http://api.openweathermap.org/data/2.5/weather?q="+location+"&APPID=dc5c471a3ee9bd58ab9eba6bc4d12e73&units=imperial";
      getWeatherCurrent();
      setTimeout(getWeatherForecast, 500);
    });
  }

  // if (!latitude) {
    setTimeout(function () {
      if ( $("#searchbar").length == 0 ) {
        fallbackSearch();
      }
    }, 3000); //wait 10 seconds then show search bar
  // }


  function getWeatherCurrent() {
    $.ajax({
      type: "GET",
      url: urlcurrent,
      contentType: "application/json",
      dataType: 'jsonp',
      success: function(datacurrent) {
        $(".forcast-container").append("<div id=currentWeather>");
        $("#currentWeather").html("<h2>Current weather</h2>")
        $("#currentWeather").append("<div id=cityName>");
        $("#currentWeather").append("<div id=currentDescription>");
        $("#currentWeather").append("<div id=currentTemp>");
        $("#currentWeather").append("<div id=currentIcon>");
        $("#currentWeather").append("<button class='btn btn-default' id='convertTemp' type='button'>Convert to Celcius</button>");
        $("#cityName").html(datacurrent.name + ', ' + datacurrent.sys.country)
        $("#currentTemp").html(datacurrent.main.temp + "&degF");
        $("#currentDescription").html(datacurrent.weather[0].description);
        var iconURLCurr = "http://openweathermap.org/img/w/"+datacurrent.weather[0].icon+".png";
        $("#currentIcon").html("<img src="+iconURLCurr+">");
        convertButton();
      },
      error: function(e) {
        console.log(e.message);
      }
    });
  }

  function getWeatherForecast() {
    $.ajax({
      type: "GET",
      url: urlforecast,
      contentType: "application/json",
      dataType: 'jsonp',
      success: function(data) {
        $("[id*=forcast]").remove(); //remove all forcast-0/1/2 elements for any additional searches
        for (var i=0; i <= 39; i=i+4) {
          $(".forcast-container").append("<div id=forcast-"+i+">");
          $("#forcast-"+i).append("<div id=date-"+i+">");
          $("#forcast-"+i).append("<div id=description-"+i+">");
          $("#forcast-"+i).append("<div id=weather-"+i+">");
          $("#forcast-"+i).append("<div id=icon-"+i+">");
          $("#date-"+i).html(new Date(data.list[i].dt*1000).toLocaleString());
          $("#weather-"+i).html(data.list[i].main.temp + "&degF");
          $("#description-"+i).html(data.list[i].weather[0].description);
          iconURL = "http://openweathermap.org/img/w/"+data.list[i].weather[0].icon+".png";
          $("#icon-"+i).html("<img src="+iconURL+">");
          convertButton();
        }
      },
      error: function(e) {
        console.log(e.message);
      }
    });
  }

  function convertButton() {

    $("#convertTemp").on("click", function() {
        var temp = $("#currentTemp").text();
        if ( temp.includes("°F") ) {
          var tempC = parseFloat($("#currentTemp").text().substring(0, 5));
          var c = ((tempC - 32) / (9/5)).toFixed(2);
          $("#currentTemp").html(c + "&degC");
          $("#convertTemp").html("Convert to Fahrenheit")
        } else if ( temp.includes("°C") ) {
          var tempF = parseFloat($("#currentTemp").text().substring(0, 5));
          var f = (tempF * (9/5) + 32).toFixed(2);
          $("#currentTemp").html(f + "&degF");
          $("#convertTemp").html("Convert to Celcius")
        }
      for (var i=0; i <= 39; i=i+4) { //loop thru forcast-0/1/3 elements and convert
        temp = $("#weather-"+i).text();
        if ( temp.includes("°F") ) {
          tempC = parseFloat($("#weather-"+i).text().substring(0, 5));
          c = ((tempC - 32) / (9/5)).toFixed(2);
          $("#weather-"+i).html(c + "&degC");
          $("#convertTemp").html("Convert to Fahrenheit")
        } else if ( temp.includes("°C") ) {
          tempF = parseFloat($("#weather-"+i).text().substring(0, 5));
          f = (tempF * (9/5) + 32).toFixed(2);
          $("#weather-"+i).html(f + "&degF");
          $("#convertTemp").html("Convert to Celcius")
        }
      }
    });
  }

  // no longer needed
  // function convertKToF(temp) {
  //   return Math.floor(temp * 9/5-459.67);
  //}

});
//http://api.openweathermap.org/data/2.5/forecast/weather?q=London&APPID=dc5c471a3ee9bd58ab9eba6bc4d12e73
