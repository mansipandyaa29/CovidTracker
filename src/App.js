import React, { useState, useEffect } from "react";
import "./App.css";
import {MenuItem, FormControl, Select, Card, CardContent,} from "@material-ui/core";
import InfoBox from "./InfoBox"; <- #links this up to Infobox.js
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css"; #done to actually view the map

const App = () => {
  
  const [country, setInputCountry] = useState("worldwide"); <---- #used to help us rememebr which country we selected
  const [countryInfo, setCountryInfo] = useState({}); <---- #get information about a particular country
  const [countries, setCountries] = useState([]); <---- #for getting all countries in drop down menu
  const [mapCountries, setMapCountries] = useState([]); <---- #used to get those red circles
  const [tableData, setTableData] = useState([]);<---- #getting data for table which shows cases in order
  const [casesType, setCasesType] = useState("cases"); <----- # done to change map when info box clicked
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 }); <---- #centre of map
  const [mapZoom, setMapZoom] = useState(3);<---- set the zoom of the map
------------------------------------------------------------------------------------------------------
#used to get the data for worlwide in default mode 
useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
------------------------------------------------------------------------------------------------------
  #uses api to fetch all country names from the website
  #async -> send a request to a server, wait for it, do something with the information
  
  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json()) #when it comes back with the response, i just want json
        .then((data) => {
          const countries = data.map((country) => ({ <---- #goes through the website api and gets value and name of country
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData); #taken from util.js
        });
    };

    getCountriesData();
  }, []);
--------------------------------------------------------------------------------------------------
#used to get data for a particular country
  const onCountryChange = async (e) => { <----- #function called when someone clicks on worldwide dropdown
    const countryCode = e.target.value;

    const url =
      #if drop down selected is worldwide it will go to first link and get info for everything(default), if not(ie we select a specific country) then it will do the second
      #one and get data about the specific country
      countryCode === "worldwide"?"https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
      #the code below will centre in and zoom on the clicked country
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]); 
        setMapZoom(4);
      });
  };
---------------------------------------------------------------------------------------
  return (
    <div className="app">
      <div className="app__left">
-----------------------------------------------------------------------------------------    
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
------------------------------------------------------------------------------------------
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")} 
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"} #if we're on a certain box
            cases={prettyPrintStat(countryInfo.todayCases)} #todayCases is a field in the API data which is called here(cases recorded today)
            total={numeral(countryInfo.cases).format("0.0a")} #total cases since covid started
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)} #todayRecovered is a field in the API data which is called here(cases recovered today)
            total={numeral(countryInfo.recovered).format("0.0a")} #total recovered since covid started
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)} #todayDeaths is a field in the API data which is called here(deaths today )
            total={numeral(countryInfo.deaths).format("0.0a")} #total deaths since covid started
          />
        </div>
--------------------------------------------------------------------------------------------------
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div> -----------> # <div className="app__left">
--------------------------------------------------------------------------------------------------
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
              
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
              
          </div> -----------> #<div className="app__information">
        </CardContent>
      </Card>
    </div> --------------> #<div className="app"> 
  );
};

export default App;
