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
        lat: 40.5882699,
        lng: -80.2267282
    }
}
];

var model= function (data) {

    var self=this;
    self.name=data.title;
    self.show=ko.observable(true);
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

            console.log(valRe);
            self.list().forEach(function (each, index) {
                if ((each.name.toLowerCase()).search(valRe) == -1) {

                    console.log(each.show());
                    each.show(false);
                    console.log(each.name);
                    console.log("Not found");
                }
                else{
                    each.show(true);

                }
            });
        }
        else{
             self.list().forEach(function (each, index) {
                        each.show(true);

            });

        }


    });
     //self.checkSearchBox=ko.computed(function () {
       // console.log(inputQuery);});
};
ko.applyBindings(new ViewModel());