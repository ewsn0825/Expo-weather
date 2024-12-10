import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;

// console.log(width);

export default function App() {
  const API_KEY = "dc8e13a03ce83ddf9a99d858e07fc46a";

  const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Rain: "rains",
    Drizzle: "rain",
    Thunderstorm: "lightning",
  };

  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);

    const { list } = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      )
    ).json();

    const filteredList = list.filter(({ dt_txt }) =>
      dt_txt.endsWith("09:00:00")
    );
    // console.log(filteredList.length);
    setDays(filteredList);
  };

  useEffect(() => {
    getWeather();
  }, []);
  return (
    //view는 컨테이너에 해당 div 같은 역할

    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.dayText}>{day.dt_txt.split(" ")[0]}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={55}
                  marginTop={-60}
                  color="white"
                />
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar
        style="light
        
      }"
      />
    </View>
  );
}

//styleSheet.creat 하면 자동완성 기능 해줌
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0EA7A5",

    // alignItems: "center",
    // justifyContent: "center",
  },
  city: {
    flex: 1.2,

    alignItems: "center",
    justifyContent: "center",
  },
  cityName: {
    fontSize: 45,
    fontWeight: 500,
    color: "white",
  },
  weather: {
    // flex: 3,
    // backgroundColor: "blue",
  },
  day: {
    width: SCREEN_WIDTH,
    // flex: 1,
    // justifyContent: "",

    alignItems: "flex-start",
    paddingHorizontal: 20,
    // backgroundColor: "teal",
  },
  dayText: {
    fontSize: 30,
    fontWeight: 600,
    color: "white",
  },
  temp: {
    // marginTop: 50,
    fontSize: 110,
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
  },
});
