/**
 * Utility functions for parsing and managing URL parameters
 * Works with both hash-based and browser-based routing
 */

export function getUrlParameter(paramName: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  const regularParam = urlParams.get(paramName);
  if (regularParam !== null) return regularParam;

  // Hash-based routing: hash looks like #/route?param=value
  const hash = window.location.hash;
  const queryStartIndex = hash.indexOf("?");
  if (queryStartIndex !== -1) {
    const hashParams = new URLSearchParams(hash.substring(queryStartIndex + 1));
    return hashParams.get(paramName);
  }

  return null;
}

export function storeSessionParameter(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {}
}

export function getSessionParameter(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getPersistedUrlParameter(
  paramName: string,
  storageKey?: string,
): string | null {
  const key = storageKey || paramName;
  const urlValue = getUrlParameter(paramName);
  if (urlValue !== null) {
    storeSessionParameter(key, urlValue);
    return urlValue;
  }
  return getSessionParameter(key);
}

export function clearSessionParameter(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {}
}

function clearParamFromHash(paramName: string): void {
  if (!window.history.replaceState) return;
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) return;
  const hashContent = hash.substring(1);
  const queryStartIndex = hashContent.indexOf("?");
  if (queryStartIndex === -1) return;
  const routePath = hashContent.substring(0, queryStartIndex);
  const params = new URLSearchParams(
    hashContent.substring(queryStartIndex + 1),
  );
  params.delete(paramName);
  const newQueryString = params.toString();
  const newHash = newQueryString ? `${routePath}?${newQueryString}` : routePath;
  window.history.replaceState(
    null,
    "",
    window.location.pathname +
      window.location.search +
      (newHash ? `#${newHash}` : ""),
  );
}

/**
 * Gets a secret parameter — reads from URL (hash-routing aware) or sessionStorage.
 * Stores in sessionStorage on first read. Clears from URL hash after extraction.
 */
export function getSecretParameter(paramName: string): string | null {
  const existing = getSessionParameter(paramName);
  if (existing !== null) return existing;

  const urlValue = getUrlParameter(paramName);
  if (urlValue !== null) {
    storeSessionParameter(paramName, urlValue);
    clearParamFromHash(paramName);
    return urlValue;
  }

  return null;
}

/** @deprecated Use getSecretParameter */
export function getSecretFromHash(paramName: string): string | null {
  return getSecretParameter(paramName);
}
