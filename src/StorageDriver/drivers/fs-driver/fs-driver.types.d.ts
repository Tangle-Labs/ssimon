import { PathLike } from "fs";

export interface IFsDriverOpts {
  /**
   * FilePath for the JSON where credentials shall be stored
   */
  filepath: PathLike;
}
