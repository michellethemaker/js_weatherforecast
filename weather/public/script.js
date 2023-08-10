class tempData{
    constructor(){
        this.data = null;
        this.stations = null;
        this.temp = null;
        this.latitude = null;
        this.longitude = null;
    }
    
    async fetchTemp(){
    try {
      // clear previous labels first
      const clearLabels = document.querySelectorAll('.label');
      clearLabels.forEach(label=>{
        label.remove();
        console.log("temperature labels removed");
      });

      const response = await fetch('https://api.data.gov.sg/v1/environment/air-temperature') // API URL
      const data = await response.json()
      
      this.data = data;
      // // Process the API response
      const weatherData = data; // Assuming the API response has a 'weather' key
      for (const stations of weatherData.metadata.stations) {
        const temp = weatherData.items[0].readings.find(stationtemp =>stationtemp.station_id === stations.device_id);
        // console.log(`${this.stations} temp is:  ${temp.value}`);
        // console.log(stations.id, stations.name, stations.location.latitude, stations.location.longitude);
          this.data = stations.id;
          this.temp = temp.value;
          this.stations = stations.name;
          this.latitude = stations.location.latitude;
          this.longitude = stations.location.longitude;
          const pixelX = scale(this.longitude, 103.635, 103.987, 30,430);
          const pixelY = scale(this.latitude, 1.205926, 1.445, 290, 0); 
          
          // Create label for each station
          const label = document.createElement("div");
          label.className = "label";
          label.innerText = this.temp;
          label.title = this.stations;
          label.style.left = pixelX + 'px';
          label.style.top = pixelY + 'px';  
          label.style.display = 'block';
          templabels.appendChild(label);
      }
    }
    catch (error) {
    console.error('Error fetching data:', error);
    throw error;
    }
  }
   
}

class weatherData{
  constructor(){
    this.area = null;
    this.stations = null;
    this.weather = null;
    this.latitude = null;
    this.longitude = null;
  }

  async fetchStations(){
    try{
      const response = await fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast')
      const data = await response.json();

      this.data = data;
      const weatherData = data;
      console.log(this.data);
      console.log(data.items[0].forecasts);

      for (const forecast of weatherData.items[0].forecasts) {
        console.log(`Successful data fetch. Weather forecast for ${forecast.area}: ${forecast.forecast}`);
        this.area = forecast.area;
        this.forecast = forecast.forecast;
        const coords = weatherData.area_metadata.find((area) => area.name === this.area);
        const station = forecast.area;
        const foreca1st = forecast.forecast;
        const latitude = coords.label_location.latitude;
        const longitude = coords.label_location.longitude;
        console.log("coords: ", this.latitude, this.longitude);
        
        const weatherlabel = document.createElement("div");
        weatherlabel.className = "weatherlabel";
        weatherlabel.innerText = this.area;
        weatherlabel.title = this.forecast;
        weatherlabel.style.display = 'block';

        weatherlabel.addEventListener("mouseover", () => {
          weatherInfo.innerText = `Location is ${station}, forecast is ${foreca1st}`;
          weatherInfo.style.fontWeight = "bold";
          console.log(`Location is ${latitude} - ${longitude}`);
          this.displayPin(latitude, longitude);
          const imageURL = weatherImageMap[foreca1st];
          weatherImage.src = imageURL;
          console.log(weatherImage.src);
        });
        weatherlabel.addEventListener("mouseout", () => {
          weatherInfo.innerText = "Location Information";
          weatherInfo.style.fontWeight = "normal";
          const pin = document.getElementById('pin');
          pin.style.display = "none";

        });
        weatherlabels.appendChild(weatherlabel);
    }

    }
    catch(error){
      console.error('Error fetching weather data: ', error);
      throw error;
    }
  }

  displayPin(latitude, longitude) {
    // Get the map image element and the pin container element
    const pin = document.getElementById('pin');
    const lat = latitude;
    const long = longitude;
    
    
    // note that x = based on long, y = based on lat. 
    // Y is inverted as coords=cartesian, png is normal
    // not the most accurate, esp as coords are on a spherical map and adjustments must be made
    const pixelX = scale(long, 103.635, 103.987, 0,430);
    const pixelY = scale(lat, 1.205926, 1.445, 280, 0); 

    // Find the area data in the API response
    console.log(`Latitude for ${this.area}: `+ lat + ` i.e. ${pixelY}`);
    console.log(`Longitude for ${this.area}: ` + long + ` i.e. ${pixelX}`);
  
    // Set the position of the pin using absolute positioning
    pin.style.left = pixelX + 'px';
    pin.style.top = pixelY + 'px';
  
    // Optionally, you can set the background color and size of the pin
    // Show the pin on the map
    pin.style.display = 'block';
  }
}
const tempDataInstance = new tempData();
const fetchTempInterval = setInterval(tempDataInstance.fetchTemp, 5000);
const weatherDataInstance = new weatherData();
weatherDataInstance.fetchStations();

const weatherImageMap = {
  "Partly Cloudy (Day)": "weather_cloudy.png",
  "Cloudy": "weather_cloudy.png",
  "Light Showers": "weather_showers.png",
  "Thundery Showers": "thunderstorm.png",
};
  // weatherinfo and image
  const weatherInfo = document.getElementById("weatherInfo");
  const weatherImage = document.getElementById("forecast_image");

  // //add event listener for text box
  // const searchBox = document.getElementById("textbox");
  const labels = document.getElementById("templabels");

  function scale (number, inMin, inMax, outMin, outMax){
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }




  