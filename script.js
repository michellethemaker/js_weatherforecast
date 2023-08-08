class WeatherData{
    constructor(){
        this.data = null;
        this.area = null;
        this.forecast = null;
        this.latitude = null;
        this.longitude = null;
    }
    
    async fetchData(testdata){
    try {
      const response = await fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast') // API URL
      const data = await response.json()
      
      this.data = data;
      // // Process the API response
      const weatherData = data; // Assuming the API response has a 'weather' key
      for (const forecast of weatherData.items[0].forecasts) {
          if (forecast.area === testdata) {
          console.log(`Successful data fetch. Weather forecast for ${forecast.area}: ${forecast.forecast}`);
          this.area = forecast.area;
          this.forecast = forecast.forecast;
          const coords = weatherData.area_metadata.find((area) => area.name === this.area);
          this.latitude = coords.label_location.latitude;
          this.longitude = coords.label_location.longitude;
          console.log("coords: ", this.latitude, this.longitude);
          break;
          }
          else{
            // Cancel out forecast
            this.area = null;
            this.forecast = null;
          }
      }
      }
 
    catch (error) {
    console.error('Error fetching data:', error);
    throw error;
    }
  }
  
    fetchForecast(){
      return this.forecast;
    }

    displayPin() {
      // Get the map image element and the pin container element
      const pin = document.getElementById('pin');
      const lat = this.latitude;
      const long = this.longitude;
      
      // note that x = based on long, y = based on lat. 
      // Y is inverted as coords=cartesian, png is normal
      // not the most accurate, esp as coords are on a spherical map and adjustments must be made
      const pixelX = scale(long, 103.635, 103.987, 0,950);
      const pixelY = scale(lat, 1.205926, 1.445, 600, 0); 

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

const weatherDataInstance = new WeatherData();

async function addItem() {
  var userInput = document.getElementById("location").value;
  // if userInput === data.items[0].forecasts, accept
          
  if (userInput.trim() !== ""){
  console.log(weatherDataInstance.fetchData(userInput));
  await weatherDataInstance.fetchData(userInput);
  const forecast = weatherDataInstance.fetchForecast();
  if (forecast !== null){
  weatherInfo.textContent = "Current forecast for "+ userInput + ": " + weatherDataInstance.fetchForecast();
  weatherDataInstance.displayPin();
      }
  else{
    weatherInfo.textContent = "Location not found!";
  }
    }
  }

function alertTime(){
    alert("whaddup");
  }

  //add event listener for add button
  const addButton = document.getElementById("addButton");
  addButton.addEventListener("click", addItem);

  //add event listener for alert button
  const alertButton = document.getElementById("alertButton");
  alertButton.addEventListener("click", alertTime);
  
  // text for weatherInfo
  const weatherInfo = document.getElementById("weatherInfo")

  //add event listener for text box
  const searchBox = document.getElementById("location");
  searchBox.addEventListener("keypress", function(event){
    if (event.key === "Enter"){
        event.preventDefault(); //required to prevent reset of webpage
        console.log("enter key detected");
        addItem();
    }
  });

  function scale (number, inMin, inMax, outMin, outMax){
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }



