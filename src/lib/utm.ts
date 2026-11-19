export interface UTMInput {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  customParams?: Record<string, string>;
}

const STANDARD_KEYS: Record<keyof Omit<UTMInput, "customParams">, string> = {
  source: "utm_source",
  medium: "utm_medium",
  campaign: "utm_campaign",
  term: "utm_term",
  content: "utm_content",
};

/**
 * Builds a tracked campaign destination URL without mangling existing query parameters or hash fragments.
 * @param destination Base URL
 * @param values UTM and custom parameters
 * @param overwriteExisting Whether to overwrite duplicate parameter keys already present in the destination
 */
export function buildUtmUrl(
  destination: string,
  values: UTMInput,
  overwriteExisting = true
): string {
  try {
    const url = new URL(destination.trim());

    // Process standard UTM parameters
    for (const [key, paramName] of Object.entries(STANDARD_KEYS) as [
      keyof Omit<UTMInput, "customParams">,
      string
    ][]) {
      const val = values[key]?.trim();
      if (val) {
        if (overwriteExisting || !url.searchParams.has(paramName)) {
          url.searchParams.set(paramName, val);
        }
      }
    }

    // Process custom parameters
    if (values.customParams) {
      for (const [k, v] of Object.entries(values.customParams)) {
        const cleanKey = k.trim();
        const cleanVal = v.trim();
        if (cleanKey && cleanVal) {
          if (overwriteExisting || !url.searchParams.has(cleanKey)) {
            url.searchParams.set(cleanKey, cleanVal);
          }
        }
      }
    }

    return url.toString();
  } catch {
    return destination;
  }
}

/**
 * Extracts existing UTM parameters from an existing destination URL.
 */
export function extractUtmParams(urlStr: string): UTMInput {
  try {
    const url = new URL(urlStr);
    const result: UTMInput = {
      source: url.searchParams.get("utm_source") || undefined,
      medium: url.searchParams.get("utm_medium") || undefined,
      campaign: url.searchParams.get("utm_campaign") || undefined,
      term: url.searchParams.get("utm_term") || undefined,
      content: url.searchParams.get("utm_content") || undefined,
    };
    return result;
  } catch {
    return {};
  }
}
