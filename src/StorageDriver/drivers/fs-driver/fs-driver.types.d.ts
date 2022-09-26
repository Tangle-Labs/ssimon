import { PathLike } from "fs";

export interface FsOptions {
  /**
   * FilePath for the JSON where credentials shall be stored
   */
  filepath: JsonPath;
}

export type JsonPath = `${PathLike}.json`;
