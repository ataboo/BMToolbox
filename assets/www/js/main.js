
var BMBox = {};

(function(context) {	

	context.loadJSON = function() {
		$("#flange-send").click(function(){
			calcFlange();
		});
	
		$("#stud-send").click(function(){
			calcStud();
		});
		
		$.getJSON("data/FlangeArrays.json").done(function(data){
			context.postLoad(data);
		});
		

	};
		
	context.postLoad = function(data) {
		context.data = data;
		context.popSelects();
		
		
	};
	
	context.popSelects = function() {
		data = context.data;
		context.sizeSel = selectSize = $("#select-flange-size");
		context.rateSel = selectRate = $("#select-flange-rating");
		
		context.studSel = selectStud = $("#stud-select");
		
		$.each(data.fSizes, function(i, value) {
	   		selectSize.append($('<option>').text(value + "\"").attr('value', value));
		});
		$.each(data.fRatings, function(i, value) {
	   		selectRate.append($('<option>').text(value + "#").attr('value', value));
		});
	
		studSizes = data.studSizes;
		studSizeOrd = data.studSizeOrdered;
		var studStatsOrdered = [];
		
		for(var i = 0; i < studSizeOrd.length; i++) {
			selectStud.append($('<option>').text(studSizeOrd[i] + "\"").attr('value', studSizeOrd[i] + "\""));
			studSizeOrdString = studSizeOrd[i].toString();
			console.log(studSizeOrdString);
			studStatsOrdered[i] = [studSizes[studSizeOrdString]];
		} 
		
		context.studStatsOrdered = studStatsOrdered;
		context.sendBut = $("#flange-send");
		context.sendBut.button("disable");
		context.sendBut.button("refresh");
		
		context.studBut = $("#stud-send");
		context.studBut.button("disable");
		context.studBut.button("refresh");
		addSelectChange();	
	};
})(BMBox);

$(document).ready(function(){
	BMBox.loadJSON();	
});

function popSelects(data){

}
	
function addSelectChange(){ 
	$(".flange-sel").bind('change', function(){
		console.log("change");
		updateSendButton();
	});
}
	
function updateSendButton() {
	console.log("Rate Index:" + BMBox.rateSel[0].selectedIndex);
	console.log("Size Index: " + BMBox.sizeSel[0].selectedIndex);
	console.log(BMBox.rateSel[0].selectedIndex > 0);
	
	if(BMBox.rateSel[0].selectedIndex > 0 &&
		BMBox.sizeSel[0].selectedIndex > 0) {
		BMBox.sendBut.button("enable");
	} else {
		BMBox.sendBut.button("disable");
	}
	BMBox.sendBut.button("refresh");
	
	if(BMBox.studSel[0].selectedIndex > 0) {
		BMBox.studBut.button("enable");
	} else {
		BMBox.studBut.button("disable");
	}
	BMBox.studBut.button("refresh");
}

function calcStud() {
	console.log("ran calc stud");
	studVal = BMBox.studSel[0].selectedIndex;	
	console.log("studval: " + studVal);
	getStudStatsOrdered(studVal - 1);
	displayStud();
}


function getStudStatsOrdered(studSize){
	BMBox.studStats = BMBox.studStatsOrdered[studSize][0];
	console.log(BMBox.studStats);
}
	
function displayStud(){
	studStats = BMBox.studStats;
	studSize = BMBox.studSel.val();
	studString = ("Stud Size: " + studSize + "\"");
	toolString = ("Wrench: " + studStats[0] + "\",   Drift Pin: " + studStats[1] + "\"");
	torqueString = ("B7 Torque: " + studStats[3] + " ft-lbs \nB7M Torque: " + studStats[2] + " ft-lbs");
	
	outString = (studString + "\n" +
		toolString + "\n" +
		torqueString);
	
	alert(outString);
	
}

function calcFlange() {
	sSize = BMBox.sizeSel;
	sRate = BMBox.rateSel;

	rateInd = sRate[0].selectedIndex;
	BMBox.rateVal = sRate.val();
	BMBox.sizeVal = sizeVal = $(sSize).val();
	
	//Inside the $.each() callback above, you would do $.each(this.subaction, function() { alert(this.name); });, that would give you A, B, C, etc. - test it out here:

	switch(rateInd) {
		case 0:
			getFStats(BMBox.data.fStats150, sizeVal);
			break;
        case 1:
			getFStats(BMBox.data.fStats300, sizeVal);
			break;
		case 2:
			getFStats(BMBox.data.fStats400, sizeVal);
			break;
	    case 3:
			getFStats(BMBox.data.fStats600, sizeVal);
			break;
	    case 4:
			getFStats(BMBox.data.fStats900, sizeVal);
			break;
		case 5:
			getFStats(BMBox.data.fStats1500, sizeVal);
			break;
	}		
}
			
function getFStats(data, sizeVal){
	$.each(data, function(i, value){
		console.log("checked: " + i);
		if(i === sizeVal) {
			console.log("got: " + value);
			BMBox.flangeStats = value;
		}
	});
	getStudStats(BMBox.flangeStats[0]);
	
	displayFlange();
}

function getStudStats(studSize){
	$.each(BMBox.data.studSizes, function(i, value) {
		if(i === studSize) {
			console.log("got stud: " + value);
			BMBox.studStats = value;
		}
	});
	//console.log("Should still be: " + BMBox.torqueStats);
}
	
function displayFlange() {
	//studStats = studSize: [wrench size, drift pin, b7m torque, b7 torque]
	//flangeStats = flangeSize: [studSize, studIndex, studCount, studLength] 
	flangeStats = BMBox.flangeStats;
	studStats = BMBox.studStats;
	
	flangeString = ("Flange Size: " + BMBox.sizeVal + "\": " + BMBox.rateVal + "#");
	studString = ("Studs: " + flangeStats[2] + " @ " + flangeStats[0] + "\" x " + flangeStats[2] + "\"");
	toolString = ("Wrench: " + studStats[0] + "\",   Drift Pin: " + studStats[1] + "\"");
	torqueString = ("B7 Torque: " + studStats[3] + " ft-lbs \nB7M Torque: " + studStats[2] + " ft-lbs");
	
	alert(flangeString + "\n" + 
		studString + "\n"
		+ toolString + "\n"
		+ torqueString);
}
