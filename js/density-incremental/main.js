const msPerTick = 100;

const bigSpace = new Array(10).join("&nbsp;");


var savefile;

function getDefaultSavefile() {
    return {
        density: OmegaNum(0),
        densityRate: OmegaNum(0),
        compressors: new Array(6).fill(OmegaNum(1)),
        achievements: {},
        lastOnline: Date.now()
    };
}

function save() {
    localStorage.setItem("savefileJSON", JSON.stringify(savefile));
}

function importSave() {
    console.log(document.querySelector("#importSave").value);
}

function exportSave() {
    save();

    const blob = new Blob([localStorage.getItem("savefileJSON")], { "type": "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "density-incremental-save-" + Date.now() + ".json";
    a.click();
    a.remove();
}

function hardReset() {
    if (confirm("Are you sure you want to perform a hard reset?")) {
        savefile = getDefaultSavefile();
        save();
    }
}

function load() {
    var savefileJSON = localStorage.getItem("savefileJSON");

    if (savefileJSON && savefileJSON !== "undefined") {
        savefile = JSON.parse(savefileJSON, (k, v) => {
            if (v && v.array && v.sign) {
                return OmegaNum.fromObject(v);
            }

            return v;
        });
    }
    else {
        savefile = getDefaultSavefile();
    }
}

function recordOfflineProgress() {
    var ticksPassed = (Date.now() - savefile.lastOnline) / msPerTick;
    savefile.density = savefile.density.add(savefile.densityRate.mul(0.1 * ticksPassed));    
}

function main() {
    load();

    recordOfflineProgress();

    // Game loop
    setInterval(() => {
        savefile.densityRate = savefile.compressors.reduce(OmegaNum.mul);
        savefile.density = savefile.density.add(savefile.densityRate.mul(0.1));
        render();
    }, msPerTick);
}

window.onload = main;

window.onbeforeunload = () => {
    savefile.lastOnline = Date.now();
    save();
};