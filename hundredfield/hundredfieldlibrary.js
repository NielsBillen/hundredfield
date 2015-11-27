/*-----------------------------------------------------------------------------
 * Javascript containing the core elemens of the Hundredfield
 *---------------------------------------------------------------------------*/

/*global console, HTMLTableCellElement, HTMLInputElement, Random*/

/* define the HundredFieldLibrary namespace */
var HundredFieldLibrary = HundredFieldLibrary || {};

/*-----------------------------------------------------------------------------
 *
 * HundredFieldLibrary.Cell: represents a cell in the hundredfield.
 *
 *---------------------------------------------------------------------------*/

/*
 * HundredFieldLibrary.Cell: creates a new cell for the hundredfield.
 *
 * @param container     the cell in the table.
 * @param input         the input element for filling the cell.
 * @param solution      the solution (i.e. the corrent) value of this cell.
 */
HundredFieldLibrary.Cell = function (row, column, container, input, solution) {
    "use strict";
    if (typeof row !== "number") {
        throw "the given row '" + row + "' is not a number!";
    }
    if (typeof column !== "number") {
        throw "the given column '" + column + "' is not a number!";
    }
    if (typeof solution !== "number") {
        throw "the given solution '" + solution + "' is not a number!";
    }
    if (!(container instanceof HTMLTableCellElement)) {
        throw "the given container is not a table cell!";
    }
    if (!(input instanceof HTMLInputElement)) {
        throw "the given input is not an HTMLInputElement!";
    }
    
    this.row = row;                 // the row where this cell appears
    this.column = column;           // the column where this cell appears
    this.container = container;     // the table cell
    this.input = input;             // the input contained in the table cell
    this.solution = solution;       // the solution of this cell
    this.selected = false;          // whether this cell is selected
    this.isstart = false;           // whether this cell is the start cell
};

/*
 * HundredFieldLibrary.Cell.prototype.setStart(value):
 *
 * Enables/disables this cell as a start cell depending on the
 * given value.
 *
 * @param value     whether this cell is a start cell.
 */
HundredFieldLibrary.Cell.prototype.setStart = function (value) {
    "use strict";

    this.isstart = value;

    if (value === true) {
        this.input.value = this.getSolution();
        this.input.classList.add("hundredfield-input-start");
    } else if (value === false) {
        this.input.value = "";
        this.input.classList.remove("hundredfield-input-start");
    } else {
        throw "the given value '" + value + " is not a boolean!";
    }
};

/*
 * Returns true when this cell needs a border when it is drawn.
 *
 * @return true when this cell needs a border when it is drawn.
 */
HundredFieldLibrary.Cell.prototype.needsBorder = function () {
    "use strict";
    return this.isstart || this.selected;
};

/*
 * HundredFieldLibrary.addClickListener(element, handler): 
 *
 * Method which attaches a "click" or a "touchend" listener to the 
 * given element which calls the given 'handler' when the event
 * is fired.
 *
 * A "touchend" event is used when the platform allows this interaction.
 * This reduces the amount of delay on the event handling on touch screen
 * devices.
 *
 * @param element   the element to which the event listener must be added.
 * @param handler   the handler which needs to be called when the event
 *                  is triggered.
 */
HundredFieldLibrary.addClickListener = function (element, handler) {
    "use strict";
    
    if (typeof document.body.ontouchend !== "undefined") {
        element.addEventListener("touchend", handler);
    } else {
        element.addEventListener("click", handler);
    }
};

/*
 * HundredFieldLibrary.Cell.prototype.addClickListener(handler): 
 *
 * adds the given handler as a click listener to this cell. When the cell
 * is clicked / touched (on mobile devices), the handler function will be
 * called with the click (touch) event as its first parameter and the clicked
 * cell object as the second parameter.
 *
 * @param handler   the click handler which is called on a click event.
 */
