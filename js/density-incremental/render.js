function disp(num) {
    if (num.lt(1e16)) {
        return num.toFixed(1);
    } else {
        return num.toString();
    }
}

// called every tick
function fastRender() {
    renderDensity();
}

// called every 10 ticks
function slowRender() {
    renderAchievements();
    renderUnlock();
}

function renderDensity() {
    document.querySelector("#density").innerHTML = "<b>Density</b>: " + disp(savefile.density) + " kg/m<sup>3</sup> (+" + disp(savefile.densityRate) + " kg/m<sup>3</sup>/s)";
}

function renderCompressors() {
    document.querySelector("#compressors").innerHTML = savefile.compressors.map((factor, idx) => {
        const cost = upgradeCompressorCost(idx);
        const upgradeButtonHTML = '<button onclick="upgradeCompressor(' + idx + ", " + cost + ');">Upgrade (Cost: ' + disp(cost) + ')</button>';

        return `<tr><td>Compressor ${(idx + 1).toString()}${bigSpace}</td><td>x${disp(factor)}${bigSpace}</td><td>${upgradeButtonHTML}</td></tr>`;
    }).join("");
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

function renderUnlock() {
    if(!savefile.achievements["Unlock Compressor 1"]) {
        document.querySelector("#unlock").innerHTML = "Unlock Compressor 1 at 10.0 kg/m<sup>3</sup>!";
    } else if(!savefile.achievements["Unlock Compressor 2"]) {
        document.querySelector("#unlock").innerHTML = "Unlock Compressor 2 at 1000.0 kg/m<sup>3</sup>!";
    } else if(!savefile.achievements["Unlock Compressor 3"]) {
        document.querySelector("#unlock").innerHTML = "Unlock Compressor 3 at 100000.0 kg/m<sup>3</sup>!";
    } else if(!savefile.achievements["Unlock Compressor 4"]) {
        document.querySelector("#unlock").innerHTML = "Unlock Compressor 4 at 10000000.0 kg/m<sup>3</sup>!";
    } else if(!savefile.achievements["Unlock Compressor 5"]) {
        document.querySelector("#unlock").innerHTML = "Unlock Compressor 5 at 1000000000.0 kg/m<sup>3</sup>!";
    } else if(!savefile.achievements["Unlock Black Holes"]) {
        document.querySelector("#unlock").innerHTML = "Unlock Black Holes at 1e11 kg/m<sup>3</sup>!";
    } else {
        document.querySelector("#unlock").innerHTML = "";
    }
}