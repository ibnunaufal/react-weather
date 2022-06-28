import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import React, { useEffect, useState} from 'react';
import WeatherInfo from './components/WeatherInfo';
import ReloadIcon from './components/ReloadIcon';
import { colors } from './utils/Index';

const WEATHER_API_KEY = 'b9ceeacbe1eb0dd1ca2b36cb2dc6a11e'

const BASE_WEATHER_URL = 'https://api.openweathermap.org/'

export default function App() {

  const [errorMessage, setErrorMessage] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [unitsSystem, setUnitsSystem] = useState('metric')

  useEffect(() => {
    load()
  }, [])

  async function load(){
    console.log("load")
    setCurrentWeather(null)
    setErrorMessage(null)
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if(status !== 'granted'){
        setErrorMessage('Access not granted')
        return 
      }

      const location = await Location.getCurrentPositionAsync()

      var {lat, long} = location.coords

      if(!lat){
        lat = -7.3319
        long = 110.4928
      }
      
      const url = BASE_WEATHER_URL + 'data/2.5/weather?lat='+lat+'&lon='+long+'&appid=' + WEATHER_API_KEY+"&units=metric"
      
      const response = await fetch(url)

      const result = await response.json()

      if(response.ok){
        setCurrentWeather(result)
      }else{
        setErrorMessage(result.message)
      }


    } catch (error) {
      setErrorMessage(error.message)
    }
  }
  if(currentWeather){
    const { main : {temp}} = currentWeather
    return (
      
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <ReloadIcon load={load}/>
          <WeatherInfo currentWeather={currentWeather} />
        </View>
      </View>
    );
  }else if(errorMessage){
    return (
      <View style={styles.container}>
        <Text> { errorMessage } </Text>
        <StatusBar style="auto" />
      </View>
    );
  }else{
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
  }
});
