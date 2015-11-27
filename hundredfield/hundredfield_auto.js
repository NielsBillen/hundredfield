/*-----------------------------------------------------------------------------
 * Javascript for controlling the hundredfield, where the cells to be filled
 * are decided by a computer algorithm.
 *---------------------------------------------------------------------------*/

/*global console, Random, HundredFieldLibrary */

var HundredFieldAuto = HundredFieldAuto || {};

HundredFieldAuto.HundredFieldAuto = function (row, column, start) {
    "use strict";
    
    var i, r, c, random, cell, neighbours;

    // initialize the hundredfield
    this.hundredField = new HundredFieldLibrary.HundredField(row, column, start);
    
    // choose the cells
    r = this.hundredField.nbOfRows;
    c = this.hundredField.nbOfColumns;
    random = new Random.Random(new Date().getTime());
        
    this.cells = [];
    this.startCell = this.hundredField.get(random.nextInt(r), random.nextInt(c));
    this.cells.push(this.startCell);
    
    this.startCell.setStart(true);

    for (i = 0; i < 10; i += 1) {
    /*while (true) {*/
        neighbours = HundredFieldAuto.possibleElements(this.cells, this.hundredField);
        
        if (neighbours.length > 0) {
            cell = neighbours[random.nextInt(neighbours.length)];
            this.cells.push(cell);
            cell.setSelected(true);
        } else {
            break;
        }
    }
};

/*-----------------------------------------------------------------------------
 * Initializes the automatic HundredField
 *---------------------------------------------------------------------------*/

HundredFieldAuto.Init = function () {
    "use strict";
    
    var offset, localOffset, hundredFieldAuto;
    
    localOffset = localStorage.getItem("settings.hundredfield.offset");
    
    if (localOffset) {
        offset = parseInt(localOffset, 10);
    } else {
        offset = 1;
    }
    
    hundredFieldAuto = new HundredFieldAuto.HundredFieldAuto(10, 10, offset);
};

HundredFieldAuto.Init();