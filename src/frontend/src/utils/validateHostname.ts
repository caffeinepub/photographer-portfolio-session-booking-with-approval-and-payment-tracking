/**
 * Validates a DNS hostname according to standard rules.
 * Returns null if valid, or an error message string if invalid.
 */
export function validateHostname(hostname: string): string | null {
  // Check if empty
  if (!hostname || hostname.trim() === "") {
    return "Hostname cannot be empty";
  }

  const trimmed = hostname.trim();

  // Check length (DNS hostname max is 253 characters, but we'll use a more reasonable limit)
  if (trimmed.length < 1 || trimmed.length > 253) {
    return "Hostname must be between 1 and 253 characters";
  }

  // Check for leading or trailing dots
  if (trimmed.startsWith(".") || trimmed.endsWith(".")) {
    return "Hostname cannot start or end with a dot";
  }

  // Check for spaces or other invalid characters
  if (/\s/.test(trimmed)) {
    return "Hostname cannot contain spaces";
  }

  // Split into labels (parts separated by dots)
  const labels = trimmed.split(".");

  // Check each label
  for (const label of labels) {
    // Empty label (consecutive dots)
    if (label.length === 0) {
      return "Hostname cannot contain consecutive dots or empty labels";
    }

    // Label too long (max 63 characters per label)
    if (label.length > 63) {
      return "Each part of the hostname must be 63 characters or less";
    }

    // Label starts or ends with hyphen
    if (label.startsWith("-") || label.endsWith("-")) {
      return "Each part of the hostname cannot start or end with a hyphen";
    }

    // Label contains invalid characters (only alphanumeric and hyphens allowed)
    if (!/^[a-zA-Z0-9-]+$/.test(label)) {
      return "Hostname can only contain letters, numbers, hyphens, and dots";
    }
  }

  return null; // Valid
}