HundredFieldLibrary.Cell.prototype.addClickListener = function (handler) {
    "use strict";
    
    HundredFieldLibrary.addClickListener(this.container, function (e) {
        handler(e, this);
    }.bind(this));
};

/*
 * HundredFieldLibrary.Cell.prototype.addInputListener(handler): 
 *
 * adds the given handler as an input listener to this cell. When the value of
 * this cell is changed, the handler function will be called with the change 
 * event as its first parameter and the clicked cell object as the second 
 * parameter.
 *
 * @param handler   the input handler which is called on an input change 
 *                  event.
 */
HundredFieldLibrary.Cell.prototype.addInputListener = function (handler) {
    "use strict";
    
    this.getInput().addEventListener("change", function (e) {
        handler(e, this);
    }.bind(this));
    this.getInput().addEventListener("keyup", function (e) {
        handler(e, this);
    }.bind(this));
};

/*
 * HundredFieldLibrary.Cell.prototype.getSolution():
 *
 * Returns the solution of this cell as an integer.
 */
HundredFieldLibrary.Cell.prototype.getSolution = function () {
    "use strict";
    return this.solution;
};

/*
 * HundredFieldLibrary.Cell.prototype.getInputValue():
 *
 * Returns the input entered in this cell as an integer value.
 */
HundredFieldLibrary.Cell.prototype.getInputValue = function () {
    "use strict";
    return parseInt(this.input.value.replace(/^\s+|\s+$/gm, '').trim(), 10);
};

/*
 * HundredFieldLibrary.Cell.prototype.getInput():
 *
 * Returns the <input> element of this cell.
 *
 * @return the <input> element of this cell.
 */
HundredFieldLibrary.Cell.prototype.getInput = function () {
    "use strict";
    return this.input;
};

/*
 * HundredFieldLibrary.cell.prototype.setSelected()
 *
 * Selects this cell if the given value is true, or deselects it otherwise.
 *
 * @param   value   whether this cell is selected (true) or not (false).
 */
HundredFieldLibrary.Cell.prototype.setSelected = function (value) {
    "use strict";
    
    this.selected = value;
    
    if (value === true) {
        this.container.classList.add("hundredfield-cell-selected");
    } else if (value === false) {
        this.container.classList.remove("hundredfield-cell-selected");
    } else {
        throw "the given value is not a boolean value!";
    }
};

/*
 * HundredFieldLibrary.cell.prototype.setHidden()
 *
 * Hides this cell when the given value is (true) or makes it visible
 * when the given value is (false). Note that start cells cannot be
 * hidden!
 *
 * @param value     whether this cell should be hidden (true) or not (false).
 */
HundredFieldLibrary.Cell.prototype.setHidden = function (value) {
    "use strict";

    if (this.isstart) {
        return;
    }
    
    if (value === true) {
        if (this.selected) {
            this.container.classList.add("hundredfield-cell-hidden-selected");
        } else {
            this.container.classList.add("hundredfield-cell-hidden");
        }
    } else if (value === false) {
        this.container.classList.remove("hundredfield-cell-hidden-selected");
        this.container.classList.remove("hundredfield-cell-hidden");
    } else {
        throw "the given value is not a boolean value!";
    }
};

/*-----------------------------------------------------------------------------
 * HundredFieldLibrary.init(rows, columns, start)
 *
 * Initializes a new hundredfield with the given number of rows, the given
 * number of columns and where the first cell starts at the given input
 * number.
 *---------------------------------------------------------------------------*/

