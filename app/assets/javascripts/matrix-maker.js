
$(document).ready(function() {
    for (groupIndex = 2; groupIndex <= 5; groupIndex++) {
	var val;

	// Dynamically set column group labels based on row group labels

	val = $("input.label.group" + groupIndex).val()
	$("td.label.group" + groupIndex).text(val);

	$("input.label.group" + groupIndex).change( function() {
	    var val = $(this).val()
	    $("td.label." + this.classList[0]).text(val); // TODO: Check for relevant class
	});

	// Dynamically set column labels based on row labels
	
	for (itemIndex = 1; itemIndex <= 5; itemIndex++) {
	    val = $("input.label.g" + groupIndex + "i" + itemIndex).val()
	    $("td.label.g" + groupIndex + "i" + itemIndex).html(val); //*** note text()?

	    $("input.label.g" + groupIndex + "i" + itemIndex).change( function() {
		var val = $(this).val()
		$("td.label." + this.classList[0]).html(val); // TODO: Check for relevant class
	    });
	}
    }

    // Toggle cells between 'X', 'O', 'X?', 'O?', and ''
    var symbols = [ 'X', 'O', 'X?', 'O?', '' ]
    $("td.cell").unbind('click').click( function() {
 		current = $(this).text();
		for (i = 0; i < symbols.length; i++) {
			    if (current == symbols[i]) {
					$(this).html(symbols[(i+1) % symbols.length]);
				break;
		    }
		}
		return false;
   });
});