var wageCalcBox = {};

(function(ctx) {

	ctx.setupAndStart = function() {
		ctx.sunSel = $("#sun-hours-select");
		ctx.monSel = $("#mon-hours-select");
		ctx.tueSel = $("#tue-hours-select");
		ctx.wedSel = $("#wed-hours-select");
		ctx.thuSel = $("#thu-hours-select");
		ctx.friSel = $("#fri-hours-select");
		ctx.satSel = $("#fri-hours-select");
		
		ctx.weekArr = [ctx.sunSel, ctx.monSel, ctx.tueSel, 
			ctx.wedSel, ctx.thuSel, ctx.friSel, ctx.satSel];
			
		
	};
	
}) (wageCalcBox);




