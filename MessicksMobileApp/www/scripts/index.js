// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );

        //$('#get-weather-btn').click(getWeatherWithZipCode);
        //$('#getMessicksData').click(callMessicksAPi);

        //$('#usedEquipments-page').ready(getTabDetails);

        $('#usedEquip').click(callAnothePage);
        //$('#mainTabList').on('click', 'li', getChildTab);
        //Populate the page with the current location's weather conditions
        //getWeatherWithGeoLocation();
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        //var parentElement = document.getElementById('deviceready');
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
    };

    function callAnothePage() {
        if ($(this).attr('id') == 'usedEquip') {
            window.location = "UsedEquipment.html";
        }
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();