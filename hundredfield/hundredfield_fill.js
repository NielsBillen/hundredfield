/*-----------------------------------------------------------------------------
 * Javascript for controlling the hundredfield, when first the cells to be 
 * filled have to be selected.
 *---------------------------------------------------------------------------*/

/*global console, Random, HundredFieldLibrary */

var HundredFieldFill = HundredFieldFill || {};

HundredFieldFill.HundredFieldFill = function (row, column, start) {
    "use strict";
    
    var i, r, c, cell, cells, random, startCell, cellSelection, cellSelectionCount, candidates;
    
    this.hundredField = new HundredFieldLibrary.HundredField(row, column, start);
    this.hundredField.addClickListener(this.cellClickListener.bind(this));
    this.hundredField.addInputListener(this.inputChangeListener.bind(this));
    
    this.startButton = document.createElement("button");
    this.hideButton = document.createElement("button");
    this.checkButton = document.createElement("button");
    this.resetButton = document.createElement("button");
    this.scoreButton = document.createElement("button");
    
    this.startButton.className = "hundredfield-button";
    this.startButton.innerHTML = "Start";
    this.hideButton.className = "hundredfield-button";
    this.hideButton.innerHTML = "Verberg veld";
    this.checkButton.className = "hundredfield-button";
    this.checkButton.innerHTML = "Controleer oplossing";
    this.resetButton.className = "hundredfield-button";
    this.resetButton.innerHTML = "Herstarten";
    this.scoreButton.className = "hundredfield-button";
    this.scoreButton.style.cursor = "default";
    
    HundredFieldLibrary.addClickListener(this.hideButton, this.toggleHidden.bind(this));
    HundredFieldLibrary.addClickListener(this.startButton, this.start.bind(this));
    HundredFieldLibrary.addClickListener(this.checkButton, this.check.bind(this));
    HundredFieldLibrary.addClickListener(this.resetButton, function () {
        window.location.reload();
    });
    
    // set the starting state
    this.state = "select-start-cell";
};

HundredFieldFill.HundredFieldFill.prototype.toggleHidden = function () {
    "use strict";
    
    this.hundredField.setHidden(!this.hundredField.hidden);
};

HundredFieldFill.HundredFieldFill.prototype.cellClickListener = function (event, cell) {
    "use strict";
    
    var buttonContainer, cellSelection, cellSelectionCount, random, r, c, i, cells, candidates;
    
    if (this.state === "select-start-cell") {
        cell.setStart(true);
        
        this.state = "select-fill-cells";
        
        // determine the cell selection mechanism
        cellSelection = localStorage.getItem("settings.hundredfield.cellselection");
        
        // choose other cells automatically
        if (cellSelection === "automatic") {
            // choose a random starting cell
            random = new Random.Random(new Date().getTime());
            r = random.nextInt(this.hundredField.nbOfRows);
            c = random.nextInt(this.hundredField.nbOfColumns);
            cells = [cell];

            // get the number of cells to select
            cellSelectionCount = parseInt(localStorage.getItem("settings.hundredfield.cellselectionamount"), 10);
            if (!cellSelectionCount || cellSelection === null || typeof cellSelectionCount !== "number") {
                cellSelectionCount = 6;
            }

            // select the following cells
            for (i = 0; i < cellSelectionCount; i += 1) {
                candidates = HundredFieldLibrary.possibleElements(cells, this.hundredField);

                if (candidates.length > 0) {
                    cell = candidates[random.nextInt(candidates.length)];
                    cell.setSelected(true);
                    cells.push(cell);
                } else {
                    break;
                }
            }
        }
    } else if (this.state === "select-fill-cells" && !this.hundredField.isHidden()) {
        if (!cell.input.classList.contains("hundredfield-input-start")) {
            cell.setSelected(!cell.selected);
        }
        
        buttonContainer = document.getElementById("hundredfield-control-container");

        while (buttonContainer.firstChild) {
            buttonContainer.removeChild(buttonContainer.firstChild);
        }
        if (this.hundredField.nbOfSelectedCells() > 0) {
            buttonContainer.appendChild(this.startButton);
            buttonContainer.appendChild(this.hideButton);
        }
    }
};

