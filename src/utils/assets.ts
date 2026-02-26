/**
 * Helper to get the correct path for assets.
 * When running as a remote module in Module Federation, assets must be served
 * from the MFE's own origin, not the shell's origin.
 */
export const getAssetPath = (path: string): string => {
    // In local dev: http://localhost:5001
    // In staging: https://landing-staging.weboc.tech
    // In production: https://landing.weboc.tech
    const mfeOrigin = (
        'http://localhost:5005'
    ).replace(/\/$/, ''); // Remove trailing slash if present

    // Remove leading 'assets/' from path to avoid duplication
    const cleanPath = path.replace(/^assets\//, '');

    return `${mfeOrigin}/assets/${cleanPath}`;
};
