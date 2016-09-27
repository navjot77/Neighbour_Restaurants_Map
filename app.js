/**
 * Created by navjo on 9/26/2016.
 */

var locations = [
    {
    'title': 'Mezcal',
    linkedId:'4a26c080f964a520d67e1fe3',
    'location': {
        lat: 37.334273,
        lng: -121.889771
    }
}, {
    'title': 'SmokeEaters Hot Wings',
       linkedId:  '49e93beef964a520e1651fe3',

    'location': {
        lat: 37.336198,
        lng:  -121.887940
    }
}, {
    'title': 'Billy Berk\'s',
 linkedId:  '4a184eddf964a52096791fe3',
    'location': {
          lat: 37.334364,
        lng: -121.889485,
    }
},
    {
    'title': 'SJ Omogari Korean Restaurant',

 linkedId:  '4a184eddf964a52096791fe3',
    'location': {
          lat: 37.348417,
        lng:  -121.895077
    }
},{
    'title': 'Maggiano\'s Little Italy',

 linkedId:  '4a4ebf95f964a52002af1fe3',
    'location': {
          lat: 37.320815,
        lng:  -121.949663
    }
}
];

var map, infowindow;

var gCenter= {
        lat: 37.334273,
        lng: -121.889771
}
var model= function (data) {
    var self=this;
    self.name=data.title;
    self.linkedId=data.linkedId;
    self.show=ko.observable(true);
    self.marker = new google.maps.Marker({
    position: data.location,
    map: map,
    title: data.title,
    animation: google.maps.Animation.DROP
  });
    self.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
    self.gotClicked=function(){
        map.setCenter(gCenter);
        map.setZoom(10);
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
        console.log("Inside addListerner")
          map.setCenter(gCenter);
        map.setZoom(10);
        //Call API here.. use ajax and get the data.. and display
        calling_api(self);

        console.log("Inside addListerner")
    })
    
}

var calling_api=function (self) {
    var CLIENT_ID="HMRBAIPPEKBU5FGBYHOVRJESIYPU0MT3GQ2UUFA1KQV5DM25";
    var CLIENT_SECRET="PC3DU4UEQ4P2E5HXYZUUWAFO3BIIXLK0XD4DDIAK4ZIF1ERM";
    var send_url="https://api.foursquare.com/v2/venues/"+self.linkedId+"?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&v=20130815&ll=40.7,-74&query=sushi";

     $.ajax({
        type: "GET",
        dataType: "json",
        url: send_url,
        success: function(data) {
            console.log(data.response.venue.name);
            self.ratings=data.response.venue.rating;

            self.address=data.response.venue.location.address+" "+data.response.venue.location.city+" "+data.response.venue.location.country;
            self.website=data.response.venue.url;
            self.status=data.response.venue.hours.status;
          //  console.log(data.response.venue);
            self.imageUrl=data.response.venue.photos.groups[0].items[0].prefix+"100x150"+data.response.venue.photos.groups[0].items[0].suffix;

            var infoContent='<p ><em style="font-size: 1em">'+self.name+'</em></p>'+
                            '<img src="'+self.imageUrl+'" alt="Restaurant Image" style="float: left; margin-right:1em">' +
                    '<p style="font-size: 0.9em">'+self.address+'</p>'+
                    '<a>'+self.website+'</a>'+
                    '<p style="font-size: 0.8em"><em>'+self.status+'</em></p>'+
                    '<p style="font-size: 0.8em"><em>Ratings: '+self.ratings+'</em></p>';
            infowindow.setContent(infoContent);
        infowindow.open(map,self.marker);
        },error:function(){
             infowindow.setContent('<p>Unable to get data from FourSquare</p>');
        infowindow.open(map,self.marker);
         console.log("error in fetching API foursquare");
         }
     });
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
lat: 37.334273,
        lng: -121.889771
},
zoom: 11,
mapTypeControl: false
});

infowindow = new google.maps.InfoWindow();
// Tried putting this in app.js but but received and error in console.

ko.applyBindings(new ViewModel());
}
function maperror() {
window.alert('Google Maps could not be loaded.');
}