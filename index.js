let restIds = [];
let latitude = 0;
let longitude = 0;
let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','y','z'];

$('#startBtn').on('click', event => {
  $('.loader').show();
  $('#start-section').hide();
  getDataFromApi(alphabet[Math.floor((Math.random() * 24) + 0)], latitude, longitude, displayData);
})

$('#directionsBtn').on('click', event => {
  $('.loader').show();
  $('#result-section').hide();
  let randomNumber = Math.floor((Math.random() * 20) + 0);
  getRestaurantInfo(restIds[randomNumber], displayRestaurant);
})

function showResult(result) {
  latitude = result.geometry.location.lat();
  longitude = result.geometry.location.lng();
  googlePlacesApi();
  $('#location-section').hide();
}

function getLatitudeLongitude(callback, address) {
  address = address || 'Ferrol, Galicia, Spain';
  geocoder = new google.maps.Geocoder();
  if(geocoder) {
    geocoder.geocode({'address': address}, function (results, status) {
      if(status == google.maps.GeocoderStatus.OK) {
        callback(results[0]);
      }
    });
  }
}

$('#locationBtn').on('click', event => {
  $('.loader').show();
  console.log('Getting location');
  let address = document.getElementById('address').value;
  getLatitudeLongitude(showResult, address);
})

function displayRestaurant(data) {
  $('.loader').hide();
  $('#result-section').show();
  $('#restName').text(data.name);
  $('#address').text(data.location.address);
  $('#averageNum').text("$" + data.average_cost_for_two);
  $('#restCat').text(data.cuisines);
  $('#restImage').attr('src', data.featured_image);
  $('#rating').text("Average Rating: " + data.user_rating.aggregate_rating + " (" + data.user_rating.rating_text + ")");
}

function getRestaurantInfo(query, callback) {
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
  let randomNumber = Math.floor((Math.random() * 20) + 0);
  getRestaurantInfo(restIds[randomNumber], displayRestaurant);
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
  $.ajax(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true`, {
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
  $.ajax(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=food&key=AIzaSyCiYfZl22H043R3ENoXjr7vbM83aQj9XcY`, {
    method: 'GET',
    success: (response) => {
      for(let i=0; i<response.results.length;i++) {
        restIds.push(response.results[i].place_id);
      }
      console.log(response);
      let randomNumber = Math.floor((Math.random() * response.results.length-1) + 0);
      getLocationDetails(restIds[randomNumber]);
    }
  });
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
  $('#result-section').show();
  $('#nextBtn').show();
}

$('#nextBtn').on('click', event => {
  $('#result-section').hide();
  $('#nextBtn').hide();
  let randomNumber = Math.floor((Math.random() * restIds.length-1) + 0);
  getLocationDetails(restIds[randomNumber]);
  console.log(restIds[randomNumber]);
  $('.loader').show();
})

function renderWSIE() {
  $('#result-section').hide();
  $('#start-section').hide();
  $('#location-section').show();
  $('.loader').hide();
  $('#nextBtn').hide();
  $(getLocation);
  //$(googlePlacesApi);
}

$(renderWSIE);
