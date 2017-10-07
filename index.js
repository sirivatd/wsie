function displayData(data) {
	console.log(data);
	const numOfPlaces = data.results_found;
	$('#numOfPlaces').text(numOfPlaces + " Locations Found");
}

function getDataFromApi(searchTerm, callback) {
	const settings = {
		headers: {
			'user-key': '71d3b2da9be5426b8548cb6255342503'
		},
		data: {
			q: searchTerm
		},
		dataType: 'json',
		url: `https://developers.zomato.com/api/v2.1/search`,
		type: 'GET',
		success: callback
	};
	$.ajax(settings);
}

$('#startBtn').on('click', event => {
	const searchTerm = $('#query-text').val();
	console.log(searchTerm);
	getDataFromApi(searchTerm, displayData);
	$('#start-section').hide();
	$('#question-section').show();
})

$('#question-section').hide();