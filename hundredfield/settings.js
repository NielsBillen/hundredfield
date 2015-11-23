/*-----------------------------------------------------------------------------
 * Javascript controlling the settings
 *---------------------------------------------------------------------------*/

/*global console, HundredField*/

/* define the settings namespace */
var Settings = Settings || {};

Settings.refreshTimeout = 1000;

/*
 * HundredFieldCore.addClickListener(element, handler): 
 */
Settings.addClickListener = function (element, handler) {
    "use strict";
    
    if (typeof document.body.ontouchend === "undefined") {
        element.addEventListener("touchend", handler);
    } else {
        element.addEventListener("click", handler);
    }
};

/*-----------------------------------------------------------------------------
 * Settings.init()
 *
 * Initializes the settings by loading the settings from the local storage.
 * Also the appropriate listeners are added to the 'applicationCache'.
 *---------------------------------------------------------------------------*/
Settings.init = function () {
    "use strict";
    var offset, offsetElement, backButton, updateButton, appCache;
    
    /* ------------------------------------------------------------------------
     * Load the offset stored in local storage, if present
     * ----------------------------------------------------------------------*/
    
    offset = localStorage.getItem("settings.hundredfield.offset");
    offsetElement = document.getElementById("offset");

    if (offset) {
        offsetElement.value = offset;
    } else {
        offsetElement.value = "1";
        localStorage.setItem("settings.hundredfield.offset", offsetElement.value);
    }
    
    offsetElement.onchange = Settings.onchange;
    
    /* ------------------------------------------------------------------------
     * Listen for update events
     * ----------------------------------------------------------------------*/
    
    Settings.updateStatus = "idle";
    
    updateButton = document.getElementById("updatebutton");
    appCache = window.applicationCache;
        
    if (appCache) {
        appCache.addEventListener('checking', function (e) {
            Settings.updateStatus = "updating";
            updateButton.innerHTML = "Checking for updates...";
        }, false);

        appCache.addEventListener('cached', function (e) {
            Settings.updateStatus = "updating";
            updateButton.innerHTML = "Up to date!";
            Settings.updateReset();
        }, false);
            
        appCache.addEventListener('downloading', function (e) {
            Settings.updateStatus = "updating";
            updateButton.innerHTML = "Downloading...";
        }, false);
            
        appCache.addEventListener('updateready', function (e) {
            Settings.updateStatus = "updating";
            updateButton.innerHTML = "Update is ready...";
            appCache.swapCache();
            
            window.setTimeout(function () {
                window.location.reload();
            }, Settings.refreshTimeout);
        }, false);
            
        appCache.addEventListener('noupdate', function (e) {
            Settings.updateStatus = "updating";
            updateButton.innerHTML = "Up to date!";
            Settings.updateReset();
        }, false);
            
        appCache.addEventListener('error', function (e) {
            Settings.updateStatus = "updating";
            updateButton.innerHTML = "Up to date!";
            Settings.updateReset();
        }, false);
            
        appCache.addEventListener('progress', function (e) {
            Settings.updateStatus = "updating";
            updateButton.innerHTML = "Downloading file (" + (e.loaded + 1) + " of " + (e.total + 1) + ")";
        }, false);
            
        appCache.addEventListener('obsolete', function (e) {
            Settings.updateStatus = "updating";
            updateButton.innerHTML = "Up to date!";
            Settings.updateReset();
        }, false);
    } else {
        updateButton.innerHTML = "No offline cache";
    }
    
    /* add listener to the update button */
    Settings.addClickListener(updateButton, Settings.update);
    
    /* add listener to the back button */
    backButton = document.getElementById("backbutton");
    Settings.addClickListener(backButton, function () {
        window.location = "hundredfield.html";
    });
};

Settings.update = function () {
    "use strict";
    
    var appCache, updateButton;
    if (Settings.updateStatus === "idle") {
        Settings.updateStatus = "updating";
        appCache = window.applicationCache;
        
        try {
            appCache.update();
        } catch (e) {
            updateButton = document.getElementById("updatebutton");
            updateButton.innerHTML = "An error occured!";
            console.log(e);
            Settings.updateReset();
        }
    }
};

Settings.updateReset = function () {
    "use strict";
    if (Settings.timeout) {
        window.clearTimeout(Settings.timeout);
    }
    window.setTimeout(function () {
        var updateButton = document.getElementById("updatebutton");
        updateButton.innerHTML = "Check for updates";
        Settings.updateStatus = "idle";
    }, Settings.refreshTimeout);
};

Settings.onchange = function (e) {
    "use strict";
    
    var offsetElement = document.getElementById("offset");

    localStorage.setItem("settings.hundredfield.offset", offsetElement.value);
};


Settings.init();