/**
 * Returns a parameter object with the needed properties to get a device's location
 * @param {Context.System} systemObject 
 */
exports.getLocationParameters = (systemObject) => {
    return {
        apiEndpoint: systemObject.apiEndpoint,
        token: systemObject.apiAccessToken,
        deviceID: systemObject.deviceId
    };
};