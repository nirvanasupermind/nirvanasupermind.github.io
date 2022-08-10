var achievementNames = [
    "Unlock Compressor 1",
    "Unlock Compressor 2",
    "Unlock Compressor 3",   
    "Unlock Compressor 4",
    "Unlock Compressor 5", 
    "Unlock Black Holes"
];

function testAchievements() {
    if(savefile.density.gt(10) && !savefile.achievements["Unlock Compressor 1"]) {
        savefile.achievements["Unlock Compressor 1"] = true;
        savefile.compressors.push(OmegaNum(1));
        renderCompressors();
    }
    
    if(savefile.density.gt(1000) && !savefile.achievements["Unlock Compressor 2"]) {
        savefile.achievements["Unlock Compressor 2"] = true;
        savefile.compressors.push(OmegaNum(1));
        renderCompressors();
    }

    if(savefile.density.gt(100000) && !savefile.achievements["Unlock Compressor 3"]) {
        savefile.achievements["Unlock Compressor 3"] = true;
        savefile.compressors.push(OmegaNum(1));
        renderCompressors();
    }

    if(savefile.density.gt(10000000) && !savefile.achievements["Unlock Compressor 4"]) {
        savefile.achievements["Unlock Compressor 4"] = true;
        savefile.compressors.push(OmegaNum(1));
        renderCompressors();
    }

    if(savefile.density.gt(1000000000) && !savefile.achievements["Unlock Compressor 5"]) {
        savefile.achievements["Unlock Compressor 5"] = true;
        savefile.compressors.push(OmegaNum(1));
        renderCompressors();
    }

    if(savefile.density.gt(1e11) && !savefile.achievements["Unlock Black Holes"]) {
        savefile.achievements["Unlock Black Holes"] = true;
    }
}