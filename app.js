/**
 * Created by navjo on 9/26/2016.
 */

/*List of locations. Contains name of Restaurant, linkedId: Here is id which
is used later in ajax call to get restaurant related data from
FourSquare*/
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

// global variables.
var map, infowindow;
// location of Map that will be point of center. This location is used in case
// User goes out of scope after zooms in/out.
var gCenter= {
        lat: 37.334273,
        lng: -121.889771
};
// Object for each location is stored.
//Here, show variable is made observable.
var model= function (data) {
    var self=this;
    self.name=data.title;
    self.linkedId=data.linkedId;
    // 'show' will be false in case when user searches for restaurant and that
    // restaurant name does not matches this object's restaurant name.
    self.show=ko.observable(true);
    // Setting the map marker at specific location.
    self.marker = new google.maps.Marker({
    position: data.location,
    map: map,
    title: data.title,
    animation: google.maps.Animation.DROP
    });
  // Setting the default color of marker as Blue.
  self.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');

  // gotClicked function gets called when user clicks Item from List. 
    // This function will animate the specific marker on maps. 
  self.gotClicked=function(){
    // Resetting the zoom and center in case User navigates to other in maps.
 map.setCenter(gCenter);
  map.setZoom(10);
   if (self.marker.getAnimation() !== null) {
      self.marker.setAnimation(null);
  }
  else {
 self.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
  self.marker.setAnimation(google.maps.Animation.BOUNCE);
  calling_api(self);

  window.setTimeout(function(){
  self.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
  self.marker.setAnimation(null);
       },2000);
  }
  };
    
  //Below function is called, when User clicks on the marker. This will 
    // call the gotClicked function that call
    // foursqare api to set the content of infowindow.
  self.marker.addListener('click',self.gotClicked);

};

// Below function makes ajax call to foursqaure api and sets the infowindow.
var calling_api=function (self) {
    var CLIENT_ID="HMRBAIPPEKBU5FGBYHOVRJESIYPU0MT3GQ2UUFA1KQV5DM25";
    var CLIENT_SECRET="PC3DU4UEQ4P2E5HXYZUUWAFO3BIIXLK0XD4DDIAK4ZIF1ERM";
    var send_url="https://api.foursquare.com/v2/venues/"+
        self.linkedId+"?client_id="+CLIENT_ID+"&client_secret="+
        CLIENT_SECRET+"&v=20130815&ll=40.7,-74&query=sushi";

    $.ajax({
        type: "GET",
        dataType: "json",
        url: send_url,
        success: function(data) {
        //console.log(data.response.venue.name);
        self.ratings=data.response.venue.rating;
        self.address=data.response.venue.location.address+" "+
            data.response.venue.location.city+" "+
            data.response.venue.location.country;
        self.website=data.response.venue.url;
        self.status=data.response.venue.hours.status;
        self.imageUrl=data.response.venue.photos.groups[0].items[0].prefix+
            "100x150"+data.response.venue.photos.groups[0].items[0].suffix;
        var infoContent=
            '<p ><em style="font-size: 1em">'+self.name+'</em></p>'+
           '<img src="'+self.imageUrl+'" alt="Restaurant Image" ' +
            'style="float: left; margin-right:1em">' +
            '<p style="font-size: 0.9em">'+self.address+'</p>'+
            '<a>'+self.website+'</a>'+
            '<p style="font-size: 0.8em"><em>'+self.status+'</em></p>'+
            '<p style="font-size: 0.8em"><em>Ratings: '+self.ratings+
            '</em></p>'+
            '<p style="font-size: 0.5em">Powered By FourSquare API</p>';
    infowindow.setContent(infoContent);
    infowindow.open(map,self.marker);
    },error:function(){
         infowindow.setContent('<p>Unable to get data from FourSquare</p>');
         infowindow.open(map,self.marker);
        console.log("error in fetching API foursquare");
     }
     });
};

// ViewModel, creates object for each restaurant and stores 
// in observable array.
var ViewModel = function() {
    var self=this;
    self.list=ko.observableArray([]);
    self.query=ko.observable();
    
    for(i=0; i<locations.length;i++) {
        self.list.push(new model(locations[i]));
    }


    // This is called, when user does a keyUp event in search Bar.
    self.query.subscribe(function(value){
    if (value !== "") {
        var val = value.toLowerCase();
        var valRe = new RegExp(val + "\+");
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


function googleMap() {
map = new google.maps.Map(document.getElementById('map'), {
    center: {
        lat: 37.334273,
        lng: -121.889771
        },
    zoom: 12,
    mapTypeControl: false
    });


infowindow = new google.maps.InfoWindow();
infowindow.addListener('closeclick',function(){
         map.setCenter(gCenter);
        map.setZoom(11);
   });

ko.applyBindings(new ViewModel());
}
function error(){
    alert('Unable to Load Google Maps, check your internet Connection');
}
