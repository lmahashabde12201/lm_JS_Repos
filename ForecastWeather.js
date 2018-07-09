
/*****
Name: ForecastWeather.js
Description: Uses the openweathermap API to get the next 5 days weather forecast.  The forecast is available at 3 hour points
             and the below program aggregates the numbers to get the Min Temperature and the Max temperature for the Day and
             the description from the last data point is indicative as the weather description for the whole day.
Author: Lakshmi Venkatraman Mahashabde           

*****/
var request = require("request")
var moment = require("moment")

var url = "http://api.openweathermap.org/data/2.5/forecast?zip=90001&units=Imperial&APPID=28b707d7362465c3da0f23e3c86b207b"


var weatherdict;  //derived weather data for a day
var weatherdata = []; //derived forecast weather data for the next 5 days
var weatherdataIndex=0;
var dt;
var ctr = 0;
//{'date', 'temp', 'temp_min', 'temp_max', 'description'};
var weatherdesc = {
      'cloudy': 'https://s3.amazonaws.com/rupert-public-files/2557696227/cloudy.png',
      'rainy': 'https://s3.amazonaws.com/rupert-public-files/2557696227/rainy.png',
      'sunny': 'https://s3.amazonaws.com/rupert-public-files/2557696227/sunny.png',
      'snow': 'http://openweathermap.org/img/w/13d.png',
      'thunderstorm': 'http://openweathermap.org/img/w/11d.png'
};

//Request from the URL
request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
    //    console.log(body) // Print the json response
        body.list.forEach((list, index)=> {
            dt = new Date(list.dt_txt.slice(0,10));

            if (weatherdata.length > 0 && +dt === +weatherdata[weatherdata.length-1].date) {
                weatherdata[weatherdata.length-1].temp_min = Math.min(weatherdata[weatherdata.length-1].temp_min, list.main.temp_min);              
                weatherdata[weatherdata.length-1].temp_max = Math.max(weatherdata[weatherdata.length-1].temp_max,list.main.temp_max);   
                    weatherdict.description = list.weather[0].description;      
                    if (list.weather[0].id >= 200 && list.weather[0].id < 300) {
                        weatherdict.w_image = weatherdesc['thunderstorm'];                      
                    }
                    else if (list.weather[0].id >= 300 && list.weather[0].id < 600) {
                        weatherdict.w_image = weatherdesc['rainy'];
                    }
                    else if (list.weather[0].id >= 600 && list.weather[0].id < 700) {
                        weatherdict.w_image = weatherdesc['snow'];
                    }
                    else if (list.weather[0].id === 800) {
                        weatherdict.w_image = weatherdesc['sunny'];
                    }
                    else {
                        weatherdict.w_image = weatherdesc['cloudy'];                        
                    }                           
            }
            else {
                    weatherdict = {};
                    weatherdict.date = dt.getMonth() + "-" + dt.getDate() + "-" + dt.getFullYear();
                    weatherdict.temp_min = list.main.temp_min;
                    weatherdict.temp_max = list.main.temp_max;
                    weatherdict.description = list.weather[0].description;      
                    if (list.weather[0].id >= 200 && list.weather[0].id < 300) {
                        weatherdict.w_image = weatherdesc['thunderstorm'];                      
                    }
                    else if (list.weather[0].id >= 300 && list.weather[0].id < 600) {
                        weatherdict.w_image = weatherdesc['rainy'];
                    }
                    else if (list.weather[0].id >= 600 && list.weather[0].id < 700) {
                        weatherdict.w_image = weatherdesc['snow'];
                    }
                    else if (list.weather[0].id === 800) {
                        weatherdict.w_image = weatherdesc['sunny'];
                    }
                    else {
                        weatherdict.w_image = weatherdesc['cloudy'];                        
                    }


                    weatherdata.push(weatherdict);

                    if (weatherdata.length >= 1) {
                        console.log(weatherdata[weatherdata.length-1])
                    }

            } // end of if-else


        }
        ) //end of body.list.forEach()

    }
}
) //end of request()



