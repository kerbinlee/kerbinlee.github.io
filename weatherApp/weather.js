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

/* convert month abbreviation to full month */
function fullMonth(abbreviation) {
  if (abbreviation === "Jan")
    return "January";
  else if (abbreviation === "Feb")
    return "February";
  else if (abbreviation === "Mar")
    return "March";
  else if (abbreviation === "Apr")
    return "April";
  else if (abbreviation === "Jun")
    return "June";
  else if (abbreviation === "Jul")
    return "July";
  else if (abbreviation === "Aug")
    return "August";
  else if (abbreviation === "Sep")
    return "September";
  else if (abbreviation === "Oct")
    return "October";
  else if (abbreviation === "Nov")
    return "November";
  else if (abbreviation === "Dec")
    return "December";
}

/* remove leading 0 from hour */
function removeZero(num) {
  if (num == "01")
    return "1";
  else if (num == "02")
    return "2";
  else if (num == "03")
    return "3";
  else if (num == "04")
    return "4";
  else if (num == "05")
    return "5";
  else if (num == "06")
    return "6";
  else if (num == "07")
    return "7";
  else if (num == "08")
    return "8";
  else if (num == "09")
    return "9";
  else
    return num;
}

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

function callbackFunction(data) {
  var pgh; //for selected HTML elements
  
  weatherObject = data;  
  
  pgh = document.getElementById("searchbox");

  if (weatherObject.query.results == null){
    pgh.style.color = "red";
  }
  else
  {
    pgh.style.color = "grey";
  }
  
  /* get build date of weather data and tokenize */
  var buildDate = JSON.stringify(weatherObject.query.results.channel.lastBuildDate);
  var timeAndDate = buildDate.split(" ");
  var time = timeAndDate[4].split(":");
  
  /* update time */
  pgh = document.getElementById("time");
  pgh.textContent = "Today " + removeZero(time[0]) + ':' + time[1] + timeAndDate[5].toLowerCase();
  
  /* update time for mobile */
  pgh = document.getElementById("timeMobile");
  pgh.textContent = "Today " + removeZero(time[0]) + ':' + time[1] + timeAndDate[5].toLowerCase();
  
  /* update date */
  pgh = document.getElementById("date");
  pgh.textContent = fullMonth(timeAndDate[2]) + ' ' + timeAndDate[1] + ", " + timeAndDate[3]; //need to convert to full month
  
  /* update current conditions icon */
  pgh = document.getElementById("currentConditionIcon");
  pgh.src = "./assets/" + icon(weatherObject.query.results.channel.item.condition.code)
  
  /* update location */
  pgh = document.getElementById("location");
  pgh.textContent = weatherObject.query.results.channel.location.city + ", " + weatherObject.query.results.channel.location.region;

  /* update location for mobile */
  pgh = document.getElementById("locationMobile");
  pgh.textContent = weatherObject.query.results.channel.location.city + ", " + weatherObject.query.results.channel.location.region;
  
  /* update temp */
  pgh = document.getElementById("currentTemp");
  pgh.textContent = weatherObject.query.results.channel.item.condition.temp + "\u00B0 F"; //need degree symbol and F as superscript;
  
  /* update current condition text */
  pgh = document.getElementById("conditionText");
  pgh.textContent = weatherObject.query.results.channel.item.condition.text.toLowerCase();

  /* update humidity */
  pgh = document.getElementById("humidity");
  pgh.textContent = weatherObject.query.results.channel.atmosphere.humidity + '%';
  
  /* update wind speed */
  pgh = document.getElementById("wind");
  pgh.textContent = weatherObject.query.results.channel.wind.speed + "mph";
  
	pgh = document.getElementsByClassName("forecastBox");

  var i;
  var br = document.createElement('br');
  for(i = 0; i < 10; i++) {
    pgh[i].children[0].textContent = weatherObject.query.results.channel.item.forecast[i].day;
    pgh[i].children[1].children[0].src = "./assets/" + icon(weatherObject.query.results.channel.item.forecast[i].code); 
    pgh[i].children[2].textContent = weatherObject.query.results.channel.item.forecast[i].text.toLowerCase();
    pgh[i].children[3].children[0].textContent = weatherObject.query.results.channel.item.forecast[i].high + "\u00B0";
    pgh[i].children[3].children[1].textContent = weatherObject.query.results.channel.item.forecast[i].low + "\u00B0";
  }
}

function gotNewPlace() {
  /* get text from search bar */
  var newPlace = document.getElementById("searchbox").value;

  /* remove old script element if it exists */
  var oldScript = document.getElementById("jsonpCall");
  if (oldScript != null) {
    document.body.removeChild(oldScript);
  } 
  
  /* add script for new location */
  var script = document.createElement('script');
  script.src = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + newPlace + "')&format=json&callback=callbackFunction";
  script.id = "jsonpCall";
  document.body.appendChild(script);
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