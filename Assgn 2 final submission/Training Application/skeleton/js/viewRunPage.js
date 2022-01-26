// Code for the View Run page.

// The following is sample code to demonstrate navigation.
// You need not use it for final app.

var runPointer = localStorage.getItem(APP_PREFIX+"-selectedRun");    // the run clicked by user is taken from local storage to identify which run the user wants information on
var startLocBtn=document.getElementById("startLocBtn");
var buttonState=document.getElementById("newDesBtn");
var runIndex = JSON.parse(localStorage.getItem(APP_PREFIX));
var elementsRunIndex=runIndex.length;
var runNames=[];

if (runPointer !== null)
{
	// takes every runs name to be shown individually on the header of each runs own view run page
	for (var runNumber=0;runNumber<elementsRunIndex;runNumber++)
	{
    
    runNames.push(runIndex[runNumber]._nameOfRun);          // pushes the required runs name from the run to display it as a header on the runs view run page
	}
	
    document.getElementById("headerBarTitle").textContent = runNames[runPointer];

}

viewMap=new OurMap([runIndex[runPointer]._endLocation.lng,runIndex[runPointer]._endLocation.lat])

viewMap.map;

// to create the start marker when the run is reattempted  to show the location the user should go to, to start the reattempted run
var styleFinStart=new Styling([runIndex[runPointer]._startLocation.lng,runIndex[runPointer]._startLocation.lat],'images/yellowIcon.jpg',30)   // changes the style of the start maker to the yellowIcon image in the images file
markerStart.markerLocation=[runIndex[runPointer]._startLocation.lng,runIndex[runPointer]._startLocation.lat,styleFinStart.el];
markerStart.marker.addTo(viewMap.map)


// to create the end marker when the run is reattempted  to show the location the user should go to once he reaches required start location to end the reattempted run.
var styleFinDes=new Styling([runIndex[runPointer]._endLocation.lng,runIndex[runPointer]._endLocation.lat],'images/redIcon.jpg',30)     // changes the style of the start maker to the redIcon image in the images file
markerDestination.markerLocation=[runIndex[runPointer]._endLocation.lng,runIndex[runPointer]._endLocation.lat,styleFinDes.el]
markerDestination.marker.addTo(viewMap.map)


// to display each individual path marker for each saved location moment of the user to display the whole path that the user has taken
for (var path=0;path<(runIndex[runPointer]._pathTaken.length);path++)
{
	var stylePath=new Styling([runIndex[runPointer]._pathTaken[path].lng,runIndex[runPointer]._pathTaken[path].lat],'images/purplePath.png',7)       // changes the style of the start maker to the purplePath image in the images file
	markerPath.markerLocation=[runIndex[runPointer]._pathTaken[path].lng,runIndex[runPointer]._pathTaken[path].lat,stylePath.el]                     // creates where the markers location should be at
	markerPath.marker.addTo(viewMap.map)                         // adds it to the map to be displayed
}


document.getElementById("runData").textContent="Total Distance Travelled: "+runIndex[runPointer]._totalDistance+"m, Total Time Taken: "+runIndex[runPointer]._timeTaken+"s, The Average Speed of The Run: "+runIndex[runPointer]._speedOfRun+"Km/h"




/*
 * this function is used to delete one specific run that user has selected to remove it from the list, this is caleed when the user clicks on the delete button
*/
function deleteRun()
{
	runIndex.splice(runPointer,1)
	localStorage.setItem(APP_PREFIX,JSON.stringify(runIndex));
	location.href='index.html'
}


/*
 * function is called when the user clicks on the reattempt button to reattempt the run
*/
function reattemptRun()
{
	
	localStorage.setItem('reattempted',true)
	location.href='newRun.html'    // takes user to the new Run page to reattempt the selected run.
		
	
}

