let restIds = [];
let latitude = 0;
let longitude = 0;
let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','y','z'];
var map;
var startCount = 0;

$('#startBtn').on('click', event => {
  $('.loader').show();
  $('#start-section').hide();
  getDataFromApi(alphabet[Math.floor((Math.random() * 24) + 0)], latitude, longitude, displayData);
})


function showResult(result) {
	console.log(result[0].geometry);
  latitude = result[0].geometry.location.lat;
  longitude = result[0].geometry.location.lng;
  console.log(latitude);
  console.log(longitude);
  googlePlacesApi();
  $('#location-section').hide();
}

function getLatitudeLongitude(callback, address) {
  address = address || 'Ferrol, Galicia, Spain';
  $.ajax(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCiYfZl22H043R3ENoXjr7vbM83aQj9XcY`, {
	method: 'GET',
	success: (response) => {
		showResult(response.results);
	}
});
}

$('#locationBtn').on('click', event => {
  $('.loader').show();
  console.log('Getting location');
  let address = document.getElementById('address').value;
  getLatitudeLongitude(showResult, address);
})

function displayRestaurant(data) {

  $('#nextBtn').show();
  $('#mainText').text(data.name);
  $('#price').text("$" + data.average_cost_for_two + " (Average cost for two)");
  $('#restCat').text(data.cuisines);
  $('#restImage').attr('src', data.featured_image);
  $('#rating').text(data.user_rating.aggregate_rating + " (" + data.user_rating.rating_text + ")");
  $('#websiteBtn').attr('href', data.url);
  $('#directionsBtn').attr('href', `http://maps.google.com/maps?q=${data.location.address}`);
  $('.loader').hide();
  $('#imageContainer').show()
  $('#restSummary').show();
}

function getRestaurantInfo(query, callback) {
	console.log(query);
  const settings = {
    headers: {
      'user-key': '71d3b2da9be5426b8548cb6255342503'
    },
    data: {
      'res_id': query
    },
    dataType: 'json',
    url: `https://developers.zomato.com/api/v2.1/restaurant`,
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

function displayData(data) {
  for(let i=0;i<data.restaurants.length;i++) {
    restIds.push(data.restaurants[i].restaurant.id);
  }
  var randomNumber = Math.floor(Math.random() * (restIds.length)) + 0;
  //getRestaurantInfo(restIds[randomNumber], displayRestaurant);
}

function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    renderWSIE();
  }
}

function getDataFromApi(query, lat, long, callback) {
  const settings = {
    headers: {
    'user-key': '71d3b2da9be5426b8548cb6255342503'
  },
  data: {
    q: query,
    lat: lat,
    lon: long
  },
  dataType: 'json',
  url: `https://developers.zomato.com/api/v2.1/search`,
  type: 'GET',
  success: callback
};

$.ajax(settings);
}

function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  $.ajax(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}`, {
    method: 'GET',
    success: (response) => {
      console.log(response.results[0].formatted_address);
      $('#address').val(response.results[0].formatted_address);
    }
  });
  $('.loader').hide();
}

function displayGoogleData(data) {
  console.log(data);
}

function googlePlacesApi() {
  // $.ajax(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=food&key=AIzaSyCiYfZl22H043R3ENoXjr7vbM83aQj9XcY`, {
  //   method: 'GET',
  //   success: (response) => {
  //     for(let i=0; i<response.results.length;i++) {
  //       restIds.push(response.results[i].place_id);
  //     }
  const settings = {
    headers: {
    'user-key': '71d3b2da9be5426b8548cb6255342503'
  },
  data: {
    lat: latitude,
    lon: longitude,
    start: startCount,
    count: 20
  },
  dataType: 'json',
  url: `https://developers.zomato.com/api/v2.1/search`,
  type: 'GET',
  success: callback
};

$.ajax(settings);
}

function callback(data) {
	console.log(data);
	let max = data.restaurants.length-1;
	let randomNumber = Math.floor((Math.random() * max + 1) + 0);
	console.log(data.restaurants[randomNumber]);
	for(let i=0; i<data.restaurants.length;i++) {
		restIds.push(data.restaurants[i].restaurant.id);
	}
	console.log(randomNumber);
  if(startCount < 80) {
    startCount = startCount + 20;
    googlePlacesApi();
  }
	getRestaurantInfo(restIds[randomNumber], displayRestaurant);
}
function getLocationDetails(restId) {
  console.log(restId);
  $.ajax(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${restId}&key=AIzaSyCiYfZl22H043R3ENoXjr7vbM83aQj9XcY`, {
    method: 'GET',
    success: (response) => {
      console.log(response);
      $('#mainText').text(response.result.name);
      $('#rating').text("Rating: " + response.result.rating);
      if(response.result.opening_hours.open_now) {
        $('#price').text("Currently Open");
      }
      else {
        $('#price').text("Currently Closed");
      }
      $('#number').text(response.result.international_phone_number);
      $('#directionsBtn').attr('href', response.result.url);
      $('#websiteBtn').attr('href', response.result.website);
    }
  });
  $('.loader').hide();
  $('#imageContainer').show()
  $('#restSummary').show();
  $('#nextBtn').show();
}

$('#nextBtn').on('click', event => {

  $('#imageContainer').hide()
  $('#restSummary').hide();
  $('#nextBtn').hide();
  let max = restIds.length-1;
	let randomNumber = Math.floor((Math.random() * max + 1) + 0);
  getRestaurantInfo(restIds[randomNumber], displayRestaurant);
  console.log(restIds[randomNumber]);
  console.log(randomNumber);
  $('.loader').show();
})

function renderWSIE() {
  $('#imageContainer').hide()
  $('#restSummary').hide();
  $('#start-section').hide();
  $('#location-section').show();
  $('.loader').hide();
  $('#nextBtn').hide();
  $(getLocation);
  //$(googlePlacesApi);
}

$(renderWSIE);
