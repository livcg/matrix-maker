


getMovesUrl = location.href + "/moves"
addMoveUrl = location.href + "/moves"

$(document).ready(function() {
	//*** Delete?
    for (groupIndex = 2; groupIndex <= 5; groupIndex++) {
		var val

		// Dynamically set column group labels based on row group labels

		val = $("input.label.group" + groupIndex).val()
		$("td.label.group" + groupIndex).text(val)

		$("input.label.group" + groupIndex).change( function() {
		    var val = $(this).val()
		    $("td.label." + this.classList[0]).text(val) // TODO: Check for relevant class
		})

		// Dynamically set column labels based on row labels
		
		for (itemIndex = 1; itemIndex <= 5; itemIndex++) {
		    val = $("input.label.g" + groupIndex + "i" + itemIndex).val()
		    $("td.label.g" + groupIndex + "i" + itemIndex).html(val) //*** note text()?

		    $("input.label.g" + groupIndex + "i" + itemIndex).change( function() {
			var val = $(this).val()
			$("td.label." + this.classList[0]).html(val) // TODO: Check for relevant class
		    })
		}
    }

    // Replay moves
    $.getJSON(getMovesUrl, function() {
    	console.log("success") 
    }).done( function(data) {
    	$.each(data, function(i, move) {
	    	symbol = move[2]
	    	if (symbol != null) {
		    	moveId = move[0]
		    	cellId = move[1]
		    	$("td#" + cellId).text(symbol)
	    	}
		})
	})

    // Toggle cells between 'X', 'O', 'X?', 'O?', and ''
    var symbols = [ 'X', 'O', 'X?', 'O?', '' ]
    $("td.cell").unbind('click').click( function() {
 		current = $(this).text()
 		i = 0
 		newSymbolIndex = 0
		for (; i < symbols.length; i++) {
			    if (current == symbols[i]) {
					newSymbolIndex = (i+1) % symbols.length
				break
		    }
		}
		newSymbol = symbols[newSymbolIndex]
		$.ajax({ url: addMoveUrl,
			   	method: "POST",
			   	data: { move: { cell: $(this).attr("id"), symbol: newSymbol }}})
			.done(function() { 
				//*** Update move list in view
			})
			$(this).html(newSymbol)
		return false
   })
})