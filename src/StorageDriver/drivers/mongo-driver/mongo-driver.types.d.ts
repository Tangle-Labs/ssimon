import { IBaseStorageDriverProps } from "../storage-driver.types";

export interface MongoOptions extends IBaseStorageDriverProps {
  mongouri: string;
}
