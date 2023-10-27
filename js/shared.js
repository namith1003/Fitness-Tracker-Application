// Shared code needed by all three pages.

var startPos;                 // variable that stores the starting location of the user
var viewMap;                  // the variable to store the map that is created
var totalDistance=0;          // total distance travelled by user in the run
var nameOfRun;                // stores the name of the run and is used to display run in the past runs page
var saveButton=document.getElementById("runSaver");              // stores the save button for easy enabling and disabling of the button
mapboxgl.accessToken = 'pk.eyJ1IjoibmFtaXRoMSIsImEiOiJjazlvbXRocnMwMjQ4M29wOWh5Ynp6YjhiIn0.PF1VW9CtfSoqSkRvmHa94A';      // access token for our map
	


// The class which is used to create runs.
class Run
{
    constructor()
    {
		this._runId=0;             // stores the ID of each run
        this._startLocation = new mapboxgl.LngLat(0,0);           // stores the start location of the run with location user clicked the begin run button
        this._endLocation = new mapboxgl.LngLat(0,0);             // stores the end location for user which is random once every time user clicks on the random destination button
		this._currentLocation = new mapboxgl.LngLat(0,0);         // stores current location of the user at intervals to display his exact location on the map and updates as it changes
        this._pathTaken = [];                                     // variable to save the path taken by user once run has been completed.
		this._totalDistance=0;                                    // saves the total distance the user has travelled for the run
        this._timeTaken = 0                                       // displays the time taken for the specified run of the user
        this._speedOfRun = 0;                                     // average speed of the user throughout the run and is shown in Km/h
		this._summaryOfRun='';                                    // stores the summary for the run to be displayed in the past runs page 
		this._nameOfRun=''                                        // stores the name of the run to be shown on the past runs page 
    }
	
	set runId(runId)
	{
		this._runId=runId;	
	}
	
	set totalDistance(totalDistance)
	{
		this._totalDistance=totalDistance;	
	}
	set startLocation(startLocation)
	{
		this._startLocation.lng=startLocation.lng;
		this._startLocation.lat=startLocation.lat;
	}
	set endLocation(endLocation)
	{
		this._endLocation.lng=endLocation[0];
		this._endLocation.lat=endLocation[1];
	}
	set currentLocation(currentLocation)
	{
		this._currentLocation.lng=currentLocation[0];
		this._currentLocation.lat=currentLocation[1];

	}
	set pathTaken(pathTaken)
	{
		this._pathTaken.push(pathTaken);
	}
	set timeStarted(timeStarted)
	{
		this._timeStarted=timeStarted;
	}
	set timeEnded(timeEnded)
	{
		this._timeEnded=timeEnded;
	}
	set timeTaken(timeTaken)
	{
		this._timeTaken=((timeTaken[0]-timeTaken[1])/1000).toFixed(2);
	}
	set speedOfRun(speedOfRun)
	{
		this._speedOfRun=speedOfRun;
	}
	set summaryOfRun(summary)
	{
		this._summaryOfRun=summary;
	}
	set nameOfRun(nameOfRun)
	{
		this._nameOfRun=nameOfRun;
	}
	
	
	
	get runId()
	{
		return this._runId;
	}
	get startLocation()
	{
		return this._startLocation;
	}
	get endLocation()
	{
		return this._endLocation;
	}
	get currentLocation()
	{
		return this._currentLocation;
	}
	get pathTaken()
	{
		return this._pathTaken;
	}
	get timeStarted()
	{
		return this._timeStarted;
	}
	get timeEnded()
	{
		return this._timeEnded;
	}
	get timeTaken()
	{
		return this._timeTaken;
	}
	get totalDistance()
	{
		return this._totalDistance;
	}
	get speedOfRun()
	{
		return this._speedOfRun;
	}
	get summaryOfRun()
	{
		return this._summaryOfRun;
	}
	get nameOfRun()
	{
		return this._nameOfRun;
	}
	
}



//  class to create a new map for each run or reattempt the user has
class OurMap
{
	constructor(centreOfMap)
	{
		this._centreOfMap=[centreOfMap[0],centreOfMap[1]];    // stores the centre of the created map(here its the users start location)
		
		// stores the whole map with all necessary information of it
		this._map=new mapboxgl.Map({
                  container: 'map',
                  center: [centreOfMap[0],centreOfMap[1]],
                  zoom: 17.3,
                  style: 'mapbox://styles/mapbox/streets-v11',
                  hash: true,
                  transformRequest: (url, resourceType)=> {
                    if(resourceType === 'Source' && url.startsWith('http://myHost')) {
                        return {
                        url: url.replace('http', 'https'),
                        headers: { 'my-custom-header': true},
                        credentials: 'include'  // Include cookies for cross-origin requests
                        }
                    }
                  }
                });
                this._map.addControl(
	                new mapboxgl.NavigationControl()
                )
		
		
	}
	

