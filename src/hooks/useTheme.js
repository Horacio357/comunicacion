import { useEffect } from 'react';

/**
 * Custom hook to dynamically apply institutional branding colors.
 * @param {string} primaryColor - Hex color code (e.g. '#075E54')
 * @param {string} secondaryColor - Hex color code (e.g. '#128C7E')
 */
export const useTheme = (primaryColor, secondaryColor) => {
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply primary colors to CSS variables
    if (primaryColor) {
      root.style.setProperty('--color-primary', primaryColor);
      // Generate lighter/darker variations if needed
      root.style.setProperty('--color-primary-rgb', hexToRgb(primaryColor));
    }
    
    // Apply secondary colors to CSS variables
    if (secondaryColor) {
      root.style.setProperty('--color-secondary', secondaryColor);
    }
  }, [primaryColor, secondaryColor]);
};

// Helper function to convert Hex to RGB (useful for opacity utilities in Tailwind)
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '7, 94, 84'; // Default to WhatsApp green
};
