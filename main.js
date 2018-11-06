$(document).ready(initializeApp)

function initializeApp(){
    clickHandler(); //runs click handler
    populateMovies();
    // addressCoordinates();
}
/****************************************************************************************************
 * clickHandler
 * @params {undefined} none
 * @returns: {undefined} none
 * Attaches click handler to run different functions when clicking on their respective buttons*/

function clickHandler(){
    $('#submitButton').on('click', getYelpData);
    $('.backButton').on('click', backButton);
    $('#searchForm').on('submit', (e) => {
        let searchText = $('#searchText').val();
        getMovies(searchText);
        e.preventDefault();
    });
}
function backButton(){
    $('#searchBarContainer').css('display', 'none');
    $('.poster').removeAttr('src');
    $('.starIcon').removeClass("fas fa-star");
    $('.searchNearby').empty();
    $('.mapOfTheaters').empty();
    $('.movieRatingData').empty();
    $('.movieTitle').empty();
    $('.movieTrailer').empty();
    $('.summary').empty();
    $('.reviewTitle').empty();
    $('.movieSummary').empty();
    $('.nytReview').empty();
    $('.searchBarContainer').css('display', 'none');
    $('.backButton').css('display','none');
    $('#map').css('display', 'none');
    populateMovies();
}
    

async function populateMovies(){
    await movieListingsOnDOM(); //appends movies to the dom
    $('.movieRow').on('click', clickHandlerToOpenNewPage)
    $(".movieRow").hover(function(){
        $(".movieEffects").hover(function(){
            $(this).addClass('darkPoster');
            $(this).next().removeClass('movieCardHide');
            }, function(){
                $(this).removeClass('darkPoster');
                $(this).next().addClass('movieCardHide');
        });
    });
}







//Global Variables
var movieListings = [];
var summary;
var linkToReview;
var addTrailerRow;
var lat;
var lng;
var yelpResult;
var moviePagesLoaded = 4;



//has ajax paramaters
//@calls ajax new york times
//@params called query value is movie title
var titleOfMovie = null;
async function newYorkTimesAjax (movieTitle){
    titleOfMovie = movieTitle;
    var newYorkTimesParams = {
      url: "https://api.nytimes.com/svc/movies/v2/reviews/search.json",
      method: 'GET',
      data: {
        'api-key': "8f55164da30c48c9ba4dc79d9fce1827",
          "query": movieTitle,
      },
      success: newYorkTimesAjaxSuccessful,
      error: newYorkTimesAjaxError,
    }
    
    

    await $.ajax( newYorkTimesParams );
}


// * @params responseData
// * returns link and summary for movie
function newYorkTimesAjaxSuccessful(responseData){
    if(responseData.results[0] === undefined || titleOfMovie !== responseData.results[0].display_title){
        console.log("responseData:", responseData);
        newYorkTimesAjaxError()
    }else{
        console.log("responseData:", responseData);
        summary = $('<div>').text(responseData.results[0].summary_short);
        linkToReview = $('<a>').text(responseData.results[0].link.url).attr('href', responseData.results[0].link.url).attr('target', "_blank");
    }
}




// * @returns appends text that says they are unavailable at this time
function newYorkTimesAjaxError(){
  console.log('error NYT');
  linkToReview = $('<div>').text('Link not available for this movie');
  summary = $('<a>').text('Summary not available for this movie');
}


for(var i = 1; i < moviePagesLoaded+1; i++){


var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/movie/now_playing?page=" + i + "&language=en-US&api_key=487eb0704123bb2cd56c706660e4bb4d",
    "method": "GET",
    "headers": {},
    "data": "{}",
    "movie_id": "{}"
  }

  $.ajax(settings).done(function (response) {
    console.log('Response: ' + response);
    movieListings.push(response);
  });
}
/****************************************************************************************************
 * successfulTmdbCall
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during success of tmdb AJAX Call*/

function successfulTmdbCall(response){
    console.log('Successful tmdb Call');
    movieListing.push(response);
}

/****************************************************************************************************
 * failedTmdbCall
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during fauilure of tmdb AJAX Call*/

function failedTmdbCall(){

    

}



// * movieListingsOnDOM Function
// * @param  {} none 
// * @returns: {} none 
// * appends movieListings to the DOM*/
function movieListingsOnDOM(){
    for(var j = 0; j < moviePagesLoaded; j++){
    for(var i = 0; i < movieListings[j].results.length; i++){
        var movieTitle = movieListings[j].results[i].title;
        var moviePoster = movieListings[j].results[i].poster_path;
        var movieRating = movieListings[j].results[i].vote_average;
        var themoviedb = movieListings[j].results[i].id;
        var addMovieRow = $('<div>').addClass('movieRow').attr({'data-title': movieTitle,'data-id': themoviedb, 'movieRating': movieRating});
        var addMoviePoster = $('<img>').addClass('movieEffects').attr('src', 'http://image.tmdb.org/t/p/w185' + moviePoster);
        var addMovieContainer = $('<div>').addClass('movieCardInfo').addClass('movieCardHide');

        var addMovieTitle = $('<p>').addClass('movieTitle ');
        addMovieTitle.append(movieTitle);
        var addReviewStar = $('<i>').addClass(' fas fa-star').css('color', 'yellow');
        var addMovieRating = $('<p>').addClass('movieRating');
        addMovieRating.append(addReviewStar, " ", movieRating);
        addMovieContainer.append(addMovieTitle, addMovieRating);
        $(".movie-container").append(addMovieRow);
        addMovieRow.append(addMoviePoster, addMovieContainer);
    }
}
}

