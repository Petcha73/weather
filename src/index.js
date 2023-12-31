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
      <h1>{props.temp?.toFixed(1)}°</h1>
      <p>Feels like {props.feels_like?.toFixed(1)}°</p>
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
      <p>{props.details.temp.day?.toFixed(1)}°</p>
    </div>
  );
}

function Weather() {
  const today = new Date();

  const [weatherData, setWeatherData] = useState({
    dayName: today.toString().slice(0, 3),
    dayNum: today.getDate().toString(),
    dayCount: today.getDay(),
    city: "Paris",
    country: "FR",
  });

  useEffect(() => {
    let parisUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=48.866667&lon=2.333333&units=metric&exclude=minutely,hourly&appid=471ff7a7c3ee11573ac813188eb5fb37`;

    fetch(parisUrl)
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
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="weather">
      <div className="widgets">
        <Temp temp={weatherData.temp} feels_like={weatherData.feels_like} />

        <Icon
          description={weatherData.description}
          mainIconUrl={weatherData.mainIconUrl}
        />
      </div>

      <Days daily={weatherData.daily} dayCount={weatherData.dayCount} />
      <DateAndTime
        city={weatherData.city}
        country={weatherData.country}
        dayName={weatherData.dayName}
        dayNum={weatherData.dayNum}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Weather />);