HundredFieldFill.HundredFieldFill.prototype.inputChangeListener = function (event, cell) {
    "use strict";
    
    if (this.state !== "fill-cells") {
        return;
    }
        
    var selectedCells, buttonContainer;
    
    buttonContainer = document.getElementById("hundredfield-control-container");
    
    while (buttonContainer.firstChild) {
        buttonContainer.removeChild(buttonContainer.firstChild);
    }
    if (this.hundredField.areSelectedFilled()) {
        buttonContainer.appendChild(this.checkButton);
    }
};

HundredFieldFill.HundredFieldFill.prototype.start = function () {
    "use strict";
        
    if (this.state !== "select-fill-cells" || this.hundredField.nbOfSelectedCells() === 0) {
        return;
    }
    
    this.state = "fill-cells";
    
    // make all inputs editable
    var i, input, selectedCells, buttonContainer;
    
    // sort cells according to their solutions.
    selectedCells = this.hundredField.getSelectedCells();
    selectedCells.sort(function (a, b) {
        if (a.solution < b.solution) {
            return -1;
        } else if (a.solution > b.solution) {
            return 1;
        } else {
            return 0;
        }
    });

    // make the cells editable
    for (i = 0; i < selectedCells.length; i += 1) {
        input = selectedCells[i].getInput();
        input.readOnly = false;
        input.tabIndex = (i + 1);
        input.style.display = "table-cell";
    }
    
    // focus on the first cell
    selectedCells[0].getInput().focus();
    
    // hide the buttons
    buttonContainer = document.getElementById("hundredfield-control-container");
    while (buttonContainer.firstChild) {
        buttonContainer.removeChild(buttonContainer.firstChild);
    }
};

HundredFieldFill.HundredFieldFill.prototype.check = function () {
    "use strict";

    var i, cell, input, selectedCells, correct, wrong, buttonContainer;
    
    wrong = 0;
    correct = 0;
    selectedCells = this.hundredField.getSelectedCells();
    
    for (i = 0; i < selectedCells.length; i += 1) {
        cell = selectedCells[i];
        input = cell.getInput();
        
        input.readOnly = true;
        
        if (cell.getInputValue() === cell.solution) {
            correct += 1;
            cell.container.classList.add("hundredfield-cell-correct");
        } else {
            wrong += 1;
            cell.container.classList.add("hundredfield-cell-wrong");
        }
    }
    
    // show the score and the reset button
    buttonContainer = document.getElementById("hundredfield-control-container");
    while (buttonContainer.firstChild) {
        buttonContainer.removeChild(buttonContainer.firstChild);
    }
    
    window.setTimeout(function () {
        var buttonContainer = document.getElementById("hundredfield-control-container");
        buttonContainer.appendChild(this.scoreButton);
        buttonContainer.appendChild(this.resetButton);
    }.bind(this), 200);
    
    if (wrong === 0) {
        this.scoreButton.innerHTML = "Score: Alles juist";
    } else if (correct === 0 && wrong > 0) {
        this.scoreButton.innerHTML = "Score: Alles fout";
    } else {
        this.scoreButton.innerHTML = "Score: " + correct + "/" + (correct + wrong);
    }
};

HundredFieldFill.Init = function () {
    "use strict";
    
    var offset, localOffset, hundredFieldFill;
    
    localOffset = localStorage.getItem("settings.hundredfield.offset");
    
    if (localOffset) {
        offset = parseInt(localOffset, 10);
    } else {
        offset = 1;
    }
    hundredFieldFill = new HundredFieldFill.HundredFieldFill(10, 10, offset);
    
};

HundredFieldFill.Init();