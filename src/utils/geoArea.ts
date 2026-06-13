/** Compute geodesic area in square metres from lat/lng polygon vertices. */
export function polygonAreaSquareMetres(points: [number, number][]): number {
    if (points.length < 3) return 0;

    let area = 0;
    for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        const lat1 = (points[i][0] * Math.PI) / 180;
        const lat2 = (points[j][0] * Math.PI) / 180;
        const lon1 = (points[i][1] * Math.PI) / 180;
        const lon2 = (points[j][1] * Math.PI) / 180;
        area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    return Math.abs((area * 6378137 * 6378137) / 2);
}

const SQ_METRES_PER_ACRE = 4046.8564224;
const SQ_METRES_PER_HECTARE = 10000;

export function squareMetresToAcres(sqM: number): number {
    return sqM / SQ_METRES_PER_ACRE;
}

export function squareMetresToHectares(sqM: number): number {
    return sqM / SQ_METRES_PER_HECTARE;
}

export function polygonAreaAcres(points: [number, number][]): number {
    return squareMetresToAcres(polygonAreaSquareMetres(points));
}

export function polygonAreaHectares(points: [number, number][]): number {
    return squareMetresToHectares(polygonAreaSquareMetres(points));
}
