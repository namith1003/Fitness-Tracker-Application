// Code for the Measure Run page.

//
    positionOptions = {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0
        };
		
        navigator.geolocation.watchPosition(success, errorHandler,positionOptions);
		

var mainMap;                                               // stores the main map for the current run
var destination;	                                       // stores the coordinates for the users end location for the run
var radius=0;                                              //distance to random location
var randomDesFound=false;                                  // stores wheather the random destination button was clicked or not
var startLocBtn=document.getElementById("startLocBtn");    // saves the HTML element of the begin run button
var buttonState=document.getElementById("newDesBtn");      // saves the HTML element of the random destination button
var accuracyValid=false;                                   //to check if accuracy falls under necessary criteria of 20m
var mapShown=false;                                        //for map to not repeatedly refreshed when success function is called.
var accuracy;	                                           // saves the accuracy of users current location
var runStarted=false;                                      // variable to store wheather the begin run button has been clicked for current run
var endTime,startTime;                                     // saves the start and end tim for the run
var runIndex = JSON.parse(localStorage.getItem(APP_PREFIX));    // gets all the runs user has done and is saved in the local storage
var runPointer = localStorage.getItem(APP_PREFIX+"-selectedRun");    // stores the clicked run by user's index in local storage
var reattempted=localStorage.getItem('reattempted');                 // hets wheather the run currently being taken is a reattempt or not



/*
 *  this function runs every time the users location changes
*/
function success(position){
	
    var crdLat = Number(position.coords.latitude);       // takes the user current latitude
    var crdLng = Number(position.coords.longitude);      // takes users current longitude
	accuracy=Number(position.coords.accuracy);           // takes users current accuracy
    startPos=new mapboxgl.LngLat(crdLng,crdLat);         // creates a LngLat object of users current location
	
	
// checks if map was shown once to avoid refreshing	
if (mapShown===false)
{
	
  mainMap=new OurMap([crdLng,crdLat]);
  mainMap.map; // line to display the map and is only displayed once .
    
	
	
  /*
   * this if condition code block changes how the entire newRunPage.js file works depending on if the run is a reattempt or not
  */
  if (reattempted==="true")
	{
		// if run is reattempted new destination and begin t=run buttons are disabled
		buttonState.disabled=true;
	    startLocBtn.disabled=true;
	    startLng=runIndex[runPointer]._startLocation.lng;
		startLat=runIndex[runPointer]._startLocation.lat;
		destination=[runIndex[runPointer]._endLocation.lng,runIndex[runPointer]._endLocation.lat];
        
		
		var distanceToPos = Number(Math.sqrt(Math.pow(startPos.lng-startLng,2)+Math.pow(startPos.lat-startLat,2))*150000);      // distance to the start position to begin the reattempted run is stored in this variable
		radius= Number(Math.sqrt(Math.pow(startPos.lng-destination[0],2)+Math.pow(startPos.lat-destination[1],2))*150000);      // distance to end location of the reattempted run is stored in this variable.
		
		
		// checks if the user is within 10 m of the required start location to begin run
		if (distanceToPos<10)
		{
			startLocBtn.disabled=false;   // if user meets the condiditon the begin run button is enabled.
		}
	    
		var stylerStart=new Styling([startLng,startLat],'images/yellowIcon.jpg',30);    // styles the start location marker as a yellowIcon

	
	    markerStart.markerLocation=[startLng,startLat,stylerStart.el];     //sets the location of the start location marker
	   
	    markerStart.marker.addTo(mainMap.map);            // displays the marker for start location on the map
	    markerStart.marker.setPopup(new mapboxgl.Popup().setHTML("The Start Location"))
	    runStarted=true;
	    totalDistance=0;
		
		
		var stylerFinal=new Styling([destination[0],destination[1]],'images/redIcon.jpg',30);       // styles the end location marker as a redIcon
	
	    markerDestination.marker.remove();    // removes previously added new destination markers to overwrite with a new one

	    markerDestination.markerLocation=[destination[0],destination[1],stylerFinal.el];         //sets the location of the end location marker
	    document.getElementById("distanceToDesAndStart").innerHTML ="Distance to Destination= "+radius.toFixed(2)+"m "+", Distance to Start="+distanceToPos.toFixed(2)+"m";
	    markerDestination.marker.addTo(mainMap.map); 
	    markerDestination.marker.setPopup(new mapboxgl.Popup().setHTML("The Destination Location"))
        
		localStorage.setItem('reattempted','false')        // now the code may work like normal and is nolonger considered a reattemp
		randomDesFound=true;         // states that a new destination has been found
	}	
	
mapShown=true;

}
   
   var stylerCurrent=new Styling([crdLng,crdLat],'images/runChallengeIcon.png',30);
   
    // add marker to map
	markerCurrent.marker.remove();
    markerCurrent.markerLocation=[crdLng,crdLat,stylerCurrent.el];
	// mark current location as a start pointer
	markerCurrent.marker.addTo(mainMap.map);
	
	
	// if a run has been repeated
	
	
	
	if (randomDesFound===true)
	{
		
		var distanceToDes=(Math.sqrt(Math.pow(destination[0]-crdLng,2)+Math.pow(destination[1]-crdLat,2))*150000).toFixed(2);       // the distance to the end location is calculated
		document.getElementById("distanceToDesAndStart").innerHTML= "Distance to Destination= "+distanceToDes+"m ";
		
		if (runStarted===true)
		{
		    var distanceToStart=(Math.sqrt(Math.pow(startLng-crdLng,2)+Math.pow(startLat-crdLat,2))*150000).toFixed(2);             // the distance to the start location is calculated
		    document.getElementById("distanceToDesAndStart").innerHTML +=", Distance to Start= "+distanceToStart+"m";
			run1.pathTaken=startPos; // run path is being tracked after the begin run button is clicked
		}
		
		
		
		if (distanceToDes<10 && distanceToDes>=0)         // if the  distance to the end location is less than 10 m the run is considered to end and can be stored by user
		{
			
			randomDesFound=false;   // resets the random location back to not being found
			runStarted=false;       // resets the run has started back to not started and reset
			startLocBtn.disabled=true;  // disables the Begin Run Button
			
			endTime=new Date();  // stores date that the run ended
			run1.timeEnded=endTime.getTime();   
			document.getElementById("distanceToDesAndStart").innerHTML= "'Run Has Been Completed'";
			
		    run1.timeTaken=([endTime.getTime(),startTime.getTime()])
			document.getElementById("times").innerHTML="time taken for the run= "+run1.timeTaken+"s "
			
			
			// this for loop takes distances between each 2 location instances of the users path to get the total distance user ahs run
			for (var points=0;points<run1.pathTaken.length-1;points++)
			{
				totalDistance +=Number((Math.sqrt(Number(Math.pow(run1.pathTaken[points+1].lng-run1.pathTaken[points].lng,2))+Number(Math.pow(run1.pathTaken[points+1].lat-run1.pathTaken[points].lat,2)))*150000));  // finds the total distance of path travelled by user.
			}
			
			run1.totalDistance=totalDistance.toFixed(2);
			run1.speedOfRun=((run1.totalDistance/run1.timeTaken)*3.6).toFixed(2);
			
			document.getElementById("times").innerHTML +=", Total distance travelled= "+totalDistance.toFixed(2)+"m"
			
			distanceToDes=20;
			runSaver.disabled=false;
		}
		
		
		
	}
	
	
	}

