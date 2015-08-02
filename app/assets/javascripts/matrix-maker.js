


getMovesUrl = location.href + "/moves"
addMoveUrl = location.href + "/moves"

$(document).ready(function() {

	// Add class="hover" to current row's and column's cells
   	var allCells = $("th, td")
   	allCells.mouseenter(function() {
   		classes = $(this).attr("class")

	   	// Handle row
	   	rowPattern = new RegExp("r\\d+")
	   	rCounts = rowPattern.exec(classes)
	   	if (rCounts != undefined)
		   	allCells.filter("." + rCounts[0]).addClass("hover")

		// Handle column
		columnPattern = new RegExp("c\\d+")
		cCounts = columnPattern.exec(classes)
		if (cCounts != undefined)
			allCells.filter("." + cCounts[0]).addClass("hover")
   	}).mouseleave(function() {
   		allCells.removeClass("hover")
	})

    // Replay moves
    $.getJSON(getMovesUrl).done( function(data) {
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
		tdElement = $(this)
		cellId = $(this).attr("id")
		newSymbol = symbols[newSymbolIndex]

		// Update symbol in matrix
		tdElement.html(newSymbol)

		// Update move list
		string = " <span>[ " + cellId + " : " + newSymbol + " ]</span> "
		$("div#moves div:last-child").append(string)
		if ($("div#moves div:last-child span").length == 10)
			$("div#moves").append("<div></div>")

		// Update server
		$.post( addMoveUrl,
				{ move: { cell: cellId, symbol: newSymbol }}
		).fail(function() {
			alert("Warning: Failed to store your move on the server - [ " + cellId + " : " + newSymbol + " ]")
		})

		return false
   })

})


