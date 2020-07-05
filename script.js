const city = $('#cityInput');
const queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=';
const apiKey = '&appid=d175ce97bfe64d9a627bbac014ecb740&units=metric';
const queryUVURL = "https://api.openweathermap.org/data/2.5/onecall?";
let citySearch = "";

//Check for anything inside localStorage for city history
let cityList = [];
cityList = JSON.parse(localStorage.getItem("cityList"));

if (!cityList) {
    cityList = [];
}
//Calling prevCity function to render HTML for searched list.
prevCity();

//Submit event listener. Appending search to list in previous search div then rendering city Forecast info.    
$('#cityIn').on('submit', function(event){
    event.preventDefault();
    let enteredCity = city.val();
    citySearch = enteredCity;
    console.log(citySearch)
    const searchDiv = $("<div class='searchedCities'>")
    const p = $("<p>");
    p.text(enteredCity);
    searchDiv.append(p);
    $(".cityList").append(searchDiv);
    renderCity();
});
//Event listener on click of items in prev city list. Running render function of Forecast for that city item value.
$(".searchedCities").on('click', function(){
    let prevSearch = $(this).text();
    citySearch = prevSearch;
    renderCity();
    $('.weekForecast').empty();
});

//loop over previous city array and append to div. 
function prevCity(){
    if (!cityList) {
    } else {
        $(".cityList").empty();
        for (let i = 0; i < cityList.length; i++) {
            console.log(cityList);
            const searchDiv = $("<div class='searchedCities'>")
            const p = $("<p>");
            p.text(cityList[i]);
            searchDiv.append(p);
            $(".cityList").append(searchDiv);
        }
    }
}

//Function to render Forecast information
function renderCity(){
    const location = citySearch;
    const apiURL = queryURL + location + apiKey

    //API search for weather that includes Lat and Long for location 
    $.ajax({    
        url: apiURL,
        method: 'GET'
    }).then(function(response){
        result = response
        console.log(result);

        //Creating variables for rendering with API info later on
        let cityName = result.city.name;
        let latitude = result.city.coord.lat;
        let longitude = result.city.coord.lon;
        let date = "";
        let temperature = "";
        let humidity = "";
        let wind = "";
        let UV = "";

        //API for weather search that includes UV index
        const uVSearch = queryUVURL + "lat=" + latitude + "&lon=" + longitude + "&exclude=hourly,minutelyy&units=metric" + apiKey;
        console.log(uVSearch);
        $.ajax({
            url: uVSearch,
            method: "GET"
        }).then(function(response){

            //Clear all classes for new search info to be rendered
            $(".todayName").empty();
            $(".todayTemp").empty();
            $(".todayHumidity").empty();
            $(".todayWind").empty();
            $(".todayUV").empty();

            //Gather information from API JSON to store in variables
            date = moment(response.current.dt * 1000).format('L');
            console.log(date);
            weatherIcon = response.current.weather[0].icon;
            console.log(weatherIcon);
            humidity = response.current.humidity;
            console.log(humidity);
            wind = response.current.wind_speed;
            console.log(wind);
            UV = response.current.uvi;
            console.log(UV);
            const title = cityName + date;
            console.log(title);
            temperature = response.current.temp;
            console.log(temperature);

            let weatherIconURL = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

            //Appending info to class sections in HTML to render on page
            $(".todayName").text(title);
            $(".todayIcon").attr("src", weatherIconURL);
            $(".todayTemp").append("Temperature: " + temperature + "&#8451;");
            $(".todayHumidity").text("Humidity: " + humidity + "%");
            $(".todayWind").text("Wind Speed: " + wind + "km/h");
            $(".todayUV").append("UV index: <span id='indexUV'>" + UV + "<span>")

            //Change color background of UV index
            if (UV <= 2) {
                $("#indexUV").addClass("low");
            }
            if (UV > 2 && UV < 5) {
                $("#indexUV").addClass("moderate");
            }
            if (UV > 5 && UV < 7) {
                $("#indexUV").addClass("high");
            }
            if (UV > 7 && UV < 10) {
                $("#indexUV").addClass("veryHigh");
            }
            if (UV >= 10) {
                $("#indexUV").addClass("extreme");
            }
            if (!$("#weatherToday").hasClass("weatherToday")) {
                $("#weatherToday").addClass("weatherToday");
            }
            if (!$("#current-info").hasClass("current-info")) {
                $("#current-info").addClass("current-info");
            }
// Creating variables for weekly forecast
            let weekForecast = response.daily;
            let count = 6;
            let dailyForecast = weekForecast.slice(1, count);

            $(".weekForecast").empty();

//Gathering data for each day of the week
            Object.keys(dailyForecast).forEach(function(key) {

                let weekDate = dailyForecast[key].dt;
                weekDate = moment(weekDate * 1000).format('L');
                let weekTemp = dailyForecast[key].temp.day;
                let weekHumidity = dailyForecast[key].humidity;
                let icon = dailyForecast[key].weather[0].icon;
                let iconURL = "http://openweathermap.org/img/wn/" + icon + ".png";

                //creating elements for the weekly forecast cards
                const weekCard = $("<div class='col day-forcast'>");
                const titleDate = $("<h5>");
                const weekIcon = $("<img>");
                const titleTemp = $("<p>");
                const titleHumidity = $("<p>");

                //Appending info to cards
                titleDate.text(weekDate);
                weekIcon.attr("src", iconURL);
                titleTemp.append("Temperature: " + weekTemp + "&#8451;");
                titleHumidity.text("Humidity: " + weekHumidity + "%");

                weekCard.append(titleDate, weekIcon, titleTemp, titleHumidity);
                $(".weekForecast").append(weekCard);
            });
        });

        //Setting local storage into array for city search
        cityList.indexOf(cityName) === -1 ? cityList.push(cityName) : console.log("item already on array");
        localStorage.setItem("cityList", JSON.stringify(cityList));
    });

}
