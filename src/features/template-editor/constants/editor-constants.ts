export const EDITOR_CONSTANTS = {
  // CR80 dimensions in millimeters
  CARD_WIDTH_MM: 53.98,
  CARD_HEIGHT_MM: 85.60,
  
  // Standard conversion factor: 1 mm = 3.7795275591 px (approx 96 DPI)
  // For printing, usually higher DPI is preferred, e.g. 300 DPI (1 mm = 11.81 px)
  // Let's use 300 DPI for high quality editing/rendering.
  MM_TO_PX_300DPI: 11.8110236,
  
  // CR80 pixels at 300 DPI: ~638px x ~1011px
  CARD_WIDTH_PX: Math.round(53.98 * 11.8110236),
  CARD_HEIGHT_PX: Math.round(85.60 * 11.8110236),

  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5.0,
  ZOOM_STEP: 0.1,
  
  DEFAULT_GRID_SIZE: 20,
};
