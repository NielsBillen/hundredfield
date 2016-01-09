
var Random = Random || {};

/*-----------------------------------------------------------------------------
 *
 * HundredFieldCore.Random: utility class for fast generation of
 *                      pseudo-random numbers.
 *
 *---------------------------------------------------------------------------*/

/*
 * Random.Random: creates a new random number generator.
 * 
 * @param seed  the seed to initialize the random number generator with.
 */
Random.Random = function (seed) {
    "use strict";
    
    /*
     * Sets the seed to the given seed.
     */
    this.setSeed = function (seed) {
        console.log(seed);
        seed = Math.abs(seed) % 2147483647;
    };
    
    /*
     * Random.Random.prototype.next(): 
     * 
     * generates a new pseudo-random number between 0 and 1.
     *
     * @return a new pseudo-random number between 0 and 1.
     */
    this.next = function () {
        seed = (1103515245 * seed + 12345) % 2147483647;
        return seed * 4.656612875245796924105750827168e-10;
    };
    
    /*
     * Random.Random..prototype.nextInt():
     *
     * generates a new pseudo-random integer between 0 and n (n not inclusive).
     *
     * @return a new pseudo-random integer between 0 and n (n not inclusive).
     */
    this.nextInt = function (n) {
        return Math.floor(n * this.next());
    };
    
    this.setSeed(seed);
};