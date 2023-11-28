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


async function postUserInput(){
    
    const searchBox = document.getElementById('searchBox')
    const inputValue = searchBox.value
    setTimeout(console.log(inputValue), 1000)


        // const inputValueObj = {
        //     user_input: `${inputValue}`
        // }
        // const response = await fetch('http://127.0.0.1:5000/get_flights', {
        //     mode: 'no-cors',
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(),
        // })

        // console.log(response.json())

        const inputValueObj = {
            user_input: `${inputValue}`
        }

        console.log(inputValueObj)
        const response = await fetch('http://127.0.0.1:5000/process_input', {
            // mode: 'no-cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputValueObj),
        })

        console.log(JSON.stringify(inputValueObj))
        console.log(response)
    }
    



searchBtn.addEventListener('click', postUserInput)


