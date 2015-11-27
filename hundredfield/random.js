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
    this.seed = Math.abs(seed) % 2147483647;     // seed for rng
};

/*
 * Random.Random.prototype.next(): 
 * 
 * generates a new pseudo-random number between 0 and 1.
 *
 * @return a new pseudo-random number between 0 and 1.
 */
Random.Random.prototype.next = function () {
    "use strict";
        
    this.seed = (1103515245 * this.seed + 12345) % 2147483647;
    return this.seed * 4.656612875245796924105750827168e-10;
};

/*
 * Random.Random..prototype.nextInt(): 
 * 
 * generates a new pseudo-random integer between 0 and n (n not inclusive).
 *
 * @return a new pseudo-random integer between 0 and n (n not inclusive).
 */
Random.Random.prototype.nextInt = function (n) {
    "use strict";
    
    return Math.floor(n * this.next());
};