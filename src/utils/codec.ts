export const bytesToString = (bytes: Uint8Array) => {
  return Buffer.from(bytes).toString("hex");
};

export const stringToBytes = (str: string) => {
  return Uint8Array.from(Buffer.from(str, "hex"));
};