HundredFieldLibrary.HundredField = function (rows, columns, start) {
    "use strict";
    
    // check the input arguments
    if (typeof rows !== "number") {
        throw "the given row '" + rows + "' is not a number!";
    }
    if (typeof columns !== "number") {
        throw "the given column '" + columns + "' is not a number!";
    }
    if (typeof start !== "number") {
        throw "the given solution '" + start + "' is not a number!";
    }
    
    var r, c, row, cellRow, table, cell, tableCell, inputCell;
    
    this.nbOfRows = rows;
    this.nbOfColumns = columns;
    this.start = start;
    this.cells = [];
    this.hidden = false;
    
    table = document.getElementById("hundredfield-table");
    
    /* generate the inputs */
    for (r = 0; r < this.nbOfRows; r += 1) {
        row = table.insertRow();
        cellRow = [];
        
        for (c = 0; c < this.nbOfColumns; c += 1) {
            tableCell = row.insertCell();
            tableCell.className = "hundredfield-cell";
            
            inputCell = document.createElement("input");
            inputCell.className = "hundredfield-input";
            inputCell.type = "tel";
            inputCell.readOnly = true;
                                    
            tableCell.appendChild(inputCell);
            
            cell = new HundredFieldLibrary.Cell(r, c, tableCell, inputCell, start);
            cellRow.push(cell);
            start += 1;
        }
        
        this.cells.push(cellRow);
    }
    
    this.resize();
    
    window.addEventListener('resize', function (e) {
        this.resize();
    }.bind(this), true);
};

/*
 * HundredFieldLibrary.HundredField.prototype.get()
 * 
 * Returns the cell at the given row and column.
 *
 * @param row       the row where to find the cell
 * @param column    the column where to find the cell.
 */
HundredFieldLibrary.HundredField.prototype.get = function (row, column) {
    "use strict";
    if (typeof row !== "number") {
        throw "the given row '" + row + "' is not a number!";
    } else if (row < 0) {
        throw "the given row " + row + " cannot be smaller than zero!";
    } else if (row >= this.nbOfRows) {
        throw "the given row " + row + " cannot be larger than or equal to the number of rows in this table " + this.nbOfColumns;
    } else if (typeof column !== "number") {
        throw "the given column '" + column + "' is not a number!";
    } else if (column < 0) {
        throw "the given column " + column + " cannot be smaller than zero!";
    } else if (column >= this.nbOfColumns) {
        throw "the given column " + column + " cannot be larger than or equal to the number of rows in this table " + this.nbOfRows;
    }
    return this.cells[row][column];
};

/*
 * HundredFieldLibrary.HundredField.prototype.addClickListener()
 *
 * Adds the given click handler to this hundredfield, whech will be called
 * whenever a cell is clicked in the hundredfield.
 *
 * @param handler   the click handler.
 */
HundredFieldLibrary.HundredField.prototype.addClickListener = function (handler) {
    "use strict";
    
    var r, c;
    
    for (r = 0; r < this.nbOfRows; r += 1) {
        for (c = 0; c < this.nbOfColumns; c += 1) {
            this.get(r, c).addClickListener(handler);
        }
    }
};

/*
 * HundredFieldLibrary.HundredField.prototype.addClickListener()
 *
 * Adds the given click handler to this hundredfield, whech will be called
 * whenever a cell is clicked in the hundredfield.
 *
 * @param handler   the click handler.
 */
HundredFieldLibrary.HundredField.prototype.addInputListener = function (handler) {
    "use strict";
    
    var r, c;
    
    for (r = 0; r < this.nbOfRows; r += 1) {
        for (c = 0; c < this.nbOfColumns; c += 1) {
            this.get(r, c).addInputListener(handler);
        }
    }
};

/*-----------------------------------------------------------------------------
 * HundredFieldLibrary.resize()
 *
 * Listens for resize events and sets the sizes of all the objects
 * accordingly.
 *---------------------------------------------------------------------------*/

HundredFieldLibrary.HundredField.prototype.resize = function () {
    "use strict";
    
    var border, wrapper, table, canvas, size;
    
    border = document.getElementById("hundredfield-border");
    wrapper = document.getElementById("hundredfield-wrapper");
    table = document.getElementById("hundredfield-table");
    canvas = document.getElementById("hundredfield-canvas");
    
    size = Math.floor(Math.min(border.clientWidth, border.clientHeight) * 0.096) * 10;
    
    wrapper.style.width = size + "px";
    wrapper.style.height = size + "px";
    table.style.width = size + "px";
    table.style.height = size + "px";
    canvas.width = size;
    canvas.height = size;
    
    this.redraw();
};

