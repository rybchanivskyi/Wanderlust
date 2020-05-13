const clientId = 'SGLIS21UGKTVXZXEFQ4GEVYU4WCVSNAANBYUFIDU1JKNQH3U';
const clientSecret = '5ZBOV1UIWLKWYSJKTHVT1K3NB1V0BKKXFMRSRITEBHDJWXTW';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// OpenWeather Info
const openWeatherKey = 'e6db1a711a038e03a96fdfb417c1685c';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = url + city + `&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200513`;
  try{
    const response = await fetch(urlToFetch);
    if(response.ok) {
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map(element => element.venue);
      return venues;
    }
    throw new Error('Network Error!')
  } catch (error) {
    console.log(error.message);
  }
}

const getForecast = async () => {
  const urlToFetch = weatherUrl + `?&q=${$input.val()}&APPID=${openWeatherKey}`;
  try{
    const response = await fetch(urlToFetch);
    if(response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    }
    throw new Error('Network Error!')
  } catch(error) {
    console.log(error)
  }
}


// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach(($venue, index) => {
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
}
const renderForecast = (day) => {
	let weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => renderVenues(venues));
  getForecast().then(forecast => renderForecast(forecast));
  return false;
}

$submit.click(executeSearch)