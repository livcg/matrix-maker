


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
		if ((cellId != undefined) && (cellId.length > 0) && (symbol != undefined) && (symbol != null)) { //*** ick
			//*** console.log("Move: " + cellId + " : " + symbol)
			$("td#" + cellId).text(symbol)
			addToMoveListOnPage(moveId, cellId, symbol)
		} 
	}

    // Toggle cells between 'X', 'O', 'X?', 'O?', and ''
    var symbols = [ 'X', 'O', 'X?', 'O?', '' ]
    $("td.cell").unbind("click").click(function() {
		tdElement = $(this)
		cellId = tdElement.attr("id")

    	// Determine new symbol
 		current = tdElement.text() //*** Change current to currentSymbol
 		i = 0 //*** Change to symbolIndex
 		newSymbolIndex = 0
		for (; i < symbols.length; i++) {
			    if (current == symbols[i]) {
					newSymbolIndex = (i+1) % symbols.length
				break
		    }
		}
		newSymbol = symbols[newSymbolIndex]

		// Update moves array
		moves.push([ -1, cellId, newSymbol ]) //*** Change -1
		moveArrIndex = moves.length - 1 //*** Ick

		// Update symbol in matrix
		tdElement.html(newSymbol)

		// Update move list on the page
		moveCount = addToMoveListOnPage("-1", cellId, newSymbol) //*** Change -1

		// Update server
		$.post( addMoveUrl,
				{ move: { cell: cellId, symbol: newSymbol }}
		).success(function(data) {
			// Update moves array w/ the new moveId
			moveId = data
			moves[moveArrIndex][0] = moveId

			// Update HTML - Add undo move link, update td's ID
			addUndoMoveLinkToPage(moveCount, moveId, cellId, newSymbol)
			updateMoveIdOnMoveListOnPage(moveCount, moveId)
			//*** Handle notes! moveCount always 0
		}).fail(function() {
			alert("Warning: Failed to save your move on the server - [ " + cellId + " : " + newSymbol + " ]")
		})

		return false
    })

if (false) { 
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
}

})

// Regular move:
//   <span id="m<MOVE_COUNT>i<MOVE_ID>"><MOVE_COUNT>: <CELL_ID> : <SYMBOL> <UNDO_MOVE_LINK></span><br/>
// Note:
//   <span id="m0i<MOVE_ID>">Note: <SYMBOL> <UNDO_MOVE_LINK></span><br/> //*** change ID to "n<MOVE_ARR_INDEX>i<MOVE_ID>" ?
function addToMoveListOnPage(moveId, cellId, symbol) {
	moveCount = moveCounter
	string = ""

	// Add new <td> if needed
	if ((moveCount > maxMovesPerColumn) && (moveCount % maxMovesPerColumn == 1))
		$("table#moves tr").append("<td></td>")

	if (cellId == "0") {
		// Note rather than a regular move
		moveCount = 0
		string = "<span id=\"m0i" + moveId + "\">Note: " + symbol + " " 
			+ getUndoMoveLink(moveCount, moveId, cellId, symbol) + "</span><br/>"
	} else {
		// Regular move
		string = "<span id=\"m" + moveCount + "i" + moveId + "\">" + moveCount + " : " 
			+ cellId + " : " + symbol + " " + getUndoMoveLink(moveCount, moveId, cellId, symbol)
			+ "</span><br/>"
		moveCounter++
	}
	$("table#moves td:last-of-type").append(string)

	return moveCount
}

function addUndoMoveLinkToPage(moveId, cellId, symbol) {
	string = " " + getUndoMoveLink(moveCount, moveId, cellId, symbol)
	$("table#moves td span#m" + moveCount + "i-1").append(string)
}

function getUndoMoveLink(moveCount, moveId, cellId, symbol) {
	string = ""
	if (moveId != -1) {
		string = "<a href=\"" + undoMovesUrl + "/" + moveId 
					+ "\" data-confirm=\"Are you sure you want to undo this move ("
						+ (moveCount == 0 ? "Note: " : 	(moveCount + ": " + cellId + " : ") )
						+ symbol + ") and all moves after it?\" data-method=\"post\" >(x)</a>"
	}
	return string
}

function updateMoveIdOnMoveListOnPage(moveCount, moveId) {
	$("table#moves td span#m" + moveCount + "i-1").attr("id", "m" + moveCount + "i" + moveId)
}


