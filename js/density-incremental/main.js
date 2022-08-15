const msPerTick = 100;

const bigSpace = new Array(10).join("&nbsp;");

var savefile;

function getDefaultSavefile() {
    return {
        density: OmegaNum.ZERO,
        densityRate: OmegaNum.ONE,
        compressors: [],
        blackHoles: [],
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
        window.location.reload();
    }
}

function unlockBlackHoles() {
    savefile.density = OmegaNum(1e10);
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

    for(var i = 0; i < savefile.compressors.length; i++) {
        savefile.compressors[i] = savefile.compressors[i].add(savefile.blackHoles[0].mul(0.1 * ticksPassed)).floor();
    }

    savefile.densityRate = savefile.compressors.reduce(OmegaNum.mul, OmegaNum.ONE);

    savefile.density = savefile.density.add(savefile.densityRate.mul(0.1 * ticksPassed)); 
}

function main() {
    load();

    recordOfflineProgress();

    onloadRender();  

    setInterval(() => {
        savefile.densityRate = savefile.compressors.reduce(OmegaNum.mul, OmegaNum.ONE);
        savefile.density = savefile.density.add(savefile.densityRate.mul(0.1));

        fastRender();
    }, msPerTick);

    setInterval(() => {
        if(savefile.blackHoles.length) {
            savefile.compressors.forEach((_, idx) => {
                savefile.compressors[idx] = savefile.compressors[idx].add(savefile.blackHoles[0]);
                renderCompressors();
            });

            for(var i = 0; i < savefile.blackHoles.length - 1; i++) {
                savefile.blackHoles[level] = savefile.blackHoles[level].add(savefile.blackHoles[level + 1]);
            }
        }

        slowRender();
    }, msPerTick * 10);
}

window.onload = main;

window.onbeforeunload = () => {
    savefile.lastOnline = Date.now();
    save();
};