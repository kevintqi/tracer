$(document).ready(function() {
    initMap();
    updateObjects();
    setInterval(updateObjects, 300*1000);
    addRefreshButton();
});

var localMap;
var markers = [];

function initMap() {
    var options = {
        center: new google.maps.LatLng(34.1022, -118.2737),
        zoom: 13,
        disableDefaultUI: false
    };
    localMap = new google.maps.Map(
        document.getElementById("map"), options
    );
    var places = new google.maps.places.PlacesService(localMap);  
}

function updateObjects() {
    $.getJSON("model/objects.json", function(data, status){
        if (status === "success") {
            localMap.setCenter(data.center);
            updateMarkers(data.objects);
        }
    }); 
}

function updateMarkers(objects) {
    while (markers.length !== 0) {
        var marker = markers.pop();
        marker.setMap(null);
    }
    for (var i = 0; i < objects.length; ++i) {
        var marker = createMarker(objects[i]);
        markers.push(marker);
    }
}

function createMarker(obj) {
    var contentString = '<div style="background-color:' + obj.status +'">'
                                + obj.name + '<br>' 
                                + obj.destination + '<br>' +
                                + obj.startTime + ' - ' + obj.endTime +
                        '</div>';
    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
    });
    var marker = new google.maps.Marker({
        position: obj.position,
        icon: obj.icon,
        title: obj.name,
        map: localMap
    });
    marker.addListener('click', function() {
        infowindow.open(localMap, marker);
    });
    return marker;
}

function addRefreshButton() {
    $('#refresh').click(updateObjects);
}