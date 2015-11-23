/*-----------------------------------------------------------------------------
 * Javascript containing the core elemens of the Hundredfield
 *---------------------------------------------------------------------------*/

/*global console */

/* define the HundredFieldCore namespace */
var HundredFieldCore = HundredFieldCore || {};

/*-----------------------------------------------------------------------------
 *
 * HundredFieldCore.Random: utility class for fast generation of
 *                      pseudo-random numbers.
 *
 *---------------------------------------------------------------------------*/

/*
 * HundredFieldCore.Random: creates a new random number generator.
 * 
 * @param seed  the seed to initialize the random number generator with.
 */
HundredFieldCore.Random = function (seed) {
    "use strict";
    this.seed = Math.abs(seed);     // seed for rng
};

/*
 * HundredField.Random.random(): 
 * 
 * generates a new pseudo-random number between 0 and 1.
 *
 * @return a new pseudo-random number between 0 and 1.
 */
HundredFieldCore.Random.prototype.random = function () {
    "use strict";
        
    this.seed = (1103515245 * this.seed + 12345) % 2147483647;
    return this.seed * 4.656612875245796924105750827168e-10;
};

/*-----------------------------------------------------------------------------
 *
 * HundredFieldCore.Cell: represents a cell in the hundredfield.
 *
 *---------------------------------------------------------------------------*/

/*
 * HundredFieldCore.Cell: creates a new cell for the hundredfield.
 *
 * @param container     the cell in the table.
 * @param input         the input element for filling the cell.
 * @param solution      the solution (i.e. the corrent) value of this cell.
 */
HundredFieldCore.Cell = function (row, column, container, input, solution) {
    "use strict";
    this.row = row;                 // the row where this cell appears
    this.column = column;           // the column where this cell appears
    this.container = container;     // the table cell
    this.input = input;             // the input contained in the table cell
    this.solution = solution;       // the solution of this cell
    this.selected = false;          // whether this cell is selected
    this.isstart = false;           // whether this cell is the start cell
};

/*
 * HundredFieldCore.Cell.prototype.setStart(value):
 *
 * Enables/disables this cell as a start cell depending on the
 * given value.
 *
 * @param value     whether this cell is a start cell.
 */
HundredFieldCore.Cell.prototype.setStart = function (value) {
    "use strict";

    this.isstart = value;

    if (value === true) {
        this.input.value = this.getSolution();
        this.input.classList.add("hundredfield-input-start");
    } else {
        this.input.value = "";
        this.input.classList.remove("hundredfield-input-start");
    }
};

/*
 * Returns true when this cell needs a border when it is drawn.
 *
 * @return true when this cell needs a border when it is drawn.
 */
HundredFieldCore.Cell.prototype.needsBorder = function () {
    "use strict";
    return this.isstart || this.selected;
};

/*
 * HundredFieldCore.addClickListener(element, handler): 
 */
HundredFieldCore.addClickListener = function (element, handler) {
    "use strict";
    
    if (typeof document.body.ontouchend === "undefined") {
        element.addEventListener("touchend", handler);
    } else {
        element.addEventListener("click", handler);
    }
};

/*
 * HundredFieldCore.Cell.prototype.addClickListener(handler): 
 *
 * adds the given handler as a click listener to this cell. When the cell
 * is clicked / touched (on mobile devices), the handler function will be
 * called with the click (touch) event as its first parameter and the clicked
 * cell object as the second parameter.
 *
 * @param handler   the click handler which is called on a click event.
 */
HundredFieldCore.Cell.prototype.addClickListener = function (handler) {
    "use strict";
    
    HundredFieldCore.addClickListener(function (e) {
        handler(e, this);
    }.bind(this));
};

/*
 * HundredFieldCore.Cell.prototype.addInputListener(handler): 
 *
 * adds the given handler as an input listener to this cell. When the value of
 * this cell is changed, the handler function will be called with the change 
 * event as its first parameter and the clicked cell object as the second 
 * parameter.
 *
 * @param handler   the input handler which is called on an input change 
 *                  event.
 */
HundredFieldCore.Cell.prototype.addInputListener = function (handler) {
    "use strict";
    
    var self = this;
    
    this.getInput().addEventListener("change", function (e) {
        handler(e, self);
    });
    this.getInput().addEventListener("keyup", function (e) {
        handler(e, self);
    });
};

/*
 * HundredFieldCore.Cell.prototype.getSolution():
 *
 * Returns the solution of this cell as an integer.
 */
