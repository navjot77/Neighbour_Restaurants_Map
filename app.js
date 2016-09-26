/**
 * Created by navjo on 9/26/2016.
 */

var locations = [
    {
    'title': 'Fiori\'s',

    'location': {
        lat: 40.4127159,
        lng: -80.0325241
    }
}, {
    'title': 'Franks',

    'location': {
        lat: 40.5882699,
        lng: -80.2267282
    }
}, {
    'title': 'Navjot',

    'location': {
          lat: 40.4502136,
        lng: -80.1283347
    }
}
];

var map, infowindow;


var model= function (data) {

    var self=this;
    self.name=data.title;
    self.show=ko.observable(true);
    self.marker = new google.maps.Marker({
    position: data.location,
    map: map,
    title: data.title,
    animation: google.maps.Animation.DROP
  });
    self.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
    self.gotClicked=function(){
        if (self.marker.getAnimation() !== null) {
    self.marker.setAnimation(null);
  } else {
            self.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')

    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function(){

    self.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
    self.marker.setAnimation(null);},2000);

  }
}
    self.marker.addListener('click',function(){
        //Call API here.. use ajax and get the data.. and display
        infowindow.setContent('<p>Hello This is me%s</p>'+self.name);
        infowindow.open(map,self.marker);
        console.log("Inside addListerner")
    })
    
}

var ViewModel = function() {
var self=this;
self.list=ko.observableArray([]);
self.query=ko.observable();

for(i=0; i<locations.length;i++) {
self.list.push(new model(locations[i]));
}
    
self.query.subscribe(function(value){
if (value != "") {
var value = value.toLowerCase();
var valRe = new RegExp(value + "\+");
self.list().forEach(function (each, index) {
if ((each.name.toLowerCase()).search(valRe) == -1) {
each.show(false);
    each.marker.setMap(null);
}
else{
    each.marker.setMap(map);
each.show(true);
}
});
}
else{
self.list().forEach(function (each, index) {
each.show(true);
    each.marker.setMap(map);
});
}
});


};


function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
center: {
 lat: 40.4127159,
        lng: -80.0325241
},
zoom: 6,
mapTypeControl: false
});

infowindow = new google.maps.InfoWindow();
// Tried putting this in app.js but but received and error in console.

ko.applyBindings(new ViewModel());
}
function maperror() {
window.alert('Google Maps could not be loaded.');
}