/****************************************************************************************************
 * getYelpData
 * @params {undefined} none
 * @returns: {undefined} none
 * Runs the Yelp AJAX call to a proxy server that will communicate with Yelp*/

async function getYelpData() {
    var location = $('#searchBar').val();
    var yelpAjaxConfig = {
        dataType: 'json',
        url: 'https://yelp.ongandy.com/businesses',
        method: 'post',
        data: {
            api_key: 'vLTZK9vBCWnWpR8vfCy5vw5ETsP2DPvVCwLlY2ClGyuVTnPiARAr8FNjqp65605CkAJvbLV-ggaSDVqRkAvB_srvLDlpCLspzizXD368OWFdrXjUrMi55_I5yQ6QW3Yx',
            location: location,
            term: 'movie theater',
            sort_by: 'distance'
        },
        // api_key: 'vLTZK9vBCWnWpR8vfCy5vw5ETsP2DPvVCwLlY2ClGyuVTnPiARAr8FNjqp65605CkAJvbLV-ggaSDVqRkAvB_srvLDlpCLspzizXD368OWFdrXjUrMi55_I5yQ6QW3Yx',
        // // latitude: 33.6846, //This section needs to be updated with the latitude based on user input coming from MapBox
        // // longitude: -117.8265, //This section needs to be updated with the longitude based on user input coming from MapBox
        location: location,
        term: 'movie theater',
        success: successfulYelpCall,
        error: failedYelpCall,
    }
    await $.ajax(yelpAjaxConfig);
}

/****************************************************************************************************
 * successfulYelpCall
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during success of Yelp AJAX Call*/

function successfulYelpCall(response){
    console.log('Yelp call ran successfully');
    console.log('Theater Name: ',response.businesses[0]['name']);
    console.log('Coordinates: ',response.businesses[0]['coordinates']);
    console.log('Latitude: ',response.businesses[0]['coordinates']['latitude']);
    console.log('Longitude: ',response.businesses[0]['coordinates']['longitude']);
    console.log('Distance :',((response.businesses[0]['distance'])*0.00062137).toFixed(2), ' mi');
    console.log('Street: ',response.businesses[0]['location']['display_address'][0]);
    console.log('City, State, Zip: ',response.businesses[0]['location']['display_address'][1]);
    console.log('Phone: ',response.businesses[0]['phone']);
    console.log('Rating :',response.businesses[0]['rating']);
    console.log('Review :',response.businesses[0]['review_count']);
    yelpResult = response.businesses;
    initMap();
}

/****************************************************************************************************
 * createMapMarkers
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during success of Yelp AJAX Call to pass Yelp object into function to create map markers*/

function createMapMarkers(results){
    var listings = results.businesses;
    for (var i = 0; i < listings.length; i++) {
        var coords = listings[i].coordinates;
        var latLng = new google.maps.LatLng(coords['latitude'],coords['longitude']);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map
});}}

/****************************************************************************************************
 * FailedYelpCall
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during failure of Yelp AJAX Call*/

function failedYelpCall(){
    console.log('Yelp call Failed');
}

/****************************************************************************************************
 * createYelpListings
 * @params {undefined} none
 * @returns: {undefined} none
 * Puts Yelp data in a listings page*/

// function createYelpListings(){
//
//     for(var i = 0; i < )
//
//
//
//     $('<div>').append()
//
//
//
//
// }



async function addressCoordinates(){
    var ajaxParams = {
        url: "https://api.opencagedata.com/geocode/v1/json",
        data: {
            key: "52645efc693e4815825c94314f6d5f77",
            q: $('.searchBar').val()
            // q: 'Columbus, Ohio'
        },
        success: successfullAddressCoordinates
    }  
    await $.ajax(ajaxParams)
}
function successfullAddressCoordinates(responseCoordinates){
    console.log('responseCoordinates', responseCoordinates);
    if(responseCoordinates.resluts !== undefined){
        lat = responseCoordinates.results[0].geometry.lat;
        lng = responseCoordinates.results[0].geometry.lng;
        initMap(lat,lng);
    }
     
    
}

