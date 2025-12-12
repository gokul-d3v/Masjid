// utils/tokenUtils.ts

export const isTokenExpired = (token: string): boolean => {
  try {
    // Decode the token without verification (we just need to check expiration)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired (exp is in seconds)
    return decoded.exp < currentTime;
  } catch (error) {
    // If there's an error decoding the token, treat it as expired
    console.error('Error decoding token:', error);
    return true;
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};