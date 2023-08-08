class WeatherData{
    constructor(){
        this.data = null;
        this.stations = null;
        this.temp = null;
        this.latitude = null;
        this.longitude = null;
    }
    
    async fetchData(){
    try {

      // clear previous labels first
      const clearLabels = document.querySelectorAll('.label');
      clearLabels.forEach(label=>{
        label.remove();
        console.log("removed");
      });

      const response = await fetch('https://api.data.gov.sg/v1/environment/air-temperature') // API URL
      const data = await response.json()
      
      this.data = data;
      // // Process the API response
      const weatherData = data; // Assuming the API response has a 'weather' key
      console.log(weatherData.metadata.stations);
      console.log("!!!");
      console.log(weatherData.items[0].readings[0]);
      for (const stations of weatherData.metadata.stations) {
        console.log(stations)
        const temp = weatherData.items[0].readings.find(stationtemp =>stationtemp.station_id === stations.device_id);
        console.log(`${this.stations} temp is:  ${temp.value}`);
        console.log(stations.id, stations.name, stations.location.latitude, stations.location.longitude);
          // console.log(`Successful data fetch. Weather stations for ${stations.id}: ${stations.name}`);
          this.data = stations.id;
          this.temp = temp.value;
          this.stations = stations.name;
          this.latitude = stations.location.latitude;
          this.longitude = stations.location.longitude;
          const pixelX = scale(this.longitude, 103.635, 103.987, 0,430);
          const pixelY = scale(this.latitude, 1.205926, 1.445, 280, 0); 
          
          // Create label for each station
          const label = document.createElement("div");
          label.className = "label";
          label.innerText = this.stations;
          label.title = this.temp;
          label.style.left = pixelX + 'px';
          label.style.top = pixelY + 'px';  
          label.style.display = 'block';
          labels.appendChild(label);
      }
    }
 
    catch (error) {
    console.error('Error fetching data:', error);
    throw error;
    }
  }
   
    displayPin() {
      // Get the map image element and the pin container element
      const pin = document.getElementById('pin');
      const lat = this.latitude;
      const long = this.longitude;
      
      
      // note that x = based on long, y = based on lat. 
      // Y is inverted as coords=cartesian, png is normal
      // not the most accurate, esp as coords are on a spherical map and adjustments must be made
      const pixelX = scale(long, 103.635, 103.987, 0,430);
      const pixelY = scale(lat, 1.205926, 1.445, 280, 0); 

      // Find the stations data in the API response
      console.log(`Latitude for ${this.stations}: `+ lat + ` i.e. ${pixelY}`);
      console.log(`Longitude for ${this.stations}: ` + long + ` i.e. ${pixelX}`);
    
      // Set the position of the pin using absolute positioning
      pin.style.left = pixelX + 'px';
      pin.style.top = pixelY + 'px';
    
      // Optionally, you can set the background color and size of the pin
      // Show the pin on the map
      pin.style.display = 'block';
    }
}

const weatherDataInstance = new WeatherData();
const fetchInterval = setInterval(weatherDataInstance.fetchData, 10000);

async function addItem() {
  var userInput = document.getElementById("textbox").value;          
  if (userInput.trim() !== ""){
    await weatherDataInstance.fetchData();
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
  const searchBox = document.getElementById("textbox");
  searchBox.addEventListener("keypress", function(event){
    if (event.key === "Enter"){
        event.preventDefault(); //required to prevent reset of webpage
        console.log("enter key detected");
        addItem();
    }
  });

  const labels = document.getElementById("labels");

  function scale (number, inMin, inMax, outMin, outMax){
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }



