


GET_MOVES_URL = location.href + "/moves"
ADD_MOVE_URL = location.href + "/moves"
UNDO_MOVES_URL = location.href + "/undomoves"
ADD_NOTE_URL = location.href + "/addmovenote"
MAX_MOVES_PER_COLUMN = 10
MAX_MOVES_PER_ROW = 100
DEFAULT_MOVE_ID = -1
NOTE_CELL_ID = "0"
SYMBOLS = [ 'X', 'O', 'X?', 'O?', '' ]

moveCounter = 1
addMoveTableRow = true
addMoveTableColumn = true
addRowToMoveTable = true //***
addColumnToMoveTable = true //***
moveTableHeadingColspan = MAX_MOVES_PER_ROW / MAX_MOVES_PER_COLUMN

$(document).ready(function() {

	// Make matrix table headers stick when scrolling down the table
   var clonedHeaderRow;
   $("table.matrix").each(function() {
       clonedHeaderRow = $("thead.header", this);
       clonedHeaderRow
         .before(clonedHeaderRow.clone())
         .css("width", clonedHeaderRow.width())
         .addClass("floatingHeader"); 
       $("th.r0.c0", clonedHeaderRow).css("width", $("th.r0.c0", this).css("width"))
   });
   $(window).scroll(updateTableHeaders).trigger("scroll");  

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
	for (moveArrIndex = 0; moveArrIndex < moves.length; moveArrIndex++) { 
		move = moves[moveArrIndex]
		moveId = move[0]
		cellId = move[1] 
		symbol = move[2]
		if ((cellId != undefined) && (cellId.length > 0) && (symbol != undefined) && (symbol != null)) { //*** ick
			//*** console.log("Move: " + cellId + " : " + symbol)
			$("td#" + cellId).text(symbol)
//***			addToMoveListOnPage(moveId, cellId, symbol, moveArrIndex)
			addToMoveListOnPage2(moveId, cellId, symbol, moveArrIndex)
		} 
	}

    // Toggle cells between 'X', 'O', 'X?', 'O?', and ''
    $("td.cell").unbind("click").click(function() {
		tdElement = $(this)
		cellId = tdElement.attr("id")

    	// Determine new symbol
 		currentSymbol = tdElement.text().trim()
		newSymbol = currentSymbol
		for (symbolIndex = 0; symbolIndex < SYMBOLS.length; symbolIndex++) {
			    if (currentSymbol == SYMBOLS[symbolIndex]) {
					newSymbol = SYMBOLS[(symbolIndex + 1) % SYMBOLS.length]
				break
		    }
		}

		// Update moves array
		moves.push([ DEFAULT_MOVE_ID, cellId, newSymbol ])
		moveArrIndex = moves.length - 1 //*** Ick

		// Update symbol in matrix
		tdElement.html(newSymbol)

		// Update move list on the page
//***		moveCount = addToMoveListOnPage(DEFAULT_MOVE_ID, cellId, newSymbol, moveArrIndex)
		moveCount = addToMoveListOnPage2(DEFAULT_MOVE_ID, cellId, newSymbol, moveArrIndex)

		// Update server
		$.post(ADD_MOVE_URL,
				{ move: { cell: cellId, symbol: newSymbol }}
		).success(function(data) {
			// Update moves array w/ the new moveId
			moveId = data
			moves[moveArrIndex][0] = moveId

			// Update HTML - Add undo move link, update td's ID
//***			updateHtmlAfterAddMoveServerCall(moveCount, moveId, cellId, newSymbol, moveArrIndex)
			updateHtmlAfterAddMoveServerCall2(moveCount, moveId, cellId, newSymbol, moveArrIndex)
		}).fail(function() {
			alert("Warning: Failed to save your move on the server - [ " + cellId + " : " + newSymbol + " ]")
		})

		return false
    })

    // Add note to moves
    $("div#note button").unbind("click").click(function() {
    	note = $("div#note input").prop("value")

		// Update moves array
		moveArrIndex = moves.push([ DEFAULT_MOVE_ID, NOTE_CELL_ID, note ]) - 1

		// Update move list on the page
		moveCount = addToMoveListOnPage(DEFAULT_MOVE_ID, NOTE_CELL_ID, note, moveArrIndex)

		// Update server
    	$.post(ADD_NOTE_URL, { note: note }
		).done(function() {
			// Clear note field
			$("div#note input").prop("value", "")
		}).success(function(data) {
			// Update moves array w/ the new moveId
			moveId = data
			moves[moveArrIndex][0] = moveId

			// Update HTML - Add undo move link, update td's ID
			updateHtmlAfterAddMoveServerCall(moveCount, moveId, NOTE_CELL_ID, note, moveArrIndex)
		}).fail(function() {
			alert("Warning: Failed to save your note on the server - [ " + note + " ]")
		})
    })
})

// Regular move:
//   <span id="m<MOVE_COUNT>i<MOVE_ID>"><span class="move-count"><MOVE_COUNT></span>: <CELL_ID> : <SYMBOL></span><br/>
//   =>
//   <span id="m<MOVE_COUNT>i<MOVE_ID>"><a ...><MOVE_COUNT></a>: <CELL_ID> : <SYMBOL></span><br/>
// Note:
//   <span id="n<MOVE_ARRAY_INDEX>i<MOVE_ID>"><span class="move-count">Note</span>: <SYMBOL></span><br/> 
//   =>
//   <span id="n<MOVE_ARRAY_INDEX>i<MOVE_ID>"><a ...>Note</a>: <SYMBOL></span><br/> 
function addToMoveListOnPage(moveId, cellId, symbol, moveArrIndex) {
	textPrefix = ""
	string = ""

	// Defaults for a regular move (not a note)
	moveCount = moveCounter
	spanId = getMoveSpanId(moveCount, moveId, cellId, moveArrIndex)

	// If needed, add new <tr> or <td>
	if (addMoveTableRow) {
		$("table#moves span.last-count").removeClass("last-count")
		$("table#moves").append("<tr><th colspan=\"" + moveTableHeadingColspan + "\">Moves " + moveCount + 
			"-<span class=\"last-count\"></span>:</th></tr><tr></tr>")
		addMoveTableRow = false
	}
	if (addMoveTableColumn) {
		$("table#moves tr:last-of-type").append("<td></td>")
		addMoveTableColumn = false		
	}
	if (cellId == NOTE_CELL_ID) {
		// Note rather than a regular move
		// textPrefix = "<a href=\"" + UNDO_MOVES_URL + "/" + moveId 
		// 	+ "\" data-confirm=\"Are you sure you want to remove this note ("
		// 	+ symbol + ") and all moves after it?\" data-method=\"post\">Note</a>: "
		textPrefix = getMoveNumberHtml(moveCount, moveId, cellId, symbol) + ": "
	} else {
		// Regular move
		textPrefix = getMoveNumberHtml(moveCount, moveId, cellId, symbol) + ": " + cellId + " : "
		moveCounter++
		if ((moveCounter > 1) && (moveCounter % MAX_MOVES_PER_ROW == 1))
			addMoveTableRow = true
		if ((moveCounter > 1) && (moveCounter % MAX_MOVES_PER_COLUMN == 1))
			addMoveTableColumn = true
	}
	string = "<span id=\"" + spanId + "\">" + textPrefix + symbol + "</span><br/>"
	$("table#moves tr:last-of-type td:last-of-type").append(string)

	// Update last move in current row's <th>
	$("table#moves span.last-count").text(moveCount) //*** Optimize this on page load

	return moveCount
}

// Regular move:
//   <td class="move-count"><MOVE_COUNT></td> <td><CELL_ID></td> <td><SYMBOL></td>
// Note:
//   <td>Note</td> <td colspan="2"><NOTE></td>
function addToMoveListOnPage2(moveId, cellId, symbol, moveArrIndex) {
	string = ""

	// Defaults for a regular move (not a note)
	moveCount = moveCounter
	moveTrId = getMoveTrId(moveCount, moveId, cellId, moveArrIndex)

	// If needed, add new row/column/table
	if (addRowToMoveTable) {
		$("table.moves span.last-count").removeClass("last-count")
		$("table.moves").append("<tr><th colspan=\"" + moveTableHeadingColspan + "\">Moves " + moveCount + 
			"-<span class=\"last-count\"></span>:</th></tr><tr class=\"row-of-moves\"></tr>")
		addRowToMoveTable = false
	}
	if (addColumnToMoveTable) {
		$("table.moves tr.row-of-moves:last-of-type")
			.append("<td><table class=\"column-of-moves\"><!--<tr><th>Move #</th><th>Cell</th><th>Symbol</th></tr>--></table></td>") //***
		addColumnToMoveTable = false		
	}

	// Add HTML for the new move
	if (cellId == NOTE_CELL_ID) {
		// Note rather than a regular move
		td1 = "<td><a href=\"" + UNDO_MOVES_URL + "/" + moveId 
			+ "\" data-confirm=\"Are you sure you want to remove this note (" + symbol 
			+ ") and all moves after it?\" data-method=\"post\">Note</a></td>"
		td2 = "<td colspan=\"2\">" + symbol + "</td>"
		string = "<tr>" + td1 + td2 + "</tr>"
	} else {
		// Regular move
		td1 = "<td><a href=\"" + UNDO_MOVES_URL + "/" + moveId + "\" data-confirm=\"Are you sure you want to undo move "
			+ moveCount + " (" + cellId + " : \'" + (symbol? symbol : "&nbsp;") 
			+ "\') and all moves after it?\" data-method=\"post\">" + moveCount + "</a></td>"
		td2 = "<td>" + cellId + "</td>"
		td3 = "<td>" + symbol + "</td>"
		string = "<tr id=\"" + moveTrId + "\">" + td1 + td2 + td3 + "</tr>"

		moveCounter++
		if ((moveCounter > 1) && (moveCounter % MAX_MOVES_PER_ROW == 1))
			addRowToMoveTable = true
		if ((moveCounter > 1) && (moveCounter % MAX_MOVES_PER_COLUMN == 1))
			addColumnToMoveTable = true
	}
	$("table.moves table.column-of-moves:last-of-type").last().append(string)

	// Update last move count in heading
	$("table.moves span.last-count").text(moveCount) //*** Optimize this on page load

	return moveCount
}

