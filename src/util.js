export function weightedRand(chances) {
    let stacked = {};
    let per = 0;
    let rand = Math.random();

    for (let key in chances) {
        per += chances[key];

        if (rand < per)
            return key;
    }

    return null;
}
