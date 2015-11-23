/*-----------------------------------------------------------------------------
 * Javascript for controlling a hundred field
 *---------------------------------------------------------------------------*/

/*global console, HundredFieldCore */

var HundredFieldFill = HundredFieldFill || {};

HundredFieldFill.HundredFieldFill = function (row, column, start) {
    "use strict";
    
    this.hundredField = new HundredFieldCore.HundredField(row, column, start);
    this.state = "select-start-cell";
    
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
    
    HundredFieldCore.addClickListener(this.hideButton, this.toggleHidden.bind(this));
    HundredFieldCore.addClickListener(this.startButton, this.start.bind(this));
    HundredFieldCore.addClickListener(this.checkButton, this.checkButton.bind(this));
    HundredFieldCore.addClickListener(this.resetButton, function () {
        window.location.reload();
    });

    this.hundredField.resize();
};

HundredFieldFill.HundredFieldFill.prototype.toggleHidden = function () {
    "use strict";
    
    this.hundredField.setHidden(!this.hundredField.hidden);
};

HundredFieldFill.HundredFieldFill.prototype.cellClickListener = function (event, cell) {
    "use strict";
    
    if (this.state === "select-start-cell") {
        cell.setStart(true);
        this.state = "select-fill-cells";
    } else if (this.state === "select-fill-cells" && !this.hundredField.isHidden()) {
        if (!cell.input.classList.contains("hundredfield-input-start")) {
            cell.setSelected(!cell.selected);
            
            var buttonContainer = document.getElementById("hundredfield-button-container");

            if (this.hundredField.nbOfSelectedCells() > 0) {
                buttonContainer.appendChild(this.startButton);
                buttonContainer.appendChild(this.hideButton);
            } else {
                buttonContainer.removeChild(this.startButton);
                buttonContainer.removeChild(this.hideButton);
            }
        }
    }
};

HundredFieldFill.HundredFieldFill.prototype.inputChangeListener = function (event, cell) {
    "use strict";
    
    if (this.state !== "fill-cells") {
        return;
    }
        
    var selectedCells, buttonContainer;
    
    buttonContainer = document.getElementById("hundredfield-button-container");
    
    if (this.hundredField.areSelectedFilled()) {
        if (!buttonContainer.contains(this.checkButton)) {
            buttonContainer.appendChild(this.checkButton);
        }
    } else {
        if (buttonContainer.contains(this.checkButton)) {
            buttonContainer.removeChild(this.checkButton);
        }
    }
};

HundredFieldFill.HundredFieldFill.prototype.start = function () {
    "use strict";
        
    if (this.state !== "select-fill-cells") {
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
    buttonContainer = document.getElementById("hundredfield-button-container");
    buttonContainer.removeChild(this.startButton);
    buttonContainer.removeChild(this.hideButton);
    
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
    buttonContainer = document.getElementById("hundredfield-button-container");
    buttonContainer.removeChild(this.checkButton);
    
    window.setTimeout(function () {
        var buttonContainer = document.getElementById("hundredfield-button-container");
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