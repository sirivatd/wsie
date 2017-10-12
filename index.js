let restIds = [];
let latitude = 0;
let longitude = 0;


$('#startBtn').on('click', event => {
  $('.loader').show();
  $('#start-section').hide();
  $('#result-section').show();
  getDataFromApi("", latitude, longitude, displayData);
})

$('#nahBtn').on('click', event => {
  $('.loader').show();
  let randomNumber = Math.floor((Math.random() * 20) + 0);
  getRestaurantInfo(restIds[randomNumber], displayRestaurant);
})

function displayRestaurant(data) {
  $('.loader').hide();
  $('#restName').text(data.name);
  $('#address').text(data.location.address);
  $('#averageNum').text("$" + data.average_cost_for_two);
  $('#restCat').text(data.cuisines);
  $('#restImage').attr('src', data.featured_image);
  $('#rating').text("Average Rating: " + data.user_rating.aggregate_rating + " (" + data.user_rating.rating_text + ")");
}

function  getRestaurantInfo(query, callback) {
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

  $('.loader').hide();
  $('#locationText').hide();
}

function renderWSIE() {
  var element = document.getElementById("headerIcon");
  element.addEventListener("click", function() {
    renderWSIE();
  })
  $('#result-section').hide();
  $('#start-section').show();
  $('.loader').hide();
  getLocation();
  $('.loader').show();
}

$(renderWSIE);