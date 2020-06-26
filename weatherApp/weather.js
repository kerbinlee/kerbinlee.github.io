var left = 0;
var offset = 0;

function init() { 
  var container = document.getElementById("weatherBox"); 
  var containerWidth = container.clientWidth; 
  console.log(window.innerWidth);
  var forecastBoxes = document.getElementsByClassName("forecastBox"); 
  var n = forecastBoxes.length;
  if (document.documentElement.clientWidth <= 780) {
    forecastBoxes[0].style.width = containerWidth - 30 + "px";
    forecastBoxes[0].style.left = "0px";
  }
  else
  {
    var i;
    for (i = 0; i < n; i++) { 
      forecastBoxes[i].style.width = (containerWidth-150)/5 + "px";
      forecastBoxes[i].style.left = offset * (containerWidth)/5 + "px";
    } 
  }
} 

/* run init code */
init();
gotNewPlace("Davis, CA");

/* match weather condition code to image file */
function icon(code) {
  if (code == 19 || code == 20 || code == 21 || code == 22 || code == 26 || code == 27 || code == 28)
    return "cloudy.png";
  else if (code == 29 || code == 30 || code == 33 || code == 34 || code == 44)
    return 'part-sun.png';
  else if (code == 8 || code == 9 || code == 10 || code == 11 || code == 12 || code == 35 || code == 39 || code == 40)
    return "rain.png";
  else if (code == 5 || code == 6 || code == 7 || code == 13 || code == 14 || code == 15 || code == 16 || code == 17 || code == 18 || code == 41 || code == 42 || code == 43 || code == 46)
    return "snow.png";
  else if (code == 3 || code == 4 || code == 37 || code == 38 || code == 45 || code == 47)
    return "thunder.png";
  else if (code == 0 || code == 1 || code == 2 || code == 23 || code == 24)
    return "wind.png";
  else return "sunny.png";
}

/* called when new weather arrives */;
var weatherObject;

function callbackFunction() {
  var data = this.responseText;
  console.log("data:" + data);
  var pgh; //for selected HTML elements
  
  weatherObject = JSON.parse(data);  
  
  pgh = document.getElementById("searchbox");

  if (Object.entries(weatherObject.location).length === 0) {
    pgh.style.color = "red";
    return;
  }
  else
  {
    pgh.style.color = "grey";
  }
  
  /* get build date of weather data and tokenize */
  var buildDate = weatherObject.current_observation.pubDate;
  var time = new Date(buildDate*1000);
  
  /* update time */
  const timeOptions = { hour12: 'true', hour: 'numeric', minute: 'numeric', timeZone: weatherObject.location.timezone_id };
  pgh = document.getElementById("time");
  pgh.textContent = "Today " + time.toLocaleTimeString("en-US", timeOptions).toLocaleLowerCase();
  
  /* update time for mobile */
  pgh = document.getElementById("timeMobile");
  pgh.textContent = "Today " + time.toLocaleTimeString("en-US", timeOptions).toLocaleLowerCase();
  
  /* update date */
  const dateOptions = { month: 'long', day: 'numeric', year: 'numeric', timeZone: weatherObject.location.timezone_id };
  pgh = document.getElementById("date");
  pgh.textContent = time.toLocaleDateString("en-US", dateOptions);
  
  /* update current conditions icon */
  pgh = document.getElementById("currentConditionIcon");
  pgh.src = "./assets/" + icon(weatherObject.current_observation.condition.code)
  
  /* update location */
  pgh = document.getElementById("location");
  pgh.textContent = weatherObject.location.city + ", " + weatherObject.location.region;

  /* update location for mobile */
  pgh = document.getElementById("locationMobile");
  pgh.textContent = weatherObject.location.city + ", " + weatherObject.location.region;
  
  /* update temp */
  pgh = document.getElementById("currentTemp");
  pgh.textContent = weatherObject.current_observation.condition.temperature + "\u00B0 F";
  
  /* update current condition text */
  pgh = document.getElementById("conditionText");
  pgh.textContent = weatherObject.current_observation.condition.text.toLowerCase();

  /* update humidity */
  pgh = document.getElementById("humidity");
  pgh.textContent = weatherObject.current_observation.atmosphere.humidity + '%';
  
  /* update wind speed */
  pgh = document.getElementById("wind");
  pgh.textContent = weatherObject.current_observation.wind.speed + "mph";
  
  pgh = document.getElementsByClassName("forecastBox");

  var i;
  var br = document.createElement('br');
  for(i = 0; i < 10; i++) {
    pgh[i].children[0].textContent = weatherObject.forecasts[i].day;
    pgh[i].children[1].children[0].src = "./assets/" + icon(weatherObject.forecasts[i].code); 
    pgh[i].children[2].textContent = weatherObject.forecasts[i].text.toLowerCase();
    pgh[i].children[3].children[0].textContent = weatherObject.forecasts[i].high + "\u00B0";
    pgh[i].children[3].children[1].textContent = weatherObject.forecasts[i].low + "\u00B0";
  }
}

function gotNewPlace(defaultPlace) {
var newPlace = (defaultPlace === undefined ? document.getElementById("searchbox").value : defaultPlace);
var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", callbackFunction);
	oReq.open("GET", "https://maythird.ddns.net/query?location=" + newPlace + "&format=json");
	oReq.send();
}

function more() {
  var container = document.getElementById("weatherBox"); 
  var containerWidth = container.clientWidth; 
	var forecastBoxes = document.getElementsByClassName("forecastBox");
  var n = forecastBoxes.length;
  offset--;
  if (offset == -5) {
    var nextButton = document.getElementById("next");
    nextButton.style.display = "none";
  }
  var prevButton = document.getElementById("previous");
  prevButton.style.display = "flex";
  var i;
  for (i = 0; i < n; i++) {
    forecastBoxes[i].style.left = offset * (containerWidth)/5 + "px";
  }
}

function previous() {
  var container = document.getElementById("weatherBox"); 
  var containerWidth = container.clientWidth; 
	var forecastBoxes = document.getElementsByClassName("forecastBox");
  var n = forecastBoxes.length;
  offset++;
  if (offset == 0) {
    var prevButton = document.getElementById("previous");
    prevButton.style.display = "none";
  }
  var nextButton = document.getElementById("next");
  nextButton.style.display = "flex";
  var i;
  for (i = 0; i < n; i++) {
    forecastBoxes[i].style.left = offset * (containerWidth)/5 + "px";
  }
}