	set centreOfMap(centreOfMap)
	{
		this._centreOfMap=[centreOfMap[0],centreOfMap[1]];
	}
	
	
	set map(centreOfMap)
	{
		this._map.centre[centreOfMap[0],centreOfMap[1]]
	}
	
	get centreOfMap()
	{
		return this._centreOfMap;
	}
	
	get map()
	{
		return this._map;
	}
	
}



// class to create the markers for users start, current and end location.
class marker
{
	constructor()
	{
		this._markerLocation;                        // stores the markers location 
		this._marker= new mapboxgl.Marker();         // stores the created specific marker to be shown with its own stylings
		
		
	}
	
	// sets the coordinates for the marker
	set markerLocation(coordinates)
	{
		this._marker= new mapboxgl.Marker(coordinates[2]);
		this._markerLocation=[coordinates[0],coordinates[1]];
		this._marker.setLngLat([coordinates[0],coordinates[1]]);
	}
   
	
	get marker()
	{
		return this._marker;
	}
	
	get markerLocation()
	{
		return this._markerLocation;
	}
}



// class used to style each marker with a different picture size and location.
class Styling
{
	constructor(coordinates,picture,iconSize)
	{
		// this is a user defined object to store the special features and design of each marker as the user feels fit.
		this._geoJson = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {
                    'message': 'Your End Location',
                    'iconSize': [iconSize,iconSize]
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [coordinates[0],coordinates[1]]
                }
			}
           
          ]
        };
		
		this._el = document.createElement('div');    // the variable to store the element space in the HTML to store this created marker and what to be used to create this specific marker 
        this._el.className = 'marker';
        this._el.style.backgroundImage ='url('+picture+')'
           
        this._el.style.width = this._geoJson.features[0].properties.iconSize[0] + 'px';
        this._el.style.height = this._geoJson.features[0].properties.iconSize[1] + 'px';

        this._el.addEventListener('click', function() {
            window.alert(this._geoJson.features[0].properties.message);
        });

	}
	
	set geoJson(coordinates)
	{
		this._geoJson = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {
                    'message': 'Your End Location',
                    'iconSize': [iconSize,iconSize]
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [coordinates[0],coordinates[1]]
                }
			}
           
          ]
        };
	}
	
	set el(picture)
	{		
        this._el.style.backgroundImage ='url('+picture+')'
	}
	
	get geoJson()
	{
		return this._geoJson;
	}
	
	get el()
	{
		return this._el;
	}
	
}
  




var markerCurrent=new marker();              // variable to store the marker for current location of user
var markerStart=new marker();                // variable to store the marker for start location of user
var markerDestination=new marker();          // variable to store the marker for end location for user
var markerPath=new marker();                 // variable to store the marker of each current location of user to be stored in an array to make the path user has taken

// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "runs";

// Array of saved Run objects.



/*
 *function used to save each run the user takes into an array when the save run button is clicked by the user. 
*/
function saveRun()
{
	
	var savedRuns=JSON.parse(localStorage.getItem(APP_PREFIX))|| [];        // saves the list of runs the user has taken
	
	run1.nameOfRun=prompt("Please Enter A Name For This Run: ")            // promt to enter the name of the run
	while (run1.nameOfRun==null || run1.nameOfRun=="")
	{
	    alert("Name For This Run Cannot Be Left Blank")
	    run1.nameOfRun=prompt("Please Enter A Name For This Run: ")
	}
	
	run1.summaryOfRun=["Date started is "+startTime+ ", Lasted for "+(run1.timeTaken)+"s" + " and Distance travelled was "+(totalDistance.toFixed(2))+"m"];
    
	var newItem=run1;
	
	savedRuns.push(newItem);                      //pushes the new run to the last location of the saved run array and saves the runs in chronological order.
	
	localStorage.setItem(APP_PREFIX,JSON.stringify(savedRuns));
    saveButton.disabled=true;                    // after saving the run the save run button is disabled for the next run until the conditions are met
	
    location.href='index.html'                   // opens the past runs page to check on the saved run in the list.
}


