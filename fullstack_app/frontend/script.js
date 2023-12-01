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
    userSearchMatches = document.getElementById("userSearchMatches");
    userSearchMatches.innerHTML = '';
    const terms = await autocompleteMatch(val);


    for (let i = 0; i < terms.length; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = terms[i];
            listItem.onclick = function () {
                document.getElementById('userSearchBox').value = terms[i];
                userSearchMatches.innerHTML = '';
            };
            userSearchMatches.appendChild(listItem);
        }
}

//Search Matches visibility


// Search button to get response and post selection

const searchBtn = document.getElementById('searchBtn')
const flightResults = document.getElementById('flightResults')

async function postUserInput(){
    
    const userSearchBox = document.getElementById('userSearchBox')
    const inputValue = userSearchBox.value
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

        return inputValue
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

async function tabulateFlights(user_input){
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
    let tableHeading = document.createElement('h3')
    console.log('This does run 3')
    

    
    let tableHeadersText = ['Flight Number', 'Destination','Flight Departure Time' ,'Delay (Mins)', 'Weather at Destination']

    //Loop through headers to get table headers

    tableHeadersText.forEach((header) =>{
        let th = document.createElement('th')
        th.innerText = header
        tableHeaders.appendChild(th)
    })

    flightTable.append(tableHeaders)

    console.log('this has run 3.5')
    //loop through each item in flight json and append row to table -> use forEach
    
    let flightList = flightJSON.flights
    console.log(flightList) // THIS LINE CAUSED A BUNCH ERRORS JUST BECAUSE IT WAS ABOVE THE PREVIOUS LINE!!! TOOK ME 30 MINS TO REALIZE WHAT I HAD DONE
    //error lens -> extension
    console.log('this does run 4')
    for (let flight of flightList){
        let tr = document.createElement('tr')
        
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
            delayText = `${flight.delay_time}`
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
    const br = document.createElement('br')
    tableHeading.textContent = `Flight departures from ${user_input} `
    flightResults.innerHTML = ''
    flightResults.append(tableHeading)
    flightResults.append(br)
    flightResults.append(br)
    flightResults.append(flightTable)
}

//All functions relating to extracting, transforming and loading the flight information
async function loadFlightInfo(){
    flightResults.innerHTML = ''
    const input = await postUserInput()
    console.log('get  flight info has run')

    let tableHeading = document.createElement('h3')
    let img = document.createElement('img')
    img.setAttribute('src', './assets/200w.webp')
    tableHeading.textContent = 'Loading Your Flights...'
    flightResults.append(tableHeading)
    flightResults.append(img)

    await tabulateFlights(input)
    console.log('tablulate flights has run')
}

searchBtn.addEventListener('click', async function(){
    console.log('Button Pressed')
    await loadFlightInfo()
})


//Potential refactoring/Next steps:
/*

Aesthetics:
Have delay time take departure time and add on delay to give new departure time -> datetime library

Include departure time of selected airport and in the uk -> get location using long and lat then calculate time difference

Include some weather emoji or image for weather section -> regex keywords in weather?

Loading bar as table builds -> have to search

Functionality:

Refactor code, abstract function DRY, and make sure each function does one thing and one thing only *NEXT

Deploying to cloud? -> pythonanywhere, aws?

Add sql database to store historic searches -> sql alchemy

Python backend handle error that may occur if icao can't be found on airport api -> error handling ****** COMPLETED ******


*/


// nodejs react
//write data to backend api

// reactjs typescript