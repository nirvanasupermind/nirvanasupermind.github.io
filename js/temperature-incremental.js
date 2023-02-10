var precision = 2;

var defaultSavefile = {
    temperature: 0,
    heaterRate: 0.5,
    hydrogen: 0,
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


function heaterUpgradeCost() {
    return 10 * Math.pow(1.5, 2 * savefile.heaterRate - 1);
}

function upgradeHeater() {
    if (savefile.temperature >= heaterUpgradeCost()) {
        savefile.temperature -= heaterUpgradeCost();
        savefile.heaterRate += 0.5;
        renderTemperature();
        renderHeater();
    }
}

function hydrogenSoftResetAmount() {
    return savefile.temperature < 100 ? 0
        : Math.log(savefile.temperature) - Math.log(100);
}

function hydrogenSoftReset() {
    savefile.hydrogen += hydrogenSoftResetAmount();
    renderHydrogen();
    savefile.temperature = 0;
    savefile.heaterRate = 0.5;
}

function nuclearReactorUpgradeCost() {
    return 10 * Math.pow(2, 2 * savefile.nuclearReactorRate - 1);
}

function upgradeNuclearReactor() {
    if (savefile.hydrogen >= nuclearReactorUpgradeCost()) {
        savefile.hydrogen -= nuclearReactorUpgradeCost();
        savefile.nuclearReactorRate += 0.5;
        renderHydrogen();
        renderNuclearReactor();
    }
}

function renderTemperature() {
    $("#temperature").text(savefile.temperature.toFixed(precision) + " K");
    $("#hydrogen-soft-reset-amount").text(hydrogenSoftResetAmount().toFixed(precision));
}

function renderHeater() {
    $("#heater-rate").text(savefile.heaterRate.toFixed(precision));
    $("#heater-upgrade-temp").text(heaterUpgradeCost().toFixed(precision));
}

function renderNuclearReactor() {
    $("#nuclear-reactor-rate").text(savefile.nuclearReactorRate.toFixed(precision));
    $("#nuclear-reactor-upgrade-cost").text(nuclearReactorUpgradeCost().toFixed(precision));
}

function renderHydrogen() {
    $("#hydrogen").text(savefile.hydrogen.toFixed(precision));
}

function renderAchievements() {
    $("#achievement-unlock-heaters").text(savefile.achievements.unlockHeaters ? "Complete" : "Incomplete");
    $("#achievement-unlock-nuclear-reactors").text(savefile.achievements.unlockNuclearReactors ? "Complete" : "Incomplete");
}

function updateAchievements() {
    if (!savefile.achievements.unlockHeaters && savefile.heaterRate) {
        savefile.achievements.unlockHeaters = true;
    }

    if (!savefile.achievements.unlockNuclearReactors && savefile.temperature >= 1000) {
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
    savefile.temperature = 1000;
    savefile.heaterRate = 5.5;
    location.reload();
}


document.getElementById("import-savefile")
    .addEventListener("change", function () {

        var fr = new FileReader();
        fr.onload = function () {
            savefile = JSON.parse(fr.result);
            location.reload();
        }

        fr.readAsText(this.files[0]);
    });

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
    updateAchievements();
    renderHydrogen();

    if (savefile.achievements.unlockNuclearReactors) {
        $("#nuclear-reactor").css("display", "block");
        renderNuclearReactor();
    }

    setInterval(function () {
        savefile.temperature += savefile.heaterRate * 0.1;
        renderTemperature();
        if (savefile.achievements.unlockNuclearReactors) {
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