/**
 * Utility to get car brand logo URLs from a public dataset.
 */

const LOGO_BASE_URL = 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized';

const BRAND_OVERRIDES = {
  'mercedes-benz': 'mercedes-benz',
  'land rover': 'land-rover',
  'alfa romeo': 'alfa-romeo',
  'aston martin': 'aston-martin',
  'rolls royce': 'rolls-royce',
  'bentley': 'bentley',
  'lamborghini': 'lamborghini',
  'ferrari': 'ferrari',
  'porsche': 'porsche',
  'bajaji': 'tvs', // Using TVS as a common Bajaji brand logo if available, or handle separately
};

/**
 * Converts a brand name to a slug used by the logo dataset.
 */
export function slugifyBrand(make) {
  if (!make) return '';
  const normalized = make.toLowerCase().trim();

  if (BRAND_OVERRIDES[normalized]) {
    return BRAND_OVERRIDES[normalized];
  }

  return normalized
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')        // Trim - from start of text
    .replace(/-+$/, '');       // Trim - from end of text
}

/**
 * Returns the URL for a car brand logo.
 */
export function getCarLogoUrl(make) {
  if (!make) return null;
  const slug = slugifyBrand(make);
  return `${LOGO_BASE_URL}/${slug}.png`;
}
