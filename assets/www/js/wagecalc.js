var wageCalcBox = {};

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
		ctx.hoursSumDia = [$("#hours-sum"), "  Hours:  1x: 0  1.5x: 0  2x: 0"];
		ctx.grossSumDia = [$("#gross-sum-dialogue"), "    Taxable Gross:  $"];
		ctx.exemptSumDia = [$("#exempt-dialogue"), "    Tax Exempt:  $"];
		ctx.deductionsSumDia = [$("#deductions-dialogue"), "    Total Deductions:  $"];
		ctx.netSumDia = [$("#takehome-dialogue"), "    Take Home:  $"];
	
		//CheckBoxes
		ctx.nightsCheck = $("#checkbox-nights");
		ctx.weekTravelCheck = $("#checkbox-travel-week");
		ctx.dayTravelCheck = $("#checkbox-travel-day");
		ctx.taxCheck = $("#checkbox-tax");
		ctx.eiCheck = $("#checkbox-ei");
		ctx.duesCheck = $("#checkbox-dues");
		ctx.toggleClass = $(".toggle-check");
		
		ctx.populateSelects();
		ctx.setClickListeners();
	};
	
	ctx.populateSelects = function(){
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
		
		for(var i = 0; i < ctx.wageOptions.length; i++) {
			var wageString = ctx.wageOptions[i][0] + ":  $" + ctx.wageOptions[i][1].toString();
	   		ctx.wageSel.append($('<option>').text(wageString).attr('value', ctx.wageOptions[i][1]));
			if(i == 3) ctx.defaultWageVal = ctx.wageOptions[i][1];
			//console.log("Added: " + ctx.wageOptions[i][0]);
		};
		
		$.each(ctx.weekArr, function(j, value){
			for(var i = 0; i < ctx.dayOptions.length; i++) {
	   			value.append($('<option>').text(ctx.dayOptions[i][0]).attr('value', ctx.dayOptions[i][1]));
				//console.log("Added: " + ctx.dayOptions[i][0]);
			};	
		});
	};
	
	//binds click listener to select and toggle classes to run updateCalc
	ctx.setClickListeners = function() {
		ctx.daySelClass.bind('change', function(){
			ctx.updateCalc();
		});
		
		ctx.toggleClass.bind('click', function(){
			ctx.updateCalc();	
		});
		
		$('#Results').bind('pageinit', function() {
  			ctx.setDefaultValues();
		});
	
	};
	
	//called after 'pageinit' has been recieved via bind
	ctx.setDefaultValues = function() {
		ctx.wageSel.val(ctx.defaultWageVal).selectmenu('refresh');
		//ctx.wageSel.prop('selected', ctx.defaultWageString).siblings('option').removeAttr('selected');
		ctx.wageSel.selectmenu('refresh');
	};
	
	//--------------------Update-------------------------
	
	ctx.updateCalc = function() {
		ctx.wageSel.selectmenu("refresh", true);
		console.log("update called");
		//console.log($("#night-toggle").is(":checked"));
	};
	
}) (wageCalcBox);
	





