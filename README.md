# Neighbour_Restaurants_Map
Displays near by Restaurants in maps and fourSquare reviews.

![screenshot_neighbourmap](https://cloud.githubusercontent.com/assets/15641327/20201034/eb0d043c-a769-11e6-9e23-54e00aacd968.png)


## Description
1. This project uses Google Maps API and Foursquare API, and displays the results
  on google maps as markers as well as list. The restaurants are hard coded and
  currently have 5 restaurants in the list.
2. User can filter the restaurant in search bar, and also resataurants will be filtered
  in google maps.
3. When User clicks a particulat restaurant in the google maps, reviews of that restaurants
  is fetched using ajax from Foursquare API and shown in dialogue box.
  
## Files
 1. index.html -> This files contains html code for main page.
 2. app.js -> contains javascript code. Used MVVVM approach.

## 
 * 5 location have been hardcoded in the code along with latitude, longitude
    and linked-Id for Foursquare API
 * Knockout JS has been used for binding.
To execute the code, download this zip file and open index.html using double
click.
