var BMBox = {};

$(document).ready(function(){	
	$.getJSON("data/FlangeArrays.json").done(function(data){
			BMBox.data = data;
			console.log(data);
			console.log(data.fSizes[0]);
			$('#text1').text(data.fSizes[0]);
			var selectSize = $("#select_size");
			var selectRate = $("#select_rate");
			$.each(data.fSizes, function(i, value) {
    			$(selectSize).append($('<option>').text(value).attr('value', value));
			});
			$.each(data.fRatings, function(i, value) {
    			$(selectRate).append($('<option>').text(value).attr('value', value));
			});
	});
	
	$("#btn1").click(function(){
		calcFlange();
	});
    
	$("#btn2").click(
  			function(){
    			$("#text2").html("<b>Hello world!</b>");
    });
});

function calcFlange() {
	sSize = $("#select_size");
	sRate = $("#select_rate");

	rateInd = $(sRate)[0].selectedIndex;
	sizeKey = $(sSize).val();
	
	//Inside the $.each() callback above, you would do $.each(this.subaction, function() { alert(this.name); });, that would give you A, B, C, etc. - test it out here:

	switch(rateInd) {
		case 0:
			//var flangeDataArr = BMBox.data.fStats150;
			if(sizeKey === "10"){
				alert(sizeKey + "naana");
			}
				//console.log(flangeDataArr);
			break;
		/*
		case 1:
			flangeDataArr = data.fStats300[sizeInd];
			break;
		case 2:
			flangeDataArr = data.fStats400[sizeInd];
			break;
		case 3:
			flangeDataArr = data.fStats600[sizeInd];
			break;
		case 4:
			flangeDataArr = data.fStats900[sizeInd];
	s		break;
		case 5:
			flangeDataArr = data.fStats1500[sizeInd];
			break;
		*/
		}
			
}
