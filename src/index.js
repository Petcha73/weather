import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function DateAndTime(props) {
  return (
    <div className="date">
      <h1>{props.dayName + " " + props.dayNum}</h1>
      <p>
        Today in {props.city}, {props.country}
      </p>
    </div>
  );
}

function Icon(props) {
  return (
    <div className="icon">
      <img src={props.mainIconUrl} alt="icon" />
      <p>{props.description}</p>
    </div>
  );
}

function Temp(props) {
  return (
    <div className="temp">
      <h1>{props.temp}°</h1>
      <p>Feels like {props.feels_like}°</p>
    </div>
  );
}

function Days(props) {
  return (
    <div className="days">
      <h1>Next 8 days...</h1>
      <div className="daysList">
        {props.daily?.map((el, index) => {
          return (
            <Day
              key={index}
              details={el}
              dayCount={(props.dayCount + index + 1) % 7}
            />
          );
        })}
      </div>
    </div>
  );
}

function Day(props) {
  const dayName = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];

  const url = `http://openweathermap.org/img/wn/${props.details.weather[0].icon}.png`;
  return (
    <div className="day">
      <p>{dayName[props.dayCount]}</p>
      <img src={url} alt="icon" />
      <p>{props.details.temp.day}°</p>
    </div>
  );
}

function Weather() {
  const today = new Date();

  const [weatherData, setWeatherData] = useState({
    dayName: today.toString().slice(0, 3),
    dayNum: today.getDate().toString(),
    dayCount: today.getDay(),
  });

  useEffect(() => {
    //we get the location of the browser through this simple api
    fetch("https://geolocation-db.com/json/", {
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setWeatherData((prev) => {
          return {
            ...prev,
            city: "Viroflay", //data.city,
            country: "FR", //data.country_code,
          };
        });

        //we create a return with the retrieving data
        return `https://api.openweathermap.org/data/3.0/onecall?lat=48.7997&lon=2.1732&units=metric&exclude=minutely,hourly&appid=471ff7a7c3ee11573ac813188eb5fb37`;
        // `https://api.openweathermap.org/data/3.0/onecall?lat=${data.latitude}&lon=${data.longitude}&units=metric&exclude=minutely,hourly&appid=471ff7a7c3ee11573ac813188eb5fb37`;
      })
      .then((url) => fetch(url), {
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })

      .then((response) => response.json())
      .then((data) => {
        setWeatherData((prev) => {
          return {
            ...prev,
            temp: data.current.temp,
            feels_like: data.current.feels_like,
            description: data.current.weather[0].description,
            mainIconUrl: `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`,
            daily: data.daily,
          };
        });
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="weather">
      <div className="widgets">
        <DateAndTime
          city={weatherData.city}
          country={weatherData.country}
          dayName={weatherData.dayName}
          dayNum={weatherData.dayNum}
        />
        <Icon
          description={weatherData.description}
          mainIconUrl={weatherData.mainIconUrl}
        />
        <Temp temp={weatherData.temp} feels_like={weatherData.feels_like} />
      </div>

      <Days daily={weatherData.daily} dayCount={weatherData.dayCount} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Weather />);
