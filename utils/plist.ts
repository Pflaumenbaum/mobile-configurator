export const createPlist = (json: any): string => {
  const escapeXml = (str: string): string =>
    str
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

  const convert = (value: any): string => {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "string") {
      if (value.startsWith("base64://")) {
        const base64Content = value.substring("base64://".length);
        return `<data>${escapeXml(base64Content)}</data>`;
      } else if (isoDateRegex.test(value)) {
        return `<date>${escapeXml(value)}</date>`;
      } else {
        return `<string>${escapeXml(value)}</string>`;
      }
    } else if (typeof value === "number") {
      return Number.isInteger(value)
        ? `<integer>${value}</integer>`
        : `<real>${value}</real>`;
    } else if (typeof value === "boolean") {
      return value ? "<true/>" : "<false/>";
    } else if (Array.isArray(value)) {
      const convertedItems = value.map(convert).filter((item) => item !== "");
      if (convertedItems.length < 1) return "";
      return `<array>${convertedItems.join("")}</array>`;
    } else if (typeof value === "object") {
      const entries = Object.entries(value)
        .map(([k, v]) => {
          const converted = convert(v);
          return converted !== ""
            ? `<key>${escapeXml(k)}</key>${converted}`
            : "";
        })
        .filter((item) => item !== "");
      if (entries.length === 0) return "";
      return `<dict>${entries.join("")}</dict>`;
    } else {
      throw new Error(`Unsupported type: ${typeof value}`);
    }
  };

  const plistHeader =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" ` +
    `"http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n` +
    `<plist version="1.0">\n`;

  const plistFooter = `\n</plist>`;

  const body = convert(json);
  return plistHeader + body + plistFooter;
};
