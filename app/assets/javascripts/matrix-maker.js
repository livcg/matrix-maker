


getMovesUrl = location.href + "/moves"
addMoveUrl = location.href + "/moves"
undoMovesUrl = location.href + "/moves"

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
	for (i = 0; i < moves.length; i++) { 
		symbol = moves[i][1]
		if (symbol != null) {
			cellId = moves[i][0] 
			$("td#" + cellId).text(symbol)
		} 
	}

    // Toggle cells between 'X', 'O', 'X?', 'O?', and ''
    var symbols = [ 'X', 'O', 'X?', 'O?', '' ]
    $("td.cell").unbind("click").click(function() {
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
			alert("Warning: Failed to save your move on the server - [ " + cellId + " : " + newSymbol + " ]")
		})

		return false
    })
 
    // Add note to moves
    $("th.r0.c0").unbind("click").click(function() {
		// Update move list
		note = "NOTE"
		string = "<div><span>Note: NOTE</span></div><div></div>"
		$("div#moves").append(string)

		// Update server
    	$.post( addMoveUrl,
    			{ move: { cell: 0, symbol: note }}
    	).fail(function() {
    		alert("Failed to save note on moves on the server")
    	})
    })
})


