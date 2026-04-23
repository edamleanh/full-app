/**
 * HEX to Text Decoder Module
 * Shared logic for both inline and popup modes
 */

/**
 * Validates if a string is valid hexadecimal
 * @param {string} text - Text to validate
 * @returns {boolean} True if valid HEX
 */
function isValidHex(text) {
  if (!text || typeof text !== 'string') return false;
  
  // Remove whitespace and newlines for validation
  const cleaned = text.replace(/[\s\n\r]/g, '');
  
  // Must have even number of characters (byte pairs)
  if (cleaned.length === 0 || cleaned.length % 2 !== 0) return false;
  
  // Must only contain hex characters (0-9, a-f, A-F)
  return /^[0-9a-fA-F]+$/.test(cleaned);
}

/**
 * Decodes hexadecimal string to UTF-8 text
 * @param {string} hexString - Hexadecimal string to decode
 * @returns {string} Decoded text or error message
 */
function decodeHex(hexString) {
  try {
    if (!isValidHex(hexString)) {
      return 'Invalid HEX';
    }
    
    // Remove all whitespace and newlines
    const cleaned = hexString.replace(/[\s\n\r]/g, '');
    
    // Convert hex pairs to bytes
    const bytes = [];
    for (let i = 0; i < cleaned.length; i += 2) {
      const hexPair = cleaned.substring(i, i + 2);
      bytes.push(parseInt(hexPair, 16));
    }
    
    // Decode bytes to UTF-8 string
    const decoder = new TextDecoder('utf-8');
    const uint8Array = new Uint8Array(bytes);
    const decoded = decoder.decode(uint8Array);
    
    return decoded;
  } catch (error) {
    return 'Invalid HEX';
  }
}

/**
 * Checks if a string is a valid URL
 * @param {string} text - Text to validate
 * @returns {boolean} True if valid HTTP/HTTPS URL
 */
function isValidUrl(text) {
  if (!text || typeof text !== 'string') return false;
  
  try {
    const url = new URL(text.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Export for use in different contexts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment (for testing)
  module.exports = { isValidHex, decodeHex, isValidUrl };
}
