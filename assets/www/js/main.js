var BMBox = {};

$(document).ready(function(){	
	$.getJSON("data/FlangeArrays.json").done(function(data){
			BMBox.data = data;
			console.log(data);
			var selectSize = $("#select_size");
			var selectRate = $("#select_rate");
			$.each(data.fSizes, function(i, value) {
    			$(selectSize).append($('<option>').text(value + "\"").attr('value', value));
			});
			$.each(data.fRatings, function(i, value) {
    			$(selectRate).append($('<option>').text(value + "#").attr('value', value));
			});
			
	});
	
	$("#go_but").click(function(){
		calcFlange();
	});
});

function calcFlange() {
	sSize = $("#select_size");
	sRate = $("#select_rate");

	rateInd = $(sRate)[0].selectedIndex;
	BMBox.rateVal = $(sRate).val();
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
	
	BMBox.studStats = getStud(BMBox.flangeStats[0]);
	
	updateElements();
}
	
function getStud(studSize) {
	$.each(BMBox.data.studSizes, function(i, value) {
		if(i === studSize)
			console.log("got stud: " + value);
			return value;
	});
}
	
function updateElements() {
	//studStats = studSize: [wrench size, drift pin, b7m torque, b7 torque]
	//flangeStats = flangeSize: [studSize, studIndex, studCount, studLength] 
	flangeStats = BMBox.flangeStats;
	studStats = BMBox.studStats;
	
	flangeString = ("Flange Size: " + BMBox.sizeVal + "\": " + BMBox.rateVal + "#");
	studString = ("Studs: " + flangeStats[2] + "@ " + BMBox.flangeStats[0] + "\" x " + BMBox.flangeStats[2] + "\"");
	
	alert(flangeString + "\n" + studString, "Flange Result:");
	
}
