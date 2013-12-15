var flangeBox = {};  //Used for context to coordinate between the functions.

/*This parses a JSON file with values for ASME flange tables, populates selectors accordingly
 * and adds listeners to detect value changes and the push of the submit buttons.  If the
 * selects are changed it enables the submit buttons and outputs the proper values in an
 * alert box.  It was designed using Jquery Mobile and Cordova.*/
(function(context) {	

	context.startLoad = function() {
		$(function() {
            FastClick.attach(document.body);
        });
		
		$("#flange-send").click(function(){
			context.calcFlange();
		});
	
		$("#stud-send").click(function(){
			context.calcStud();
		});
		
		context.flangeSelClass = $(".flange-sel");
		
		context.sizeSel = $("#select-flange-size");
		context.rateSel = $("#select-flange-rating");
		context.studSel = $("#stud-select");
		
		
		$.getJSON("data/FlangeArrays.json").done(function(data){
			context.postLoad(data);
		});
	};
	
	//after the JSON is done loading this is called to run the rest of the setup.	
	context.postLoad = function(data) {
		context.data = data;
		context.popSelects();
		context.addSelectChange();
		
	};
	
	context.popSelects = function() {
		data = context.data;
		selectSize = context.sizeSel;
		selectRate = context.rateSel;
		selectStud = context.studSel;
		
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
			//console.log(studSizeOrdString);
			studStatsOrdered[i] = [studSizes[studSizeOrdString]];
		} 
		
		context.studStatsOrdered = studStatsOrdered;
		context.sendBut = $("#flange-send");
		context.sendBut.button("disable");
		context.sendBut.button("refresh");
		
		context.studBut = $("#stud-send");
		context.studBut.button("disable");
		context.studBut.button("refresh");
		context.addSelectChange();	
	};
	
	context.addSelectChange = function() {
		context.flangeSelClass.bind('change', function(){
			console.log("change");
			context.updateSendButton();
		});
	};
	
	context.updateSendButton = function () {

		if(context.rateSel[0].selectedIndex > 0 && context.sizeSel[0].selectedIndex > 0) {
			context.sendBut.button("enable");
		} else {
			context.sendBut.button("disable");
		}
		context.sendBut.button("refresh");
		
		if(context.studSel[0].selectedIndex > 0) {
			context.studBut.button("enable");
		} else {
			context.studBut.button("disable");
		}
		context.studBut.button("refresh");
	};
	
	context.calcStud = function () {
		studVal = context.studSel[0].selectedIndex;	
		console.log("studval: " + studVal);
		context.getStudStatsOrdered(studVal - 1);
		context.displayStud();
	};
	
	context.getStudStatsOrdered = function(studSize) {
		context.studStats = context.studStatsOrdered[studSize][0];
		console.log(context.studStats);
	};
	
	context.displayStud = function(){
		studStats = context.studStats;
		studSize = context.studSel.val();
		studString = ("Stud Size: " + studSize + "\"");
		toolString = ("Wrench: " + studStats[0] + "\",   Drift Pin: " + studStats[1] + "\"");
		torqueString = ("B7 Torque: " + studStats[3] + " ft-lbs \nB7M Torque: " + studStats[2] + " ft-lbs");
		
		outString = (studString + "\n" +
			toolString + "\n" +
			torqueString);
		
		alert(outString);
	};
	
	context.calcFlange = function() {
		sSize = context.sizeSel;
		sRate = context.rateSel;
	
		rateInd = sRate[0].selectedIndex;
		context.rateVal = sRate.val();
		context.sizeVal = sizeVal = $(sSize).val();
		
		//Inside the $.each() callback above, you would do $.each(this.subaction, function() { alert(this.name); });, that would give you A, B, C, etc. - test it out here:
		var fStats;
		switch(rateInd) {
			case 0:
				fStats = context.data.fStats150;
				break;
	        case 1:
				fStats = context.data.fStats300;
				break;
			case 2:
				fStats = context.data.fStats400;
				break;
		    case 3:
				fStats = context.data.fStats600;
				break;
		    case 4:
				fStats = context.data.fStats900;
				break;
			case 5:
				fStats = context.data.fStats1500;
				break;
		}	
		context.getFStats(fStats, sizeVal);
	};
	
	context.getFStats = function (data, sizeVal){
		$.each(data, function(i, value){
			console.log("checked: " + i);
			if(i === sizeVal) {
				console.log("got: " + value);
				context.flangeStats = value;
			}
		});
		context.getStudStats(context.flangeStats[0]);
		
		context.displayFlange();
	};
	
	context.getStudStats = function (studSize){
		$.each(context.data.studSizes, function(i, value) {
			if(i === studSize) {
				console.log("got stud: " + value);
				context.studStats = value;
			}
		});
		//console.log("Should still be: " + context.torqueStats);
	};
	
	context.displayFlange = function() {
	//studStats = studSize: [wrench size, drift pin, b7m torque, b7 torque]
	//flangeStats = flangeSize: [studSize, studIndex, studCount, studLength] 
	flangeStats = context.flangeStats;
	studStats = context.studStats;
	
	flangeString = ("Flange Size: " + context.sizeVal + "\": " + context.rateVal + "#");
	studString = ("Studs: " + flangeStats[2] + " @ " + flangeStats[0] + "\" x " + flangeStats[2] + "\"");
	toolString = ("Wrench: " + studStats[0] + "\",   Drift Pin: " + studStats[1] + "\"");
	torqueString = ("B7 Torque: " + studStats[3] + " ft-lbs \nB7M Torque: " + studStats[2] + " ft-lbs");
	
	alert(flangeString + "\n" + 
		studString + "\n"
		+ toolString + "\n"
		+ torqueString);
	};
	
})(flangeBox);

//going to make the last module added call the load functions on each.
$(document).ready(function(){
	flangeBox.startLoad();	
});

			



	

