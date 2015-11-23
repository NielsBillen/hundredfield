/*-----------------------------------------------------------------------------
 * Javascript for controlling a hundred field
 *---------------------------------------------------------------------------*/

/*global console, HundredFieldCore */

var HundredFieldFill = HundredFieldFill || {};

HundredFieldFill.HundredFieldFill = function (row, column, start) {
    "use strict";
    
    this.hundredField = new HundredFieldCore.HundredField(row, column, start);
    this.state = "select-start-cell";
    
    var self = this;
    this.hundredField.addClickListener(function (event, cell) {
        self.cellClickListener(event, cell);
    });
    this.hundredField.addInputListener(function (event, cell) {
        self.inputChangeListener(event, cell);
    });
    
    
    document.getElementById("hundredfield-button-hide").addEventListener("click", function () {
        self.hundredField.setHidden(!self.hundredField.hidden);
    }, true);
    
    document.getElementById("hundredfield-button-start").addEventListener("click", function () {
        self.start();
    }, true);
    
    document.getElementById("hundredfield-button-check").addEventListener("click", function () {
        self.check();
    }, true);
    
    document.getElementById("hundredfield-button-reset").addEventListener("click", function () {
        window.location.reload();
    }, true);
    
    this.hundredField.resize();
};

HundredFieldFill.HundredFieldFill.prototype.cellClickListener = function (event, cell) {
    "use strict";
    
    if (this.state === "select-start-cell") {
        cell.setStart(true);
        this.state = "select-fill-cells";
    } else if (this.state === "select-fill-cells" && !this.hundredField.isHidden()) {
        if (!cell.container.classList.contains("hundredfield-input-start")) {
            cell.setSelected(!cell.selected);
        }
        
        var startButon, hideButton;
        startButon = document.getElementById("hundredfield-button-start");
        hideButton = document.getElementById("hundredfield-button-hide");
        
        if (this.hundredField.nbOfSelectedCells() > 0) {
            startButon.style.display = "flex";
            hideButton.style.display = "flex";
            this.hundredField.resize();
        } else {
            startButon.style.display = "none";
            hideButton.style.display = "none";
            this.hundredField.resize();
        }
    }
};

HundredFieldFill.HundredFieldFill.prototype.inputChangeListener = function (event, cell) {
    "use strict";
    
    if (this.state !== "fill-cells") {
        return;
    }
        
    var selectedCells, check;
    
    check = document.getElementById("hundredfield-button-check");
    
    if (this.hundredField.areSelectedFilled()) {
        // show check button
        if (!check.style.display || check.style.display === "" || check.style.display === "none") {
            check.style.display = "flex";
            this.hundredField.resize();
        }
    } else {
        // hide check button
        if (!check.style.display || check.style.display === "" || check.style.display === "flex") {
            check.style.display = "none";
            this.hundredField.resize();
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
    var i, input, selectedCells, startButton, hideButton;
    
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
        input.style.display = "flex";
    }
    
    // focus on the first cell
    selectedCells[0].getInput().focus();
    
    // hide the buttons
    document.getElementById("hundredfield-button-start").style.display = "none";
    document.getElementById("hundredfield-button-hide").style.display = "none";
    this.hundredField.resize();
};

HundredFieldFill.HundredFieldFill.prototype.check = function () {
    "use strict";

    var i, cell, input, selectedCells, correct, wrong, checkButton, resetButton, scoreButton;
    
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
    document.getElementById("hundredfield-button-check").style.display = "none";
    document.getElementById("hundredfield-button-reset").style.display = "flex";
    
    scoreButton = document.getElementById("hundredfield-button-score");
    scoreButton.style.display = "flex";
    
    if (wrong === 0) {
        scoreButton.innerHTML = "Score: Alles juist";
    } else if (correct === 0 && wrong > 0) {
        scoreButton.innerHTML = "Score: Alles fout";
    } else {
        scoreButton.innerHTML = "Score: " + correct + "/" + (correct + wrong);
    }
};


var hundredFieldFill = new HundredFieldFill.HundredFieldFill(10, 10, 1);