//*** delete eventually
function getMoveSpanId(moveCount, moveId, cellId, moveArrIndex) {
	spanId = ""
	if (cellId == NOTE_CELL_ID) {
		// Note
		spanId = "n" + moveArrIndex + "i" + moveId
	}  else {
		spanId = "m" + moveCount + "i" + moveId
	}
	return spanId
}

function getMoveTrId(moveCount, moveId, cellId, moveArrIndex) {
	moveTrId = ""
	if (cellId == NOTE_CELL_ID) {
		// Note
		moveTrId = "n" + moveArrIndex + "i" + moveId
	}  else {
		moveTrId = "m" + moveCount + "i" + moveId
	}
	return moveTrId
}

function updateHtmlAfterAddMoveServerCall(moveCount, moveId, cellId, symbol, moveArrIndex) {
	moveNumberHtml = getMoveNumberHtml(moveCount, moveId, cellId, symbol, moveArrIndex)
	oldSpanId = getMoveSpanId(moveCount, DEFAULT_MOVE_ID, cellId, moveArrIndex)
	newSpanId = getMoveSpanId(moveCount, moveId, cellId, moveArrIndex)
	$("table#moves td span#" + oldSpanId + " span.move-count").html(moveNumberHtml).attr("id", newSpanId)
}

function updateHtmlAfterAddMoveServerCall2(moveCount, moveId, cellId, symbol, moveArrIndex) {
	oldTrId = getMoveTrId(moveCount, DEFAULT_MOVE_ID, cellId, moveArrIndex)
	newTrId = getMoveTrId(moveCount, moveId, cellId, moveArrIndex)
	td1Html = "<a href=\"" + UNDO_MOVES_URL + "/" + moveId + "\" data-confirm=\"Are you sure you want to undo move "
		+ moveCount + " (" + cellId + " : " + symbol + ") and all moves after it?\" data-method=\"post\" >" 
		+ moveCount + "</a>"

	// Add undo link to move count
	$("table.moves tr#" + oldTrId + " td:first").html(td1Html)

	// Update tr's ID attr
	$("table.moves tr#" + oldTrId).attr("id", newTrId)
}

function getMoveNumberHtml(moveCount, moveId, cellId, symbol) {
	string = ""
	if (cellId == NOTE_CELL_ID) {
		if (moveId == DEFAULT_MOVE_ID) {
			string = "<span class=\"move-count\">Note</span>"
		} else {
			string = "<a href=\"" + UNDO_MOVES_URL + "/" + moveId 
				+ "\" data-confirm=\"Are you sure you want to remove this note ("
				+ symbol + ") and all moves after it?\" data-method=\"post\">Note</a>"
		}
	} else if (moveId != DEFAULT_MOVE_ID) {
		string = "<a href=\"" + UNDO_MOVES_URL + "/" + moveId 
					+ "\" data-confirm=\"Are you sure you want to undo move " + moveCount + " (" + cellId + " : "
						+ symbol + ") and all moves after it?\" data-method=\"post\" >" + moveCount + "</a>"
	} else {
		string = "<span class=\"move-count\">" + moveCount + "</span>"
	}
	return string
}

function updateTableHeaders() {
   $("table.matrix").each(function() {
       var el             = $(this),
           offset         = el.offset(),
           scrollTop      = $(window).scrollTop(),
           floatingHeader = $(".floatingHeader", this)
       
       if ((scrollTop > offset.top) && (scrollTop < offset.top + el.height())) {
           floatingHeader.css({
            "visibility": "visible"
           });
       } else {
           floatingHeader.css({
            "visibility": "hidden"
           });      
       };
   });
}

