"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateValueBD = void 0;
const calculateValueBD = (value, decimals, ctx) => {
    try {
        if (value === null || value === undefined) {
            ctx.log.warn("Received null or undefined value for valueBD calculation");
            return 0;
        }
        const isNegative = value < 0n;
        const absoluteValue = isNegative ? -value : value;
        const valueString = absoluteValue.toString();
        if (valueString.length > 30) {
            ctx.log.warn(`Value ${valueString} is too large for safe float conversion`);
            return 0;
        }
        const rawBD = Number(absoluteValue) / Math.pow(10, decimals);
        if (!Number.isFinite(rawBD)) {
            ctx.log.warn(`Invalid conversion result for value: ${valueString}, decimals: ${decimals}`);
            return 0;
        }
        return isNegative ? -rawBD : rawBD;
    }
    catch (error) {
        ctx.log.error(`Error calculating valueBD: ${error}, value: ${value}, decimals: ${decimals}`);
        return 0;
    }
};
exports.calculateValueBD = calculateValueBD;
