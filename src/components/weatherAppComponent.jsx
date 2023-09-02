import axios from "axios";
import { useEffect, useRef, useState } from "react";
import * as Math from "mathjs";
import { BiSearch, BiHistory } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import { TiWeatherCloudy } from "react-icons/ti";
import { TbWind } from "react-icons/tb";
import s from "./weatherAppComponent.module.css";
import user from "./assets/user.png";
import { images } from "./img";

const CurrentDaysFinder = () => {
  const dateObj = new Date();
  const weekDayNumber = dateObj.getUTCDay();
  const DaysArr = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const Next7Days = [];
  for (let i = weekDayNumber + 1; i < weekDayNumber + 8; i++) {
    const currentDay = DaysArr[i % DaysArr.length].substring(0, 3);
    Next7Days.push(currentDay);
  }
  return Next7Days;
};

const url = "https://api.openweathermap.org/data/2.5/weather?";
const WeatherAppComponent = () => {
  CurrentDaysFinder();
  const inputRef = useRef(null);
  const [City, setCity] = useState("");
  const [Data, setData] = useState(null);
  const [AirData, setAirData] = useState(null);
  const [Temp, setTemp] = useState(null);
  const [MinTemp, setMinTemp] = useState(null);
  const [MaxTemp, setMaxTemp] = useState(null);
  const [searchedCities, setSearchedCities] = useState([]);
  const [ForeCastData, setForeCastData] = useState(null);
  const [ForeCastDataMapping, setForeCastDataMapping] = useState({});

  useEffect(() => {
    const ApiCall = async () => {
      if (City !== "") {
        await axios
          .get(url + `q=${City}` + `&appid=f458fe9b85a5aad938afb32733419a3d`)
          .then((res) => {
            setData(res.data);
            if (res?.data !== null) {
              setTemp(Math.floor(Data?.main?.temp ?? 0) - 273);
              setMaxTemp(Math.floor(Data?.main?.temp_max ?? 0) - 273);
              setMinTemp(Math.floor(Data?.main?.temp_min ?? 0) - 273);
            }
          });
      }
    };

    ApiCall();
  }, [City]);

  useEffect(() => {
    const AirApiCall = async () => {
      if (Data !== null) {
        await axios
          .get(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${Data?.coord?.lat}&lon=${Data.coord.lon}&appid=f458fe9b85a5aad938afb32733419a3d`
          )
          .then((d) => {
            setAirData(d.data);
          });
      }
    };
    AirApiCall();
  }, [Data]);
  const fx = () => {
    const x = CurrentDaysFinder();
    const TempData = {};

    if (ForeCastData) {
      ForeCastData.forEach((item, index) => {
        const TempMax = Math.floor(item.main.temp_max) - 273;
        const TempMin = Math.floor(item.main.temp_min) - 273;
        const icon = item.weather[0].icon;
        TempData[x[index]] = [TempMax, TempMin, icon];
      });

      setForeCastDataMapping(TempData);

      console.log(ForeCastDataMapping);
      console.log("ForeCastData01:", ForeCastData);
    }
  };

  useEffect(() => {
    const ForeCastDataApiCall = async () => {
      if (Data !== null || City !== "") {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${City}&cnt=7&appid=f458fe9b85a5aad938afb32733419a3d`
        );

        const responseData = response.data;
        console.log(responseData.list);

        setForeCastData(responseData.list);

        console.log(ForeCastData);
      }
    };

    ForeCastDataApiCall();
  }, [Data, City]);

  useEffect(() => {
    if (ForeCastData !== null) {
      fx();
    }
  }, [ForeCastData]);

  const HandleClick = () => {
    setCity(inputRef.current.value);
    setSearchedCities((prevCities) => [...prevCities, City]);
  };

  console.log("");
  const iconMappings = {
    "01d": images[0].img,
    "02d": images[1].img,
    "03d": images[2].img,
    "04d": images[3].img,
    "09d": images[4].img,
    "10d": images[5].img,
    "11d": images[6].img,
    "13d": images[7].img,
    "50d": images[8].img,
    "01n": images[9].img,
    "02n": images[10].img,
    "03n": images[11].img,
    "04n": images[12].img,
    "09n": images[13].img,
    "10n": images[14].img,
    "11n": images[15].img,
    "13n": images[16].img,
    "50n": images[17].img,
  };

  const weatherIcon = Data?.weather[0]?.icon;
  const iconSrc = iconMappings[weatherIcon];

  const bgMapping = {
    "01d": images[0].bg,
    "02d": images[1].bg,
    "03d": images[2].bg,
    "04d": images[3].bg,
    "09d": images[4].bg,
    "10d": images[5].bg,
    "11d": images[6].bg,
    "13d": images[7].bg,
    "50d": images[8].bg,
    "01n": images[9].bg,
    "02n": images[10].bg,
    "03n": images[11].bg,
    "04n": images[12].bg,
    "09n": images[13].bg,
    "10n": images[14].bg,
    "11n": images[15].bg,
    "13n": images[16].bg,
    "50n": images[17].bg,
  };

  const bgSrc = bgMapping[weatherIcon];

  const AQI = {
    1: ["Good", "#079450"],
    2: ["Fair", "#FFB300"],
    3: ["Moderate", "#FF7E00"],
    4: ["Poor", "#FF0000"],
    5: ["Very Poor", "#7a006c"],
  };
  const AirQuality = AirData?.list[0]?.main.aqi;
  const AqiDivColor = AQI[AirQuality];

  return (
    <div className={s.AppBox}>
      <div className={s.header}>
        <div className={s.location}>
          <HiLocationMarker />
          {Data?.name}
          {", " + Data?.sys.country}
        </div>
        <div className={s.SearchBox}>
          <div className={s.SearchBar}>
            <button
              onClick={() => {
                HandleClick();
              }}
            >
              <BiSearch />
            </button>
            <input type="text" ref={inputRef} placeholder="Search city..." />
          </div>
        </div>
        <div className={s.userLogo}>
          <img src={user} alt="" />
        </div>
      </div>
      <div className={s.weatherInfoBox}>
        <div className={s.WeatherCurrent} style={{ backgroundImage: bgSrc }}>
          <div className={s.weatherTitle}>
            <div className={s.TitleIcon}>
              <TiWeatherCloudy />
              <div></div>
            </div>
            <div className={s.Title}>
              <h1>Weather</h1>
              <p>whats the weather.</p>
            </div>
          </div>
          <div className={s.weatherBody}>
            {Data != null && <img src={iconSrc} alt="" />}
          </div>
          <div className={s.weatherFooter}>
            <div className={s.one}>
              <p>now</p>
              <h1>{Temp + "°C"}</h1>
              <p>{Data?.weather[0].description}</p>
            </div>
            <div className={s.two}>
              <p>‎ </p>
              <h1>{MaxTemp + "°C"}</h1>
              <p>max</p>
            </div>
            <div className={s.three}>
              <p>‎ </p>
              <h1>{MinTemp + "°C"}</h1>
              <p>min</p>
            </div>
          </div>
        </div>
        <div className={s.AirInfo}>
          <div className={s.Airheader}>
            <div className={s.AirIcon}>
              <TbWind />
              <div></div>
            </div>
            <div className={s.AirTitle}>
              <h1>Air Quality</h1>
              <p>Main pollution: PM {AirData?.list[0].components.pm2_5}</p>
            </div>
          </div>
          <div className={s.Airbody}></div>
          <div className={s.Airfooter}>
            <div className={s.Aone}>
              <h1>{AirData?.list[0].components.co}</h1>
              <p>CO</p>
            </div>
            <div
              className={s.Atwo}
              style={{ backgroundColor: AirData != null && AqiDivColor[1] }}
            >
              <h1>{AirData != null && AqiDivColor[0]}</h1>
              <p>AQI</p>
            </div>
            <div className={s.Athree}>
              <h1>{AirData?.list[0].components.o3}</h1>
              <p>O3</p>
            </div>
          </div>
        </div>
        <div className={s.Recent}>
          <div className={s.Rheader}>
            <div className={s.RIcon}>
              <BiHistory />
              <div></div>
            </div>
            <div className={s.RTitle}>
              <h1>Recent Search Cities</h1>
              <p>Other Cities</p>
            </div>
          </div>
          <div className={s.Rbody}>
            <ul>
              {searchedCities
                .filter((city) => city !== "")
                .slice(-5)
                .map((city, index) => (
                  <li key={index}>
                    <h1>{city}</h1>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div className={s.weatherForeCastBox}>
        <div className={s.ForeCastDiv}>
          {Object.entries(ForeCastDataMapping).map(([day, data]) => (
            <div className={s.ForeCastInfo} key={day}>
              <div className={s.Fheader}>
                <h1>{day}</h1>
              </div>
              <div className={s.Fbody}>
                <img src={iconMappings[data[2]]} alt="" />
              </div>
              <div className={s.Ffooter}>
                <p>{data[0] + "°"}</p>
                <span>/</span>
                <p>{data[1] + "°"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherAppComponent;
