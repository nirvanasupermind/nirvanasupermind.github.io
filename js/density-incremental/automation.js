function spendDensity(cost) {
    if(savefile.density.gte(cost)) {
        savefile.density = savefile.density.sub(cost);
        return true;
    }

    return false;
}

function upgradeCompressorCost(idx) {
    const factor = savefile.compressors[idx] ;
    return OmegaNum.pow(2, factor - 1).mul(OmegaNum.pow(100, idx + 0.5));
}

function upgradeCompressor(idx, cost) {
    if(spendDensity(cost)) {
        savefile.compressors[idx] = savefile.compressors[idx].add(1);
    }
}