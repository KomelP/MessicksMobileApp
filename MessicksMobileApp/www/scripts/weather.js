var OpenWeatherAppKey = "1a54b433082c200d1912846c41b5d446";

function getWeatherWithZipCode() {
    var zipcode = $('#zip-code-input').val();
    var queryString =
        'http://api.openweathermap.org/data/2.5/weather?zip='
        + zipcode + ',us&appid=' + OpenWeatherAppKey + '&units=imperial';
    $.getJSON(queryString, function (results) {
        showWeatherData(results);
    }).fail(function (jqXHR) {
        $('#error-msg').show();
        $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
    });
    return false;
}
function callMessicksAPi() {
    var data = { vendor: "br", info: "108344" }
    var url = 'http://localhost:9597/mobileApi/used/recenttrade'
    $.getJSON(url, function (result) {
        $.each(result, function (index, element) {
            $('#messicksData').append('Unit Detail for #' + index + ' <br/>Tag Number: ' + element.unit.tagnnumber + '<br/>Price: $' + element.unit.sale + '<br/>');
            //alert(JSON.stringify($(this)));
        });
        return false;
    });
}

var _tabList;
function getTabDetails() {
    $.getJSON('http://messicks.com/mobileApi/usedEquip/GetTabDetails', function (result) {
        _tabList = result;
        var tabIds = new Array();
        var tabTitles = $.map(result, function (element,index) {
           
            if (element.parentID === null && element.notForUnits !== null) {
                tabIds.push(element.tabid);
                return "<li><a href='#" + element.tabid + "' data-ajax='false'>" + element.name + "</a>";
            }
        });
      
        tabTitles.push("<li><a href='#0'>Other Categories</a>");
        tabIds.push(0);   
        
        $.each(tabTitles, function (index, element) {
            var htmlToAppend = '';
            $.each(result, function (i,e) {
               if (e.parentID === tabIds[index]) {
                    htmlToAppend += "<li><a data-id = '" + e.tabid + "'>" + e.name + "</li>";
                }
               else if (tabIds[index] === 0) {
                   if (e.parentID === null && e.notForUnits === null) {
                       htmlToAppend += "<li><a href='#' data-id = '" + e.tabid + "'>" + e.name + "</a></li>";
                   }
               }
            });
            tabTitles[index] = tabTitles[index] + "<ul  id='" + tabIds[index] + "'style='margin-left: 10px' class='tablist-content' data-role='listview' data-inset='true'>" + htmlToAppend + "</ul></li>";
        });

        tabTitles.splice(0, 0, "<li data-role='list-divider'><a href='ajax-content-ignore.html' data-ajax='false'>Used Equipment Categories</a></li>");
        $('#mainTabList').html(tabTitles.join(''));
        
    });
    return false;
}


function getChildTab() {
    alert('in here');
    var $thisId = $(this).children('a').data('id');

    var htmlToAppend = "";
    $.each(_tabList, function (index, element) {
        if ($thisId === 0) {
            if (element.parentID === null && element.notForUnits === null) {
                htmlToAppend += "<li><a href='#' data-id = '" + element.tabId + "'>" + element.name + "</a></li>";
            }
        }
        else if (element.parentID !== null && element.parentID === $thisId) {
            htmlToAppend += "<li><a data-id = '" + element.tabId + "'>" + element.name + "</li>";
        }
    });
    $(this).append("<ul>"+ htmlToAppend +"</ul>");
    return false;
}
function getWeatherWithGeoLocation() {
    //Call the Cordova Geolocation API
    navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationError,
        { enableHighAccuracy: true });
    $('#error-msg').show();
    $('#error-msg').text('Determining your current location ...');
    $('#get-weather-btn').prop('disabled', true);
}

function onGetLocationSuccess(position) {
    //Retrieve the location information from the position object
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var queryString = 'http://api.openweathermap.org/data/2.5/weather?lat='
        + latitude + '&lon=' + longitude + '&appid=' + OpenWeatherAppKey + '&units=imperial';

    $('#get-weather-btn').prop('disabled', false);

    $.getJSON(queryString, function (results) {
        showWeatherData(results);
    }).fail(function (jqXHR) {
        $('#error-msg').show();
        $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
    });
}

function onGetLocationError(error) {
    $('#error-msg').text('Error getting location');
    $('#get-weather-btn').prop('disabled', false);
}

function showWeatherData(results) {

    if (results.weather.length) {
        $('#error-msg').hide();
        $('#weather-data').show();

        $('#title').text(results.name);
        $('#temperature').text(results.main.temp);
        $('#wind').text(results.wind.speed);
        $('#humidity').text(results.main.humidity);
        $('#visibility').text(results.weather[0].main);

        var sunriseDate = new Date(results.sys.sunrise * 1000);
        $('#sunrise').text(sunriseDate.toLocaleTimeString());

        var sunsetDate = new Date(results.sys.sunset * 1000);
        $('#sunset').text(sunsetDate.toLocaleTimeString());

    } else {
        $('#weather-data').hide();
        $('#error-msg').show();
        $('#error-msg').text("Error retrieving data. ");
    }
}