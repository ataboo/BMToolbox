var wageCalcBox = {};

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {

    var args = arguments;
    var sprintfRegex = /\{(\d+)\}/g;

    var sprintf = function (match, number) {
      return number in args ? args[number] : match;
    };

    return this.replace(sprintfRegex, sprintf);
  };
}

//setup and populate
(function(ctx) {
	ctx.setupAndStart = function() {
		//Selects
		ctx.wageSel = $("#wage-select");
		ctx.sunSel = $("#sun-hours-select");
		ctx.monSel = $("#mon-hours-select");
		ctx.tueSel = $("#tue-hours-select");
		ctx.wedSel = $("#wed-hours-select");
		ctx.thuSel = $("#thu-hours-select");
		ctx.friSel = $("#fri-hours-select");
		ctx.satSel = $("#sat-hours-select");
		ctx.weekArr = [ctx.sunSel, ctx.monSel, ctx.tueSel, 
			ctx.wedSel, ctx.thuSel, ctx.friSel, ctx.satSel];
		ctx.daySelClass = $(".day-select");

		//Dialogues [link to item, default text or preamble]
		ctx.hoursSumDia = [$("#hours-sum"), "  Hours:  1x: {0},  1.5x: {1},  2x: {2}"];
		ctx.grossSumDia = [$("#gross-sum-dialogue"), "    Taxable Gross:  ${0}"];
		ctx.exemptSumDia = [$("#exempt-dialogue"), "    Tax Exempt:  ${0}"];
		ctx.deductionsSumDia = [$("#deductions-dialogue"), "    Total Deductions:  ${0}"];
		ctx.netSumDia = [$("#takehome-dialogue"), "    Take Home:  ${0}"];

		//CheckBoxes
		ctx.fourtensCheck = $("#checkbox-fourtens");
		ctx.nightsCheck = [$("#checkbox-night"), "Nights = ${0}"];
		ctx.weekTravelCheck = $("#checkbox-travel-week");
		ctx.dayTravelCheck = $("#checkbox-travel-day");
		ctx.taxCheck = $("#checkbox-tax");
		ctx.eiCheck = $("#checkbox-ei");
		ctx.duesCheck = $("#checkbox-dues");
		ctx.toggleClass = $(".toggle-check");
		ctx.startChecked = $(".start-checked");

		ctx.populateSelects();
		ctx.setClickListeners();
	};

	ctx.populateSelects = function() {
		ctx.wageOptions = [
			["1st Year", 20], 
			["2nd Year", 30],
			["3rd Year", 35],
			["Journeyman", 41],
			["Lead Hand", 44],
			["Foreman", 47],
			["GF", 49]];

		ctx.dayOptions = [
			["0", 0],
	 		["8", 8],
			["10", 10],
			["12", 12],
			["13", 13]];

		for (var i = 0; i < ctx.wageOptions.length; i++)
		{
			var wageString = ctx.wageOptions[i][0] + ":  $" + ctx.wageOptions[i][1].toString();
	   		ctx.wageSel.append($('<option>').text(wageString).attr('value', ctx.wageOptions[i][1]));
			if (i == 3) ctx.defaultWageVal = ctx.wageOptions[i][1];
			//console.log("Added: " + ctx.wageOptions[i][0]);
		};

		$.each(ctx.weekArr, function(j, value) {
				   for (var i = 0; i < ctx.dayOptions.length; i++)
				   {
					   value.append($('<option>').text(ctx.dayOptions[i][0]).attr('value', ctx.dayOptions[i][1]));
					   //console.log("Added: " + ctx.dayOptions[i][0]);
				   };	
			   });
	};

	//binds click listener to select and toggle classes to run updateCalc
	ctx.setClickListeners = function() {
		/*
		ctx.daySelClass.bind('change', function() {
								 ctx.updateCalc();
							 });
		*/
							 
		ctx.toggleClass.bind('click', function() {
			ctx.updateCalc();	
							 });

		$(document.body).bind('pageinit', function() {
			ctx.setDefaultValues();
						   });
		$(document.body).on("change", "select", function() {
			ctx.updateCalc();
		});

	};

	//called after 'pageinit' has been recieved via bind
	ctx.setDefaultValues = function() {
		ctx.wageSel.val(ctx.defaultWageVal).selectmenu('refresh');
		
		//I hate your face jQuery
		$("#checkbox-tax").prop("checked", true).checkboxradio('refresh');
		$("#checkbox-ei").prop("checked", true).checkboxradio('refresh');
		$("#checkbox-dues").prop("checked", true).checkboxradio('refresh');
	};

	//--------------------Update-------------------------

	ctx.updateCalc = function() {
		console.log(ctx.wageSel.val());
		//console.log($("#night-toggle").is(":checked"));
	
		ctx.calcPay();
		ctx.updateText();	
	};
	
	ctx.calcPay = function() {
		ctx.hrsWorked = 0;
		ctx.hrsArr = [0,0,0];
		
		$.each(ctx.weekArr, function(i, e) {
			ctx.hrsWorked += parseFloat(e.val());
		});
		ctx.wageVal = parseFloat(ctx.wageSel.val());
		if(ctx.fourtensCheck.prop('checked')) {
			ctx.hrsArr = ctx.hrsSumFourTens(ctx.weekArr);
		} else {
			ctx.hrsArr = ctx.hrsSum(ctx.weekArr);
		}
		ctx.grossPay = ctx.hrsArr[2] * ctx.wageVal * 2 +
			ctx.hrsArr[1] * ctx.wageVal * 1.5 +
			ctx.hrsArr[0] * ctx.wageVal;
		if(ctx.nightsCheck[0].prop("checked")){
			ctx.grossPay += 3 * ctx.hrsWorked;
		}
		
		
		
	};
	
	ctx.hrsSum = function(weekArr){  //Five Eights
		var retArr = [0,0,0];
		for(var i = 1; i < 6; i++) { //weekdays
			dayHrs = parseFloat(weekArr[i].val());
			//2x time after 10
			if(dayHrs > 10) {
				retArr[2] += (dayHrs - 10);
				dayHrs -= retArr[2];
			}
			//1.5x time after 8
			if(dayHrs > 8) {
				retArr[1] += (dayHrs - 8);
				dayHrs -= retArr[1];
			}
			//rest 1x time
			retArr[0] += dayHrs;
		}
		
		for(var i = 0; i < 7; i+=6) { //weekends
			dayHrs = parseFloat(weekArr[i].val());
			//All 2x on weekends
			retArr[2] += dayHrs;
		}
		
		return retArr;
	};
	
	ctx.hrsSumFourTens = function(weekArr) {  //FourTens
		retArr = [0,0,0];
		for(var i = 1; i < 6; i++) {  //Monday to Thurday
			dayHrs = parseFloat(weekArr[i].val());
			//2x time after 10
			if(dayHrs > 10) {
				retArr[2] += (dayHrs - 10);
				dayHrs -= retArr[2];
			}

			if(i == 5) { //1.5x time on fridays
				retArr[1] += dayHrs;
			} else { //rest 1x time
				retArr[0] += dayHrs;
			}
		}
		
		for(i = 0; i < 7; i+=6) { //Weekends
			dayHrs = parseFloat(weekArr[i].val());
			//All 2x on weekends
			retArr[2] += dayHrs;
		}
	
		return retArr;
	};
	
	ctx.taxFed = function() {
		
	};
	
	ctx.taxAB = function() {
		
	};
	
	ctx.taxON = function() {
		
	};
	
	ctx.updateText = function() {
		//[$("#hours-sum"), "  Hours:  1x: 0  1.5x: 0  2x: 0"];
		ctx.hoursSumDia[0].text(ctx.hoursSumDia[1].format(ctx.hrsArr[0], ctx.hrsArr[1], ctx.hrsArr[2]));
		ctx.grossSumDia[0].text(ctx.grossSumDia[1].format(ctx.grossPay));
		$("label[for='checkbox-night'] span.ui-btn-text").text(ctx.nightsCheck[1].format(ctx.hrsWorked * 3));
		//ctx.nightsCheck[0].next('label').text(ctx.nightsCheck[1].format(ctx.hrsWorked * 3));
	};

})(wageCalcBox);
	