var map;
function initMap() {
    var learningFuze = {lat: 33.634857, lng: -117.74044};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: learningFuze
    });

    // var contentString = '<div id="content">' +
    //     '<div id="siteNotice">' +
    //     '</div>' +
    //     '<h1 id="firstHeading" class="firstHeading">Theater Name</h1>' +
    //     '<div id="bodyContent">' +
    //     '</div>' +
    //     '</div>';

    // var infowindow = new google.maps.InfoWindow({
    //     content: contentString,
    //     maxWidth: 250,
    //     maxHeight: 100
    // });

    // var marker = new google.maps.Marker({
    //     position: learningFuze,
    //     map: map,
    //     title: 'LearningFuze'
    // });

    // marker.addListener('click', function () {
    //     infowindow.open(map, marker);
    // });
    if(yelpResult !== undefined){
        for(var i = 0; i < 10; i++){
            var position = {lat: yelpResult[i]['coordinates']['latitude'], lng: yelpResult[i]['coordinates']['longitude']};
            var newMarker = new google.maps.Marker({
                position: position,
                map: map,
                title: yelpResult['name'], 
            });
            var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">' + yelpResult[i]['name'] + '</h1>' +
            '<div id="bodyContent">' +
            '</div>' +
            '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 250,
                maxHeight: 100
            });
            // var marker = new google.maps.Marker({
            //     position: learningFuze,
            //     map: map,
            //     title: yelpResult['name']
            // });
    
            (function(marker, infowindow) {
                marker.addListener('click', function () {
                    infowindow.open(map, marker);
                });
            })(newMarker, infowindow);
    }
    
}}


async function clickHandlerToOpenNewPage (){
  console.log($(this));
  var someOfThis = $(this);
  console.log($(this).attr('data-title'))
  $('.movieRow').remove();
  await findMovieID($(this).attr('data-id'));
  await newYorkTimesAjax($(this).attr('data-title'))
  await dynamicallyCreateMovieInfoPage($(this));
  await addressCoordinates();

}

/****************************************************************************************************
 * YouTubeApi
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during failure of Yelp AJAX Call*/
function findMovieID(tmdbID){
var settings =  {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/movie/" + tmdbID + "/videos?language=en-US&api_key=487eb0704123bb2cd56c706660e4bb4d",
    "method": "GET",
    "headers": {},
    "data": "{}"
  }
  
  $.ajax(settings).done(function (response) {
    console.log('Origninsal API Data: ' + response.results[0].key);
    dynamicYoutubeVideo(response.results[0].key);
  });
}

/****************************************************************************************************
 * 
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs during failure of Yelp AJAX Call*/

function dynamicYoutubeVideo(movieTrailerID) {
    console.log('It should be on the DOM')
    addTrailerRow = $('<iframe>');
    addTrailerRow.addClass('youtubePlayer').attr('src', 'https://www.youtube.com/embed/' + movieTrailerID).attr('frameborder', '0').attr('allow', 'autoplay; encrypted-media').attr('allowfullscreen');
    $(".movieTrailer").empty();
}

function dynamicallyCreateMovieInfoPage(someOfThis){
  $('.poster').attr('src', someOfThis[0].firstElementChild.currentSrc)
  $('.starIcon').addClass("fas fa-star");
  $(".movieRatingData").text(' ' + someOfThis.attr('movieRating')+ ' / 10');
  $('#map').css('display', 'inline-block');
  $('.searchBarContainer').css('display', 'inline-block');
  $('.movieTitle').text(someOfThis.attr('data-title'))
  $('.movieTrailer').append(addTrailerRow);
  $('.summary').text("Summary")
  $('.reviewTitle').text("Read the review")
  $('.searchNearby').text('Search Nearby Theaters');
  $('.mapOfTheaters').text('Nearby Theaters');
  $('.backButton').css('display', 'inline-block').text('Back').addClass('btn btn-danger');
  $('.movieSummary').append(summary);
  $('.nytReview').append(linkToReview);
}

/****************************************************************************************************
 * Movie Search
 * @params {undefined} none
 * @returns: {undefined} none
 * Function runs when a user searches amovie title*/

function getMovies(searchText){
    // debugger;
    $('.movie-container').empty();
    axios.get('https://api.themoviedb.org/3/search/movie?api_key=487eb0704123bb2cd56c706660e4bb4d&language=en-US&query=' + searchText + '&page=1&include_adult=false')
    .then((response) => {
        console.log('Search API', response);
        
        let movies = response.data.results;
        let output = '';
        $.each(movies, (index, movie) => {
            let movieUrl = "";
            //If no movie poster image use placeholder image
            if (movie.poster_path === null) {
                movieUrl = "./assets/img/noImage.png"
            } else {
                movieUrl = "http://image.tmdb.org/t/p/w185/" + movie.poster_path;
            }
            console.log('running')
            output += `
            <div class="movieRow" data-title="${movie.title}" data-id="${movie.id}" movierating="${movie.vote_average}">
                <img class="movieEffects" src="${movieUrl}">
                <div class="movieCardInfo movieCardHide">
                    <p class="movieTitle">${movie.title}</p>
                    <p class="movieRating"><i class="fas fa-star" style="color: yellow;"></i>${movie.vote_average}</p>
                </div>
            </div>
            `
            
        });
        $(".movie-container").append(output);
    })
    .catch((err) => {
        console.log(err);
    });
};
