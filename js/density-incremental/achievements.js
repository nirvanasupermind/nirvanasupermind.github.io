const achievementNames = [
    "Unlock Compressor 1",
    "Unlock Compressor 2",
    "Unlock Compressor 3",   
    "Unlock Compressor 4",
    "Unlock Compressor 5", 
    "Unlock Level 1 Black Holes",
    "Unlock Level 2 Black Holes"
];

function testAchievements() {
    if(savefile.density.gt(10) && !savefile.achievements["Unlock Compressor 1"]) {
        savefile.achievements["Unlock Compressor 1"] = true;
        savefile.compressors.push(OmegaNum.ONE);
        onloadRender();
    }
    
    if(savefile.density.gt(100) && !savefile.achievements["Unlock Compressor 2"]) {
        savefile.achievements["Unlock Compressor 2"] = true;
        savefile.compressors.push(OmegaNum.ONE);
        onloadRender();
    }

    if(savefile.density.gt(10000) && !savefile.achievements["Unlock Compressor 3"]) {
        savefile.achievements["Unlock Compressor 3"] = true;
        savefile.compressors.push(OmegaNum.ONE);
        onloadRender();
    }

    if(savefile.density.gt(100000) && !savefile.achievements["Unlock Compressor 4"]) {
        savefile.achievements["Unlock Compressor 4"] = true;
        savefile.compressors.push(OmegaNum.ONE);
        onloadRender();
    }

    if(savefile.density.gt(1000000000) && !savefile.achievements["Unlock Compressor 5"]) {
        savefile.achievements["Unlock Compressor 5"] = true;
        savefile.compressors.push(OmegaNum.ONE);
        onloadRender();
    }

    if(savefile.density.gt(1e10) && !savefile.achievements["Unlock Level 1 Black Holes"]) {
        savefile.achievements["Unlock Level 1 Black Holes"] = true;
        savefile.blackHoles.push(OmegaNum.ONE);
        onloadRender();
        document.querySelector("#black-holes-collapsible").style.visibility = "visible";
    }

    if(savefile.density.gt(1e100) && !savefile.achievements["Unlock Level 2 Black Holes"]) {
        savefile.achievements["Unlock Level 2 Black Holes"] = true;
        savefile.blackHoles.push(OmegaNum.ONE);
        onloadRender();
    }
}