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
    console.log(response)
    console.log(response.status)
    const apiData = await response.json()
    console.log(apiData)
    return(apiData)
}

//Transforming json into table

async function tabulateFlights(){
    try {
        flightJSON = await getFlightInfo()
    } catch (error) {
        console.log(error)
    }

    //declare new table element
    //loop through each item in flight json and append row to table -> use forEach
    //append table to flightResults
}

//All functions relating to extracting, transforming and loading the flight information
async function loadFlightInfo(){
    await postUserInput()
    await getFlightInfo()
}

searchBtn.addEventListener('click', loadFlightInfo)


