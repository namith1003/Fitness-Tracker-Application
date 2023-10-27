// Code for the main app page (Past Runs list).

// The following is sample code to demonstrate navigation.
// You need not use it for final app.



var runNumber;


function showRun(runOrder)
{
    // Save the desired run to local storage so it can be accessed from View Run page.
    localStorage.setItem(APP_PREFIX + "-selectedRun", runOrder);	
	
    // ... and load the View Run page.
    location.href = 'viewRun.html';
	
	
}


// takes the stored runs in the local storage to be shown in the list
var runIndex = JSON.parse(localStorage.getItem(APP_PREFIX));


// creates the html list required in the past runs page.
for (runNumber=0;runNumber<runIndex.length;runNumber++)
{
	var list=document.createElement('li')
	
	
	list.setAttribute("class","mdl-list__item--two-line"); 
	list.setAttribute("onclick","showRun("+runNumber+")");
	
	
	var span1=document.createElement("span")
	var span2=document.createElement("span")
	var span3=document.createElement("span")
	
	span1.setAttribute("class","mdl-list__item-primary-content")
	span2.textContent=runIndex[runNumber]._nameOfRun;
	span3.setAttribute("class","mdl-list__item-sub-title")
	span3.textContent=runIndex[runNumber]._summaryOfRun
	
	
	span1.appendChild(span2);
	span1.appendChild(span3);
	list.appendChild(span1);
	
	
	document.getElementById("runsList").appendChild(list)
	
}







//put the correct showrun(the number updated in the brackets of run represented)