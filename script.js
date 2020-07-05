const city = $('#cityInput').val()
const queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=d175ce97bfe64d9a627bbac014ecb740&units=metric'
const queryUVURL = "https://api.openweathermap.org/data/2.5/onecall?"
let citySearch = ''

//Check for anything inside localStorage for city history
let cityList = [];
cityList = JSON.parse(localStorage.getItem("cityList"));

if (!cityList) {
    cityList = [];
}
//Calling prevCity function to render HTML for searched list.
prevCity()
    
$('#cityInput').on('submit', function(event){
    event.preventDefault();
    let enteredCity = city.val();
    citySearch = enteredCity;

    const searchDiv = $("<div class='searchedCities'>")
    const list = $("<li>");

    list.text(cityList);
    searchDiv.append(list);

    $(".cityList").append(searchDiv);
    renderCity();

})

const renderCity = function (){
    $.ajax({    
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        result = response
        console.log(result)


        $(".todayName").empty();
        $(".todayIcon").empty();
        $(".todayTemp").empty();
        $(".todayHumidity").empty();




        const title = (result.city.name) 
        console.log(title)

        const date = moment(result.list[0].dt * 1000).format('L');
        console.log(date)

        const headingToday = $("<div>")
        $(headingToday).append(title, date)

        let image = result.list[0].icon
        const forecastImg = ($("<img>"), src = image)
        $("#weatherToday").append(headingToday, forecastImg)

        const temperature = result.list[0].main.temp
        console.log(temperature)
    })
}

const prevCity = function(){
    if (!cityList) {

    } else {
        $(".cityList").empty();
        for (let i = 0; i < cityList.length; i++) {
            console.log(cityList);

            const searchDiv = $("<div class='searchedCities'>")
            const list = $("<li>");

            list.text(cityList[i]);

            searchDiv.append(list);

            $(".cityList").append(searchDiv);

        }

    }
}