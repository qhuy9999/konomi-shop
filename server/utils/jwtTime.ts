// === Helper function to parse JWT time string to milliseconds ===
export function parseJwtTime(timeString: string): number {
  const value = parseInt(timeString)
  
  if (timeString.endsWith('d')) {
    return value * 24 * 60 * 60 * 1000 // days to ms
  } else if (timeString.endsWith('h')) {
    return value * 60 * 60 * 1000 // hours to ms
  } else if (timeString.endsWith('m')) {
    return value * 60 * 1000 // minutes to ms
  } else if (timeString.endsWith('s')) {
    return value * 1000 // seconds to ms
  }
  
  // Default: treat as milliseconds
  return parseInt(timeString)
}