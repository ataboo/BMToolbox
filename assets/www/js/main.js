$(document).ready(function(){
	$.getJSON("data/FlangeArrays.json").done(
		function(data){
			console.log(data);
			console.log(data.fSizes[0]);
			$('#text1').text(data.fSizes[0]);
			fSizeTown = data.fSizes;
			var options = $("#options");
			$.each(fSizeTown, function(i, value) {
    			$(options).append($('<option>').text(value).attr('value', value));
			});
		});
	
	$("#btn1").click(
		function(){
			
    		//$("#text1").text(flangeTest);.
    		alert("banana");
    		console.log("banana");
    	}
    );
    
	$("#btn2").click(
  			function(){
    			$("#text2").html("<b>Hello world!</b>");
    		}
	);
	
	$("#options").change(function(event, changeHandler){
	});
});
