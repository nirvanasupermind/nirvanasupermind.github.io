var precision = 2;

var defaultSavefile = {
    temperature: 0,
    heaterRate: 0.5,
    atoms: 0,
    nuclearReactorRate: 0,
    lastPlayed: Date.now(),
    achievements: {
        unlockHeaters: false,
        unlockNuclearReactors: false
    }
};

var savefile;

function showAutomation() {
    $("#automation-content").css("display", "block");
    $("#achievements-content").css("display", "none");
    $("#settings-content").css("display", "none");
}

function showAchievements() {
    $("#automation-content").css("display", "none");
    $("#achievements-content").css("display", "block");
    $("#settings-content").css("display", "none");
}

function showSettings() {
    $("#automation-content").css("display", "none");
    $("#achievements-content").css("display", "none");
    $("#settings-content").css("display", "block");
}

function doOfflineProgress() {
    savefile.temperature = savefile.temperature + (Date.now() - savefile.lastPlayed);
    renderTemperature();
}

function temperatureForHeaterUpgrade() {
    return 10 * Math.pow(1.5, 2 * savefile.heaterRate - 1);
}

function heaterUpgrade() {
    if (savefile.temperature >= temperatureForHeaterUpgrade()) {
        savefile.temperature -= temperatureForHeaterUpgrade();
        savefile.heaterRate += 0.5;
        renderTemperature();
        renderHeater();
    }
}

function renderTemperature() {
    $("#temperature").text(savefile.temperature.toFixed(precision) + " K");
}

function renderHeater() {
    $("#heater-rate").text(savefile.heaterRate.toFixed(precision));
    $("#heater-upgrade-temp").text(temperatureForHeaterUpgrade().toFixed(precision));
}

function renderNuclearReactor() {
    $("#nuclear-reactor-rate").text(savefile.nuclearReactorRate.toFixed(precision));
}

function renderAchievements() {
    $("#achievement-unlock-heaters").text(savefile.achievements.unlockHeaters ? "Complete" : "Incomplete");
    $("#achievement-unlock-nuclear-reactors").text(savefile.achievements.unlockNuclearReactors ? "Complete" : "Incomplete");
}

function updateAchievements() {
    if(!savefile.achievements.unlockHeaters && savefile.heaterRate) {
        savefile.achievements.unlockHeaters = true;
    }

    if(!savefile.achievements.unlockNuclearReactors && savefile.temperature >= 10000) {
        savefile.achievements.unlockNuclearReactors = true;
        savefile.nuclearReactorRate = 0.5;
        $("#nuclear-reactor").css("display", "block");
        renderNuclearReactor();
    }

    renderAchievements();
}


function hardReset() {
    if (confirm("Do you want to perform a hard reset?")) {
        savefile = JSON.parse(JSON.stringify(defaultSavefile));
        location.reload();
    }
}

function instantlyUnlockNuclearReactors() {
    savefile.temperature = 10000;
    savefile.heaterRate = 9;
    location.reload();
}

function exportSavefile() {
    var filename = "temperature-incremental-savefile.json";
    var text = JSON.stringify(savefile);

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


window.onload = function () {
    savefile = localStorage.savefile
        ? JSON.parse(localStorage.savefile)
        : JSON.parse(JSON.stringify(defaultSavefile));

    showAutomation();
    renderTemperature();
    renderHeater();
    renderNuclearReactor();
    updateAchievements();
    
    setInterval(function () {
        savefile.temperature += savefile.heaterRate * 0.1;
        renderTemperature();
        if (savefile.nuclearReactorRate) {
            savefile.heaterRate += savefile.nuclearReactorRate * 0.1;
            renderHeater();
        }
    }, 100);

    setInterval(updateAchievements, 10000);
}

window.onbeforeunload = function () {
    savefile.lastPlayed = Date.now();
    localStorage.savefile = JSON.stringify(savefile);
}