export const bytesToString = (bytes: Uint8Array) => {
  const chars = [];
  for (let i = 0, n = bytes.length; i < n; ) {
    chars.push(((bytes[i++] & 0xff) << 8) | (bytes[i++] & 0xff));
  }
  return String.fromCharCode.apply(null, chars);
};

export const stringToBytes = (str: string) => {
  const bytes = [];
  for (let i = 0, n = str.length; i < n; i++) {
    const char = str.charCodeAt(i);
    bytes.push(char >>> 8, char & 0xff);
  }
  return bytes as unknown as Uint8Array;
};