// function to handlle errors from geolocation.navigate.watchposition()
function errorHandler(error)
    {
        if (error.code == 1)
        {
           alert("Location access denied by user.");
        }
        else if (error.code == 2)
        {
           alert("Location unavailable.");
        }
        else if (error.code == 3)
        {
           alert("Location access timed out");
        }
        else
        {
           alert("Unknown error getting location.");
        }
    }


/*
 * function called when the random destination button is clicked and creates a random location for the user to run to
*/
function randomDestination(startPos)
{
	

	
    //to make the random destination a distance of 60 to 150 m away from where you are.
	radius=0;
	startLocBtn.disabled=false;
	
	
	// creates a set of random latitude and longitude values to have a random distance of 60-150 m from users current location
	while (radius>=0 && radius<60 || radius>150)   
	{
    var x= Math.floor((Math.random()*301-150));	
    var y= Math.floor((Math.random()*301-150));
	radius=Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	}
    x=x/150000; // converts x to latitude from meters
	y=y/150000; // converts y to longitude from meters
	destination=[startPos.lng+y,startPos.lat+x];
	
	
	
	var stylerFinal=new Styling([destination[0],destination[1]],'images/redIcon.jpg',30);    // styles the final location marker of the user to a redIcon
	
	markerDestination.marker.remove();   // removs a previous random destination marker

	markerDestination.markerLocation=[destination[0],destination[1],stylerFinal.el];     // sets the destiantion markers exact location to come up
	document.getElementById("distanceToDesAndStart").innerHTML= "Distance to Destination= "+radius.toFixed(2)+"m ";    
	markerDestination.marker.addTo(mainMap.map);     // adds the destiantion marker to the map
	markerDestination.marker.setPopup(new mapboxgl.Popup().setHTML("The Destination Location"))
	markerStart.marker.remove()    // removes the previous start location marker on the map 
   
	
	
	//turn on the begin run button
	
	
	startLocBtn.disabled=false;  // the begin run button is now enabled
	
	
	randomDesFound=true;
	document.getElementById("times").innerHTML +="";

	
	return destination;
}


var startLat,startLng;
var run1=new Run();



// function to start the run using the found random destination
function beginRun()
{	
	
	startLng=startPos.lng;    // takes the start locations longitude value
	startLat=startPos.lat;    // takes the start locations latitude value
	run1.startLocation=startPos;
	run1.endLocation=destination;
	startTime=new Date();
	run1.timeStarted=startTime.getTime();
	startLocBtn.disabled=true;
		
    var distanceToPos = Number(Math.sqrt(Math.pow(startPos.lng-startLng,2)+Math.pow(startPos.lat-startLat,2))*150000);    // finds the distance to teh start location with respect to the users current location
	
	var stylerStart=new Styling([startLng,startLat],'images/yellowIcon.jpg',30);      // styles the start location marker of the user to a yellowIcon

	markerStart.markerLocation=[startLng,startLat,stylerStart.el];                    // sets the start markers exact location to come up
	document.getElementById("distanceToDesAndStart").innerHTML ="Distance to Destination= "+radius.toFixed(2)+"m "+", Distance to Start="+distanceToPos+"m";
	markerStart.marker.addTo(mainMap.map);                                            // adds the start marker to the map
	markerStart.marker.setPopup(new mapboxgl.Popup().setHTML("The Start Location"))
	runStarted=true;       // sets that the run has started
	totalDistance=0;
	
}







