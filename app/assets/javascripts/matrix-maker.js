


getMovesUrl = location.href + "/moves"
addMoveUrl = location.href + "/moves"
undoMovesUrl = location.href + "/undomoves"
maxMovesPerColumn = 10
moveCounter = 1

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
		moveId = moves[i][0]
		cellId = moves[i][1] 
		symbol = moves[i][2]
		if ((symbol != undefined) && (symbol != null)) {
			$("td#" + cellId).text(symbol)
			addMoveToMoveList(moveId, cellId, symbol)
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
		addMoveToMoveList("-1", cellId, newSymbol) //*** Change moveId

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

function addMoveToMoveList(moveId, cellId, newSymbol) {
	string = "<span id=\"m" + moveCounter + "i" + moveId + "\">" // m<MOVE_#>i<MOVE_ID>
	if (cellId == "0") {
		string = string + " Note: " + newSymbol
	} else {
		string = string + moveCounter + ": " + cellId + " : " + newSymbol 
			+ " <a href=\"" + undoMovesUrl + "/" + moveId 
			+ "\" data-confirm=\"Are you sure you want to undo this move (#"
			+ moveCounter + ": " + cellId + " : " + newSymbol 
			+ ") and all moves after it?\" data-method=\"post\" >(x)</a>"
	}
	string = string + "</span></br>"
	$("table#moves td:last-of-type").append(string)
	if (moveCounter % maxMovesPerColumn == 0)
		$("table#moves tr").append("<td></td>")
	moveCounter++
}


