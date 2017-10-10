let restIds = [];
let latitude = 0;
let longitude = 0;

function displayRestaurant(data) {
  console.log(data);
  $('#restImage').attr('src', data.featured_image);
  $('#restName').text(data.name);
  $('#address').text(data.location.address);
  $('#averageCost').text("Average Cost For Two: $" + data.average_cost_for_two);
  $('#cuisine').text(data.cuisines);
  $('#rating').text("Average Rating: " + data.user_rating.aggregate_rating + " (" + data.user_rating.rating_text + ")");
  $('.loader').hide();
  $('#start-section').hide();
  $('.result-section').show();
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

$('#nahBtn').on('click', event => {
  $('.loader').show();
  let randomNumber =Math.floor((Math.random() * 20) + 0);
  getRestaurantInfo(restIds[randomNumber], displayRestaurant);
})

function displayData(data) {
  console.log(data.restaurants.length);
  for(let i=0;i<data.restaurants.length;i++) {
    restIds.push(data.restaurants[i].restaurant.id);
  }
  console.log(restIds);
  let randomNumber =Math.floor((Math.random() * 20) + 0);
  getRestaurantInfo(restIds[randomNumber], displayRestaurant);
}

function getDataFromApi(query, callback) {
  const settings = {
    headers: {
      'user-key': '71d3b2da9be5426b8548cb6255342503'
    }, 
    data: {
      q: query,
      lat: latitude,
      lon: longitude
    },
    dataType: 'json',
    url: `https://developers.zomato.com/api/v2.1/search`,
    type: 'GET',
    success: callback
  };
  
  $.ajax(settings);
}

$('#startBtn').on('click', event => {
  console.log('Hi');
  $('.loader').show();
  let userQuery = $('#user-input').val();
  getDataFromApi(userQuery, displayData);
})

function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Something went wrong");
  }
}

function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
}
function renderWSIE() {
  $('.loader').hide();
  $('.result-section').hide();
  getLocation();
}

$(renderWSIE);