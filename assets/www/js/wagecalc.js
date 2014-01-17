var wageCalcBox = {};

// Format function from stack overflow example
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
		//Constants
		ctx.FIVE_WEEKDAY = 0;  //five eights
		ctx.FIVE_WEEKEND = 1;  //shared
		ctx.FOUR_WEEKDAY = 2;  //four tens
		ctx.FOUR_FRIDAY = 3;  //four tens
		
		ctx.wageOptions = [
			["Helper", 31.25],
			["1st Year", 24.46], 
			["2nd Year", 31.25],
			["3rd Year", 38.05],
			["Journeyman (S)", 41.83],
			["Journeyman (N)", 42.58],
			["Lead Hand", 45.73],
			["Foreman", 48.08],
			["GF", 50.08]];

		ctx.dayOptions = [
			["0", 0],
	 		["8", 8],
			["10", 10],
			["12", 12],
			["13", 13],
			["A", -1],
			["B", -2],
			["C", -3]];
		
		//2014 tax year-------------------------------
		ctx.fedTaxTable2014 = [
			[0, 43953, 87907, 136370],  //brackets
			[0.15, 0.22, 0.26, 0.29],  //rates
			[0, 3077, 6593, 10681],  //fed constant (k from table)
			[2340.63, 2425.50, 913.68, 11138, 1127]   //Fed tax credits [sum * 0.15, cpp max, ei max, TD1 default, employment credit]
		];
		ctx.abTaxTable2014 = [
			[], //brackets
			[.10],  //rate
			[2112.62, 2425.5, 913.68, 17787]  //AB tax credits [sum * %10, cpp max, ei max, AB1 amount]
		];
		ctx.cppEiDuesRates = [
			0.0495,  //cpp
			0.0188,  //ei
			0.0375  //dues
		];
		//--------------------------------------------

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
		ctx.exemptSumDia = [$("#exempt-sum-dialogue"), "    Tax Exempt:  ${0}"];
		ctx.deductionsSumDia = [$("#deductions-dialogue"), "    Total Deductions:  ${0}"];
		ctx.netSumDia = [$("#takehome-dialogue"), "    Take Home:  ${0}"];

		//CheckBoxes
		ctx.fourtensCheck = $("#checkbox-fourtens");
		ctx.nightsCheck = [$("#checkbox-night"), "Nights = ${0}"];
		ctx.taxCheck = [$("#checkbox-tax"), "Income Tax = ${0}"];
		ctx.eiCheck = [$("#checkbox-ei"), "EI/CPP = ${0}"];
		ctx.duesCheck = [$("#checkbox-dues"), "Working Dues = ${0}"];
		ctx.toggleClass = $(".toggle-check");
		ctx.startChecked = $(".start-checked");
		ctx.settingsButton = $("#settings-button");
		 
		//[value, checkbox, string proto, custom textbox, taxable checkbox]
		ctx.weekTravel = [220, $("#checkbox-travel-week"), "Weekly Travel = ${0}", $("#textbox-weekly-travel"), $("taxable-weekly-travel")];
		ctx.dayTravel = [20, $("#checkbox-travel-day"), "Daily Travel = ${0}", $("#textbox-daily-travel"), $("taxable-daily-travel")];
		ctx.loa = [195, $("#checkbox-loa"), "LOA = ${0}", $("#textbox-loa"), $("#taxable-loa")];
		ctx.monthlyDues = [37.90, $("#checkbox-monthly-dues"), "Monthly Dues = ${0}", $("#textbox-monthly-dues"), 0]; 
		
		ctx.addTax = [0, $("#textbox-addtax")];
		ctx.customWage = [40, $("#textbox-wage")];
		ctx.customDays = [
		  [$("textbox-a-sing"), 8.5, $("textbox-a-half"), 2, $("textbox-a-double"), 1.5],
		  [$("textbox-b-sing"), 5, $("textbox-b-half"), 0, $("textbox-b-double"), 0],
		  [$("textbox-c-sing"), 1, $("textbox-c-half"), 2, $("textbox-c-double"), 3]
		];
		
		ctx.populateSelects();
		ctx.setClickListeners();
	};

	ctx.populateSelects = function() {				
		for (var i = 0; i < ctx.wageOptions.length; i++)
		{
			var wageString = ctx.wageOptions[i][0] + ":  $" + ctx.wageOptions[i][1].toString();
	   		ctx.wageSel.append($('<option>').text(wageString).attr('value', ctx.wageOptions[i][1]));
			if (i == 5) ctx.defaultWageVal = ctx.wageOptions[i][1];
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
		ctx.toggleClass.bind('click', function() {
			ctx.updateCalc();	
							 });

		$(document.body).bind('pageinit', function() {
			ctx.setDefaultValues();
						   });
		$(document.body).on("change", "select", function() {
			ctx.updateCalc();
		});
		
		/*
		ctx.commitButton.bind('click', function() {
			ctx.commitSettings();
		});
		*/

	};

	//called after 'pageinit' has been recieved via bind
	ctx.setDefaultValues = function() {
		ctx.wageSel.val(ctx.defaultWageVal).selectmenu('refresh');
		
		//I hate your face jQuery
		ctx.taxCheck[0].prop("checked", true).checkboxradio('refresh');
		ctx.eiCheck[0].prop("checked", true).checkboxradio('refresh');
		ctx.duesCheck[0].prop("checked", true).checkboxradio('refresh');
		
		ctx.updateCalc();
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
		ctx.deductions = [0,0,0,0,0,0,0];  //sum, fedtax, provtax, cpp, ei, working dues, monthly dues 
		ctx.taxExempt = 0; //sum
		ctx.nightPrem = 0;
		ctx.isFourTens = ctx.fourtensCheck.prop('checked');
		ctx.travelDayCount = 0;
		ctx.grossPay = 0;
		
		var lastHrsWorked = 0;
		for(var i = 0; i < ctx.weekArr.length; i++) {
			var dayArr = [0,0,0];
			var parsed = parseFloat(ctx.weekArr[i].val());
			if(parsed < 0) {  //custom days A=-1, B=-2, C=-3
				var customIndex = -(parsed + 1);
				dayArr[0] = ctx.customDays[customIndex][1];  //Single
				dayArr[1] = ctx.customDays[customIndex][3];  //OT
				dayArr[2] = ctx.customDays[customIndex][5];  //Double
			} else {  //Use default 8/2/2 or 4 10s
				if(i == 0 || i == 6) {  //Sun || Sat
					dayArr = ctx.hrsSum(ctx.FIVE_WEEKEND, parsed);
				} else {
					if(!ctx.isFourTens) {  //FiveEights weekday
						dayArr = ctx.hrsSum(ctx.FIVE_WEEKDAY, parsed);
					} else {
						if(i == 5) {  //FourTens Friday
							dayArr = ctx.hrsSum(ctx.FOUR_FRIDAY, parsed);
						} else {  //FourTens weekday
							dayArr = ctx.hrsSum(ctx.FOUR_WEEKDAY, parsed);
						}
					}
				}
			}
			ctx.hrsArr[0] += dayArr[0];
			ctx.hrsArr[1] += dayArr[1];
			ctx.hrsArr[2] += dayArr[2];
			ctx.hrsWorked += dayArr[0] + dayArr[1] + dayArr[2];  //for nightshift
				
			if(ctx.hrsWorked - lastHrsWorked > 0) {
				ctx.travelDayCount++;
			}
			lastHrsWorked = ctx.hrsWorked;
		} //weekdays forloop
		
		ctx.bonuses = [  //value, active, taxable
		  [ctx.weekTravel[0], ctx.weekTravel[1].prop('checked'), ctx.weekTravel[4].prop('checked')],  //[value, active, taxable]
		  [ctx.dayTravel[0] * ctx.travelDayCount, ctx.dayTravel[1].prop('checked'), ctx.dayTravel[4].prop('checked')],
		  [ctx.loa[0], ctx.loa[1].prop('checked'), ctx.loa[4].prop('checked')] //LOA
		];
		
		ctx.wageVal = parseFloat(ctx.wageSel.val());
		//todo custom wage
		
		ctx.grossPay = ctx.hrsArr[2] * ctx.wageVal * 2 +
			ctx.hrsArr[1] * ctx.wageVal * 1.5 +
			ctx.hrsArr[0] * ctx.wageVal;
		if(ctx.nightsCheck[0].prop("checked")){  //Nightshift premium $3/hr
			ctx.nightPrem = 3 * ctx.hrsWorked;
		}
		ctx.grossPay += ctx.nightPrem;
		ctx.grossNoVac = ctx.grossPay;
		ctx.grossPay *= (1 + 0.1);  //vacation pay @ %10 
		
		$.each(ctx.bonuses, function(i, e){
			if(e[1]){ //active toggle
			  if(e[2]) {  //taxable
				ctx.grossPay += e[0];
			  } else {
				ctx.taxExempt += e[0];
			  }
			}
		});
		
		ctx.deductions[1] = ctx.taxFed(ctx.grossPay);
		ctx.deductions[2] = ctx.taxAB(ctx.grossPay);  //Todo: province select
		var cppEiDuesArr = ctx.cppEiDues(ctx.grossPay, ctx.grossNoVac);
		
		ctx.deductions[3] = cppEiDuesArr[0];
		ctx.deductions[4] = cppEiDuesArr[1];
		ctx.deductions[5] = cppEiDuesArr[2];
		ctx.deductions[6] = ctx.monthlyDues[0];
		
		ctx.deductions[1] = (ctx.taxCheck[0].prop('checked')) ? ctx.deductions[1] : 0;
		ctx.deductions[2] = (ctx.taxCheck[0].prop('checked')) ? ctx.deductions[2] : 0;
		ctx.deductions[3] = (ctx.eiCheck[0].prop('checked')) ? ctx.deductions[3] : 0;
		ctx.deductions[4] = (ctx.eiCheck[0].prop('checked')) ? ctx.deductions[4] : 0;
		ctx.deductions[5] = (ctx.duesCheck[0].prop('checked')) ? ctx.deductions[5] : 0;
		ctx.deductions[6] = (ctx.monthlyDues[1].prop('checked')) ? ctx.deductions[6] : 0;
		
		
		for(var i = 1; i < ctx.deductions.length ; i++){  //get sum of deductions non zeroed
			ctx.deductions[0] += ctx.deductions[i];
		}
		ctx.takeHome = ctx.grossPay - ctx.deductions[0] + ctx.taxExempt;
	};
	
	ctx.hrsSum = function(dayType, hrs){  //Splits for default contract days
		var retArr = [0,0,0];
		
		var remTwelve = (hrs - 10 > 0) ? hrs - 10 : 0;
		var remTen = (hrs - 8 - remTwelve > 0) ? hrs - 8 - remTwelve : 0;
		var remEight = hrs - remTwelve - remTen;
		
		switch(dayType) {
			case ctx.FIVE_WEEKDAY:
				retArr[2] = remTwelve;
				retArr[1] = remTen;
				retArr[0] = remEight;
				break;
			case ctx.FIVE_WEEKEND:
				retArr[2] = hrs;
				break;
			case ctx.FOUR_WEEKDAY:
				retArr[0] = remTen + remEight;
				retArr[2] = remTwelve;
				break;
			case ctx.FOUR_FRIDAY:
				retArr[1] = remTen + remEight;
				retArr[2] = remTwelve;
				break;
			default:  //incase of fail call
				return [0,0,0];
		}
		return retArr;
	};
	
	//Canadian Federal Tax
	ctx.taxFed = function(gross) {
		var anGross = gross * 52;
		var fedTax = 0;
		var bracket = ctx.fedTaxTable2014[0];
		var rate = ctx.fedTaxTable2014[1];
		var fedConst = ctx.fedTaxTable2014[2];
		var fedTaxCred = ctx.fedTaxTable2014[3][0];
		
		if(anGross < bracket[1]) {
			fedTax = anGross * rate[0] - fedConst[0] - fedTaxCred;
		} else {
			if(anGross < bracket[2]) {
				fedTax = anGross * rate[1] - fedConst[1] - fedTaxCred;
			} else {
				if(anGross < bracket[3]) {
					fedTax = anGross * rate[2] - fedConst[2] - fedTaxCred;	
				} else {
					//if(anGross >= bracket[3])
					fedTax = anGross * rate[3] - fedConst[3] - fedTaxCred;			
				}
			}
		}
		return (fedTax>0) ? fedTax/52 : 0;
	};
	
	//Alberta Provincial tax
	ctx.taxAB = function(gross) {
		abRate = ctx.abTaxTable2014[1][0];
		abTaxCred = ctx.abTaxTable2014[2][0];
		abTax = (gross * 52 * abRate - abTaxCred) / 52;  //wow, such simple
		return (abTax>0) ? abTax : 0;
	};
	
	//Ontario Provincial tax
	ctx.taxON = function() {
		
	};
	
	ctx.cppEiDues = function(gross, grossNoVac) {
		retArr = [0,0,0];
		rates = ctx.cppEiDuesRates;
		anGross = gross * 52;
		retArr[0] = (anGross - 3500) / 52 * rates[0];
		retArr[1] = gross * rates[1];
		retArr[2] = grossNoVac * rates[2];  //dues
		retArr[0] = (retArr[0]>0) ? retArr[0] : 0; //zeros negative vals for cpp
		return retArr;
	};
	
	ctx.updateText = function() {
		//[$("#hours-sum"), "  Hours:  1x: 0  1.5x: 0  2x: 0"];
		ctx.hoursSumDia[0].text(ctx.hoursSumDia[1].format(ctx.hrsArr[0], ctx.hrsArr[1], ctx.hrsArr[2]));
		ctx.grossSumDia[0].text(ctx.grossSumDia[1].format(ctx.grossPay.toFixed(2)));
		ctx.exemptSumDia[0].text(ctx.exemptSumDia[1].format(ctx.taxExempt.toFixed(2)));
		ctx.deductionsSumDia[0].text(ctx.deductionsSumDia[1].format(ctx.deductions[0].toFixed(2)));
		ctx.netSumDia[0].text(ctx.netSumDia[1].format(ctx.takeHome.toFixed(2)));
		
		$("label[for='checkbox-night'] span.ui-btn-text").text(ctx.nightsCheck[1].format(ctx.nightPrem));
		$("label[for='checkbox-tax'] span.ui-btn-text").text(ctx.taxCheck[1].format((ctx.deductions[1] + ctx.deductions[2]).toFixed(2)));
		$("label[for='checkbox-ei'] span.ui-btn-text").text(ctx.eiCheck[1].format((ctx.deductions[3] + ctx.deductions[4]).toFixed(2)));
		$("label[for='checkbox-dues'] span.ui-btn-text").text(ctx.duesCheck[1].format(ctx.deductions[5].toFixed(2)));
		$("label[for='checkbox-monthly-dues'] span.ui-btn-text").text(ctx.monthlyDues[2].format(ctx.deductions[6].toFixed(2)));
	    $("label[for='checkbox-travel-week'] span.ui-btn-text").text(ctx.weekTravel[2].format(ctx.weekTravel[0].toFixed(2)));
	    $("label[for='checkbox-travel-day'] span.ui-btn-text").text(ctx.dayTravel[2].format((ctx.dayTravel[0] * ctx.travelDayCount).toFixed(2)));		
	};
	
	ctx.settingsDialog = function() {
		/*
		$("#settingtown").dialog({
    		modal: true,
    		draggable: false,
    		resizable: false,
    		position: ['center', 'top'],
    		show: 'blind',
    		hide: 'blind',
    		width: 400,
    		dialogClass: 'ui-dialog-osx',
    		buttons: {
        		"I've read and understand this": function() {
            		$(this).dialog("close");
        		}
    		}
		});
		*/
	};

})(wageCalcBox);
	





