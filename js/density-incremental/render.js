function disp(num) {
    if (num.lt(1e+10)) {
        return num.toFixed(1);
    } else if(num.lt(1e16)) {
        return num.mul(1e6).toString().split("e")[0] + "e" + num.log10().floor();
    } else {
        return num.toString();
    }
}

// called every tick
function fastRender() {
    renderDensity();
}

function renderDensity() {
    document.querySelector("#density").innerHTML = "<b>Density</b>: " + disp(savefile.density) + " kg/m<sup>3</sup> (+" + disp(savefile.densityRate) + " kg/m<sup>3</sup>/s)";
}

// called every 10 ticks
function slowRender() {
    renderAchievements();
}

function renderAchievements() {
    testAchievements();

    document.querySelector("#achievements").innerHTML = achievementNames.map((name, idx) => {
        const isComplete = savefile.achievements[name];

        var message;

        if(isComplete) {
            message = "Complete";
        } else {
            message = "Incomplete";
        }

        return `<tr><td> ${idx + 1}${bigSpace}</td><td>${name}${bigSpace}</td><td>${message}</td>`;
    }).join("");
}

// called only when the game loads (and at some specific times when features are unlocked)
function onloadRender() {
    renderCompressors();
    renderBlackHoles();
    renderUnlock();
    showCollapsibles();
}

function renderCompressors() {
    document.querySelector("#compressors-table").innerHTML = savefile.compressors.map((factor, idx) => {
        const cost = upgradeCompressorCost(idx);
        const upgradeButtonHTML = '<button onclick="upgradeCompressor(' + idx + ", " + cost + ');">Upgrade (Cost: ' + disp(cost) + ')</button>';

        return `<tr><td>Compressor ${(idx + 1).toString()}${bigSpace}</td><td>x${disp(factor)}${bigSpace}</td><td>${upgradeButtonHTML}</td></tr>`;
    }).join("");
}

function renderBlackHoles() {
    document.querySelector("#black-holes-table").innerHTML = savefile.blackHoles.map((potency, idx) => {
        const cost = upgradeBlackHoleCost(idx);
        const upgradeBlackHoleHTML = '<button onclick="upgradeBlackHole(' + idx + ", " + cost + ');">Upgrade (Cost: ' + disp(cost) + ')</button>';
        var potencyPart;
        
        if(idx == 0) {
            potencyPart = `+${disp(potency)}/s potency increase for all compressors${bigSpace}`;
        } else {
            potencyPart = `+${disp(potency)}/s potency increase for Level ${idx} Level 1 Black Holes ${bigSpace}`;
        }

        return `<tr><td>Level ${idx + 1} Black Hole${bigSpace}</td><td>${potencyPart}${bigSpace}</td><td>${upgradeBlackHoleHTML}</td></tr>`;
    }).join("");
}

function renderUnlock() {
    if(!savefile.achievements["Unlock Compressor 1"]) {
        document.querySelector("#unlock").innerHTML = "Unlock Compressor 1 at 10.0 kg/m<sup>3</sup>!";
    } else if(!savefile.achievements["Unlock Compressor 2"]) {
        document.querySelector("#unlock").innerHTML = "Unlock Compressor 2 at 100.0 kg/m<sup>3</sup>!";
    } else if(!savefile.achievements["Unlock Compressor 3"]) {
        document.querySelector("#unlock").innerHTML = "Unlock Compressor 3 at 10000.0 kg/m<sup>3</sup>!";
    } else if(!savefile.achievements["Unlock Compressor 4"]) {
        document.querySelector("#unlock").innerHTML = "Unlock Compressor 4 at 1000000.0 kg/m<sup>3</sup>!";
    } else if(!savefile.achievements["Unlock Compressor 5"]) {
        document.querySelector("#unlock").innerHTML = "Unlock Compressor 5 at 100000000.0 kg/m<sup>3</sup>!";
    } else if(!savefile.achievements["Unlock Level 1 Black Holes"]) {
        document.querySelector("#unlock").innerHTML = "Unlock Level 1 Black Holes at 1e10 kg/m<sup>3</sup>!";
    } else {
        document.querySelector("#unlock").innerHTML = "";
    }
}

function showCollapsibles() {
    if(savefile.achievements["Unlock Compressor 1"]) {
        document.querySelector("#compressors-collapsible").style.visibility = "visible";
    } 

    if(savefile.achievements["Unlock Level 1 Black Holes"]) {
        document.querySelector("#black-holes-collapsible").style.visibility = "visible";
    }
}