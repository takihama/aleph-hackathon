/**
 * Utility functions for creating WorldApp deep links
 */

/**
 * Creates a WorldApp deep link to launch a mini app
 * @param appId - The WorldApp App ID
 * @param path - Optional path within the app to navigate to
 * @param params - Optional URL parameters to include in the deep link
 * @returns - A properly formatted WorldApp deep link
 */
export function createWorldAppDeepLink(
  appId: string,
  path?: string,
  params?: Record<string, string>
): string {
  if (!appId) {
    console.warn("No app ID provided for WorldApp deep link");
  }

  // Build base deep link
  let deepLink = `worldapp://mini-app?app_id=${encodeURIComponent(appId)}`;

  // Add path if it exists
  if (path) {
    deepLink += `&path=${encodeURIComponent(path)}`;
  }

  // Add any additional parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      deepLink += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });
  }

  return deepLink;
}

/**
 * Parses a URL to extract query parameters
 * @param url - URL to parse
 * @returns - Object with the query parameters
 */
export function parseUrlParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
  } catch (e) {
    // If URL is invalid, try to extract params manually
    const queryString = url.split("?")[1];
    if (queryString) {
      queryString.split("&").forEach((param) => {
        const [key, value] = param.split("=");
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }
  }
  return params;
}