HundredFieldCore.Cell.prototype.getSolution = function () {
    "use strict";
    return this.solution;
};

/*
 * HundredFieldCore.Cell.prototype.getInputValue():
 *
 * Returns the input entered in this cell as an integer value.
 */
HundredFieldCore.Cell.prototype.getInputValue = function () {
    "use strict";
    return parseInt(this.input.value.replace(/^\s+|\s+$/gm, '').trim(), 10);
};

/*
 * HundredFieldCore.Cell.prototype.getInput():
 *
 * Returns the <input> element of this cell.
 *
 * @return the <input> element of this cell.
 */
HundredFieldCore.Cell.prototype.getInput = function () {
    "use strict";
    return this.input;
};

/*
 * HundredFieldCore.cell.prototype.setSelected()
 *
 * Selects this cell if the given value is true, or deselects it otherwise.
 *
 * @param   value   whether this cell is selected (true) or not (false).
 */
HundredFieldCore.Cell.prototype.setSelected = function (value) {
    "use strict";
    
    this.selected = value;
    
    if (value === true) {
        this.container.classList.add("hundredfield-cell-selected");
    } else {
        this.container.classList.remove("hundredfield-cell-selected");
    }
};

/*
 * HundredFieldCore.cell.prototype.setHidden()
 *
 * Hides this cell when the given value is (true) or makes it visible
 * when the given value is (false). Note that start cells cannot be
 * hidden!
 *
 * @param value     whether this cell should be hidden (true) or not (false).
 */
HundredFieldCore.Cell.prototype.setHidden = function (value) {
    "use strict";

    if (this.isstart) {
        return;
    }
    
    if (value) {
        if (this.selected) {
            this.container.classList.add("hundredfield-cell-hidden-selected");
        } else {
            this.container.classList.add("hundredfield-cell-hidden");
        }
    } else {
        this.container.classList.remove("hundredfield-cell-hidden-selected");
        this.container.classList.remove("hundredfield-cell-hidden");
    }
};

/*-----------------------------------------------------------------------------
 * HundredFieldCore.init(rows, columns, start)
 *
 * Initializes a new hundredfield with the given number of rows, the given
 * number of columns and where the first cell starts at the given input
 * number.
 *---------------------------------------------------------------------------*/

HundredFieldCore.HundredField = function (rows, columns, start) {
    "use strict";
    
    var r, c, row, cellRow, table, cell, tableCell, inputCell, self;
    
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
            
            cell = new HundredFieldCore.Cell(r, c, tableCell, inputCell, start);
            cellRow.push(cell);
            start += 1;
        }
        
        this.cells.push(cellRow);
    }
    
    this.resize();
    self = this;
    window.addEventListener('resize', function (e) {
        self.resize();
    }, true);
};

/*
 * HundredFieldCore.HundredField.prototype.get()
 * 
 * Returns the cell at the given row and column.
 *
 * @param row       the row where to find the cell
 * @param column    the column where to find the cell.
 */
HundredFieldCore.HundredField.prototype.get = function (row, column) {
    "use strict";
    return this.cells[row][column];
};

/*
 * HundredFieldCore.HundredField.prototype.addClickListener()
 *
 * Adds the given click handler to this hundredfield, whech will be called
 * whenever a cell is clicked in the hundredfield.
 *
 * @param handler   the click handler.
 */
HundredFieldCore.HundredField.prototype.addClickListener = function (handler) {
    "use strict";
    
    var r, c;
    
    for (r = 0; r < this.nbOfRows; r += 1) {
        for (c = 0; c < this.nbOfColumns; c += 1) {
            this.get(r, c).addClickListener(handler);
        }
    }
};

/*
 * HundredFieldCore.HundredField.prototype.addClickListener()
 *
 * Adds the given click handler to this hundredfield, whech will be called
 * whenever a cell is clicked in the hundredfield.
 *
 * @param handler   the click handler.
 */
HundredFieldCore.HundredField.prototype.addInputListener = function (handler) {
    "use strict";
    
    var r, c;
    
    for (r = 0; r < this.nbOfRows; r += 1) {
        for (c = 0; c < this.nbOfColumns; c += 1) {
            this.get(r, c).addInputListener(handler);
        }
    }
};

/*-----------------------------------------------------------------------------
 * HundredFieldCore.resize()
 *
 * Listens for resize events and sets the sizes of all the objects
 * accordingly.
 *---------------------------------------------------------------------------*/

