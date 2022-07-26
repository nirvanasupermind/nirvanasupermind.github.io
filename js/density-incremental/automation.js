function spendDensity(cost) {
    if(savefile.density.gte(cost)) {
        savefile.density = savefile.density.sub(cost);
        return true;
    }

    return false;
}

function upgradeCompressorCost(idx) {
    const factor = savefile.compressors[idx];

    if(idx == 0) {
        return OmegaNum.pow(2, factor - 1).mul(OmegaNum(10));
    }

    return OmegaNum.pow(2, factor - 1).mul(OmegaNum.pow(100, idx));
}

function upgradeCompressor(idx, cost) {
    if(spendDensity(cost)) {
        savefile.compressors[idx] = savefile.compressors[idx].add(1);
    }

    renderCompressors();
}

function upgradeBlackHoleCost(idx) {
    const potency = savefile.blackHoles[idx];
    if(idx == 0) {
        return OmegaNum.pow(10, OmegaNum.pow(10, potency.sub(1).mul(100).add(1)));
    }
}
function upgradeBlackHole(idx, cost) {
    if(spendDensity(cost)) {
        savefile.blackHoles[idx] = savefile.blackHoles[idx].add(0.01);
    }

    renderBlackHoles();
}

function powerBoostBlackHole(idx) {
    savefile.blackHoles[idx] = savefile.blackHoles[idx].add(0.01);
        setTimeout(() => {
            savefile.blackHoles[idx] = savefile.blackHoles[idx].sub(0.01);
            savefile.canBoost = true;
        }, 30000);
        
    savefile.canBoost = false;
        
    renderBlackHoles();
}