HundredFieldLibrary.HundredField.prototype.isHidden = function () {
    "use strict";
    return this.hidden;
};

HundredFieldLibrary.HundredField.prototype.setHidden = function (value) {
    "use strict";
    
    this.hidden = value;
    
    var r, c, cell;
    for (r = 0; r < this.nbOfRows; r += 1) {
        for (c = 0; c < this.nbOfColumns; c += 1) {
            cell = this.get(r, c).setHidden(this.hidden);
        }
    }
    

    this.redraw();
};

HundredFieldLibrary.HundredField.prototype.getSelectedCells = function () {
    "use strict";
    
    var row, column, result;
    
    result = [];
    
    for (row = 0; row < this.nbOfRows; row += 1) {
        for (column = 0; column < this.nbOfColumns; column += 1) {
            if (this.get(row, column).selected) {
                result.push(this.get(row, column));
            }
        }
    }
    
    return result;
};

HundredFieldLibrary.HundredField.prototype.nbOfSelectedCells = function () {
    "use strict";
    
    var row, column, result;
    
    result = 0;
    
    for (row = 0; row < this.nbOfRows; row += 1) {
        for (column = 0; column < this.nbOfColumns; column += 1) {
            if (this.get(row, column).selected) {
                result += 1;
            }
        }
    }
    
    return result;
};

HundredFieldLibrary.HundredField.prototype.areSelectedFilled = function () {
    "use strict";
    
    // check if all cells have input
    var i, input, selectedCells;
    
    selectedCells = this.getSelectedCells();
    
    for (i = 0; i < selectedCells.length; i += 1) {
        input = selectedCells[i].getInput();
        
        if (!(input.value && input.value !== "")) {
            return false;
        }
    }
    
    return true;
};

/*-----------------------------------------------------------------------------
 * Redraw the grid of lines
 *---------------------------------------------------------------------------*/

