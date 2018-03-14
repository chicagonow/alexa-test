/* calculate distance between two objects using lat/long
uses the "Haversine" formula
*/
exports.Unit = {
    M: "M",
    K: "K",
    N: "N"
};

// unit should be "M" for miles, "K" for kilometers, "N" for nautical miles
exports.getDistance = function (lat1, lon1, lat2, lon2, unit) {
    let radlat1 = Math.PI * lat1 / 180;
    let radlat2 = Math.PI * lat2 / 180;
    let radlon1 = Math.PI * lon1 / 180;
    let radlon2 = Math.PI * lon2 / 180;
    let theta = lon1 - lon2;
    let radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;

    switch (unit) {
        case this.Unit.K:
            dist *= 1.609344;
            break;
        case this.Unit.N:
            dist *= 0.8684;
            break;
        case this.Unit.M:
        default:
    }

    return dist;
};