HundredFieldCore.HundredField.prototype.resize = function () {
    "use strict";
    
    var border, wrapper, table, canvas, size;
    
    border = document.getElementById("hundredfield-border");
    wrapper = document.getElementById("hundredfield-wrapper");
    table = document.getElementById("hundredfield-table");
    canvas = document.getElementById("hundredfield-canvas");
    
    size = Math.floor(Math.min(border.clientWidth, border.clientHeight) * 0.095) * 10;
    
    wrapper.style.width = size + "px";
    wrapper.style.height = size + "px";
    table.style.width = size + "px";
    table.style.height = size + "px";
    canvas.width = size;
    canvas.height = size;
    
    this.redraw();
};

HundredFieldCore.HundredField.prototype.isHidden = function () {
    "use strict";
    return this.hidden;
};

HundredFieldCore.HundredField.prototype.setHidden = function (value) {
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

HundredFieldCore.HundredField.prototype.getSelectedCells = function () {
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

HundredFieldCore.HundredField.prototype.nbOfSelectedCells = function () {
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

HundredFieldCore.HundredField.prototype.areSelectedFilled = function () {
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

HundredFieldCore.HundredField.prototype.redraw = function () {
    "use strict";
    
    var i, j, x, y, canvas, table, margin, offset, ctx, width, height, brushRadius;
    
    // retrieve the necessary elements
    canvas = document.getElementById("hundredfield-canvas");
    table = document.getElementById("hundredfield-table");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /*margin = parseFloat((table.currentStyle || window.getComputedStyle(table)).padding);*/
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
                HundredFieldCore.chalkDraw(x, y, x, y + height, ctx, 2 * (i * this.nbOfColumns + j), brushRadius);
            }
        }
        
        for (i = 0; i <= this.nbOfRows; i += 1) {
            for (j = 0; j < this.nbOfColumns; j += 1) {
                x = j * width + brushRadius * offset;
                y = i * height + brushRadius * offset;
                
                // draw a horizontal line
                HundredFieldCore.chalkDraw(x, y, x + width, y, ctx, 2 * (i * this.nbOfColumns + j) + 1, brushRadius);
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
                    HundredFieldCore.chalkDraw(x, y, x, y + height, ctx, 4 * i + 2 * j, brushRadius);
                } else if (i > 0 && i < this.nbOfColumns && (this.get(j, i).needsBorder() || this.get(j, i - 1).needsBorder())) {
                    HundredFieldCore.chalkDraw(x, y, x, y + height, ctx, 4 * i + 2 * j + 1, brushRadius);
                } else if (i === this.nbOfColumns && (this.get(j, i - 1).needsBorder())) {
                    HundredFieldCore.chalkDraw(x, y, x, y + height, ctx, 4 * i + 2 * j + 1, brushRadius);
                }
            }
        }
        
        for (i = 0; i <= this.nbOfRows; i += 1) {
            for (j = 0; j < this.nbOfColumns; j += 1) {
                x = j * width + brushRadius * offset;
                y = i * height + brushRadius * offset;
                
                // draw a vertical line
                if (i === 0 && this.nbOfColumns > 0 && this.get(i, j).needsBorder()) {
                    HundredFieldCore.chalkDraw(x, y, x + width, y, ctx, 4 * i, brushRadius);
                } else if (i > 0 && i < this.nbOfColumns && (this.get(i, j).needsBorder() || this.get(i - 1, j).needsBorder())) {
                    HundredFieldCore.chalkDraw(x, y, x + width, y, ctx, 4 * i, brushRadius);
                } else if (i === this.nbOfColumns && (this.get(i - 1, j).needsBorder())) {
                    HundredFieldCore.chalkDraw(x, y, x + width, y, ctx, 4 * i, brushRadius);
                }
            }
        }
    }
};

/*
 * HundredFieldCore.chalkDraw(x1, y1, x2, y2, ctx, random, brushRadius)
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
HundredFieldCore.chalkDraw = function (x1, y1, x2, y2, ctx, seed, brushRadius) {
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
    random = new HundredFieldCore.Random(seed);
    
    for (i = 0; i < length; i += 1) {
        xRandom = xCurrent + (random.random() - 0.5) * brushRadius;
        yRandom = yCurrent + (random.random() - 0.5) * brushRadius;
        xCurrent += xUnit;
        yCurrent += yUnit;
        ctx.clearRect(xRandom, yRandom, random.random() * 2 + 1, random.random() + 1);
    }
    
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2,  y2);
    ctx.stroke();
};