// Creating a list of airport names

async function getData(){
    const response = await fetch('./assets/airports2.json')
    const apiData = await response.json()
   
    return(apiData)
}


async function getAirportNames(){
    let airportNames = []

     try {
        airports = await getData()

        for(airport of airports){
            airportNames.push(airport.name)
        }

        return airportNames
    } 
    
    catch (error) {
        
        console.log(error)        
    }

}


//Searchbox with autocomplete function
async function autocompleteMatch(input) {
  if (input == '') {
    return [];
  }

  search_terms = await getAirportNames()
  var reg = new RegExp(input, 'i')
  return  search_terms.filter(function(term) {
	  if (term.match(reg)) {
  	  return term;
	  }
  });
}

async function showResults(val) {
    searchMatches = document.getElementById("searchMatches");
    searchMatches.innerHTML = '';
    const terms = await autocompleteMatch(val);


    for (let i = 0; i < terms.length; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = terms[i];
            listItem.onclick = function () {
                document.getElementById('searchBox').value = terms[i];
                searchMatches.innerHTML = '';
            };
            searchMatches.appendChild(listItem);
        }
}

//Search Matches visibility


// Search button to get response and post selection

const searchBtn = document.getElementById('searchBtn')
const flightResults = document.getElementById('flightResults')

async function postUserInput(){
    
    const searchBox = document.getElementById('searchBox')
    const inputValue = searchBox.value
    setTimeout(console.log(inputValue), 1000)

        const inputValueObj = {
            user_input: `${inputValue}`
        }

        console.log(inputValueObj)
        const response = await fetch('http://127.0.0.1:5000/process_input', {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputValueObj),
        })

        console.log(JSON.stringify(inputValueObj))
        console.log(response)
}

// GET flights for user selected airport
async function getFlightInfo(){
    const response = await fetch('http://127.0.0.1:5000/get_flights')
    console.log('getting flights')
    console.log(response)
    console.log(response.status)
    const apiData = await response.json()
    console.log(apiData)
    return apiData
}

//Transforming json into table

async function tabulateFlights(){
    // try {
    //     flightJSON = await getFlightInfo()
    //     console.log(flightJSON)
    // } catch (error) {
    //     console.log(error)
    // }

    flightJSON = await getFlightInfo()
    console.log(flightJSON)
    console.log('This does run 2')

    
    //declare new table element

    let flightTable = document.createElement('table')
    let tableHeaders = document.createElement('tr')
    console.log('This does run 3')
    
    let tableHeadersText = ['Flight Number', 'Destination','Flight Departure Time' ,'Delay', 'Weather at Destination']

    //Loop through headers to get table headers

    // tableHeadersText.forEach((header) =>{
    //     let th = document.createElement('th')
    //     th.innerText = header
    //     tableHeaders.appendChild(th)
    // })

    for (header of tableHeadersText){
        console.log(header)
        let th = document.createElement('th')
        th.innerText = header
       tableHeaders.appendChild(th)
    }

    flightTable.append(tableHeaders)

    console.log('this has run 3.5')
    //loop through each item in flight json and append row to table -> use forEach
    
    let flightList = flightJSON.flights
    console.log(flightList) // THIS LINE CAUSED A BUNCH ERRORS JUST BECAUSE IT WAS ABOVE 150!!! TOOK ME 30 MINS TO REALIZE WHAT I HAD DONE
    console.log('this does run 4')
    for (let flight of flightList){
        let tr = document.createElement('tr')
        let td = document.createElement('td')

        let tdFlightNo = document.createElement('td');
        tdFlightNo.innerText = flight.flight_no;
        tr.appendChild(tdFlightNo);

        let tdDestination = document.createElement('td');
        tdDestination.innerText = flight.destination_name;
        tr.appendChild(tdDestination);

        let tdDepartureTime = document.createElement('td');
        tdDepartureTime.innerText = flight.flight_dep_time;
        tr.appendChild(tdDepartureTime);

        let tdDelayTime = document.createElement('td');
        
        let delayText= null
        if (flight.delay_time === 'None'){
            delayText = 'On Time'
        }
        else{
            delayText = `${flight.delay_time} Minutes`
        }
        tdDelayTime.innerText = delayText;
        tr.appendChild(tdDelayTime);

        let tdWeather = document.createElement('td');
        tdWeather.innerText = flight.weather;
        tr.appendChild(tdWeather);

        flightTable.append(tr);

    }
    console.log(flightTable)
    

    //append table to flightResults
    flightResults.append(flightTable)
}

//All functions relating to extracting, transforming and loading the flight information
async function loadFlightInfo(){
    await postUserInput()
    console.log('get  flight info has run')
    await tabulateFlights()
    console.log('tablulate flights has run')
}

searchBtn.addEventListener('click', async function(){
    console.log('Button Pressed')
    await loadFlightInfo()
})


//Potential refactoring/Next steps:
/*
Have delay time take departure time and add on delay to give new departure time

Include some weather emoji or image for weather section

Loading bar as table builds

Add sql database to store historic searches

Python backend handle error that may occur if icao can't be found on airport api

Include departure time of selected airport and in the uk
*/