HundredFieldLibrary.HundredField.prototype.redraw = function () {
    "use strict";
    
    var i, j, x, y, canvas, table, margin, offset, ctx, width, height, brushRadius;
    
    // retrieve the necessary elements
    canvas = document.getElementById("hundredfield-canvas");
    table = document.getElementById("hundredfield-table");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    brushRadius = canvas.width * 0.004;
    offset = 0;
    
    if (!this.hidden) {
        width = (canvas.width - 2 * brushRadius * offset) / this.nbOfColumns;
        height = (canvas.height - 2 * brushRadius * offset) / this.nbOfRows;

        for (i = 0; i <= this.nbOfColumns; i += 1) {
            for (j = 0; j < this.nbOfRows; j += 1) {
                x = i * width + brushRadius * offset;
                y = j * height + brushRadius * offset;
                
                // draw a vertical line
                HundredFieldLibrary.chalkDraw(x, y, x, y + height, ctx, 2 * (i * this.nbOfColumns + j), brushRadius);
            }
        }
        
        for (i = 0; i <= this.nbOfRows; i += 1) {
            for (j = 0; j < this.nbOfColumns; j += 1) {
                x = j * width + brushRadius * offset;
                y = i * height + brushRadius * offset;
                
                // draw a horizontal line
                HundredFieldLibrary.chalkDraw(x, y, x + width, y, ctx, 2 * (i * this.nbOfColumns + j) + 1, brushRadius);
            }
        }
    } else {
        width = (canvas.width - 2 * brushRadius * offset) / this.nbOfColumns;
        height = (canvas.height - 2 * brushRadius * offset) / this.nbOfRows;
        
        for (i = 0; i <= this.nbOfColumns; i += 1) {
            for (j = 0; j < this.nbOfRows; j += 1) {
                x = i * width + brushRadius * offset;
                y = j * height + brushRadius * offset;
                
                // draw a vertical line
                if (i === 0 && this.nbOfColumns > 0 && this.get(j, i).needsBorder()) {
                    HundredFieldLibrary.chalkDraw(x, y, x, y + height, ctx, 4 * i + 2 * j, brushRadius);
                } else if (i > 0 && i < this.nbOfColumns && (this.get(j, i).needsBorder() || this.get(j, i - 1).needsBorder())) {
                    HundredFieldLibrary.chalkDraw(x, y, x, y + height, ctx, 4 * i + 2 * j + 1, brushRadius);
                } else if (i === this.nbOfColumns && (this.get(j, i - 1).needsBorder())) {
                    HundredFieldLibrary.chalkDraw(x, y, x, y + height, ctx, 4 * i + 2 * j + 1, brushRadius);
                }
            }
        }
        
        for (i = 0; i <= this.nbOfRows; i += 1) {
            for (j = 0; j < this.nbOfColumns; j += 1) {
                x = j * width + brushRadius * offset;
                y = i * height + brushRadius * offset;
                
                // draw a vertical line
                if (i === 0 && this.nbOfColumns > 0 && this.get(i, j).needsBorder()) {
                    HundredFieldLibrary.chalkDraw(x, y, x + width, y, ctx, 4 * i, brushRadius);
                } else if (i > 0 && i < this.nbOfColumns && (this.get(i, j).needsBorder() || this.get(i - 1, j).needsBorder())) {
                    HundredFieldLibrary.chalkDraw(x, y, x + width, y, ctx, 4 * i, brushRadius);
                } else if (i === this.nbOfColumns && (this.get(i - 1, j).needsBorder())) {
                    HundredFieldLibrary.chalkDraw(x, y, x + width, y, ctx, 4 * i, brushRadius);
                }
            }
        }
    }
};

/*
 * HundredFieldLibrary.chalkDraw(x1, y1, x2, y2, ctx, random, brushRadius)
 *
 * Draws a chalky line from the given starting point (x1, y1) to the given
 * ending point (x2, y2) on the given context. To generate the line, a random seed
 * has to be given, along with the radius of the brush.
 *
 * @param x1            the x coordinate of the starting point
 * @param y1            the y coordinate of the starting point
 * @param x2            the x coordinate of the ending point
 * @param y2            the y coordinate of the ending point
 * @param ctx           the context to draw upon
 * @param seed          the seed to use for the random number generation
 * @param brushRadius   the radius of the line to draw
 */
HundredFieldLibrary.chalkDraw = function (x1, y1, x2, y2, ctx, seed, brushRadius) {
    "use strict";
    
    var i, alpha, length, invLength, xDiff, yDiff, xUnit, yUnit, xCurrent, yCurrent, xRandom, yRandom, random;
        
    ctx.lineWidth = (brushRadius * 2);
	ctx.lineCap = 'round';
          
    xDiff = Math.pow(x2 - x1, 2);
    yDiff = Math.pow(y2 - y1, 2);
    
    length = Math.round(Math.sqrt(xDiff + yDiff)) * 0.5;
    invLength = 1.0 / length;
    xUnit = (x2 - x1) * invLength;
    yUnit = (y2 - y1) * invLength;
    
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2,  y2);
    ctx.stroke();
    
    xCurrent = x1;
    yCurrent = y1;
    random = new Random.Random(seed);
    
    for (i = 0; i < length; i += 1) {
        xRandom = xCurrent + (random.next() - 0.5) * brushRadius;
        yRandom = yCurrent + (random.next() - 0.5) * brushRadius;
        xCurrent += xUnit;
        yCurrent += yUnit;
        ctx.clearRect(xRandom, yRandom, random.next() * 2 + 1, random.next() + 1);
    }
    
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2,  y2);
    ctx.stroke();
};

/*-----------------------------------------------------------------------------
 * HundredFieldLibrary.getNeighbours = function (cell, hundredField)
 *
 * Returns all the neighbours of the given cell in the given hundredfield.
 *
 * @param cell          the cell to search the neighbours of.
 * @param hundredField  the hundredfield to retrieve the neighbours of the cell
 *                      from.
 * @return all the neighbours of the given cell in the given hundredfield.
 *---------------------------------------------------------------------------*/

HundredFieldLibrary.getNeighbours = function (cell, hundredField) {
    "use strict";
    
    var i, j, row, column, cells;
    
    cells = [];
    
    for (i = -1; i <= 1; i += 1) {
        for (j = -1; j <= 1; j += 1) {
            row = cell.row + i;
            column = cell.column + j;
    
            if (!(i === 0 && j === 0) && row >= 0 && column >= 0 && row < hundredField.nbOfRows && column < hundredField.nbOfColumns) {
                cells.push(hundredField.get(row, column));
            }
        }
    }
    
    return cells;
};

/*-----------------------------------------------------------------------------
 * HundredFieldLibrary.countNeighbours = function (cell, cells)
 *
 * Returns the number of cells from the 'cells' array that are neighbours of
 * the given cell.
 *
 * @param cell  the cell to find the number of neighbours from
 * @param cells the array containing the cells which have to be tested whether
 *              they are a neighbour of the given cell.
 *---------------------------------------------------------------------------*/

HundredFieldLibrary.countNeighbours = function (cell, cells) {
    "use strict";
    
    var i, xDiff, yDiff, distance, neighbours;
    
    neighbours = 0;
    
    for (i = 0; i < cells.length; i += 1) {
        xDiff = Math.abs(cell.row - cells[i].row);
        yDiff = Math.abs(cell.column - cells[i].column);
        
        if (xDiff <= 1 && yDiff <= 1) {
            neighbours += 1;
        }
    }
    return neighbours;
};

/*-----------------------------------------------------------------------------
 * HundredFieldLibrary.possibleElements = function (cells hundredField)
 *
 * Returns all the cells which only have one neighbour are a neighbour of one
 * of the cells in the given 'cells' array.
 * 
 * @param cells         the cells to find the neigbours of.
 * @param hundredField  the hundredfield to search the elemens in.
 *
 * @return all the cells which only have one neighbour are a neighbour of one
 * of the cells in the given 'cells' array.
 *---------------------------------------------------------------------------*/
HundredFieldLibrary.possibleElements = function (cells, hundredField) {
    "use strict";
    
    var i, j, k, canAdd, candidates, neighbours, result;
    
    // get all the neighbours
    candidates = [];
    for (i = 0; i < cells.length; i += 1) {
        neighbours = HundredFieldLibrary.getNeighbours(cells[i], hundredField);
        
        // add the neighbours to the candidates if they are not yet present in the candite list
        // and when they are not one of the given cells.
        for (j = 0; j < neighbours.length; j += 1) {
            canAdd = true;
            
            for (k = 0; k < cells.length; k += 1) {
                if (cells[k].row === neighbours[j].row && cells[k].column === neighbours[j].column) {
                    canAdd = false;
                    break;
                }
            }
            
            if (canAdd) {
                for (k = 0; k < candidates.length; k += 1) {
                    if (candidates[k].row === neighbours[j].row && candidates[k].column === neighbours[j].column) {
                        canAdd = false;
                        break;
                    }
                }
            }
            if (canAdd) {
                candidates.push(neighbours[j]);
            }
        }
    }
    
    result = [];
    
    for (i = 0; i < candidates.length; i += 1) {
        if (HundredFieldLibrary.countNeighbours(candidates[i], cells) <= 1) {
            result.push(candidates[i]);
        }
    }
    
    return result;
};