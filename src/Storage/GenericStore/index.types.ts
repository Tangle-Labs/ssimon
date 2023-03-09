export interface IGenericStoreProps {
  path?: string;
  password: string;
  writer: (body: any) => Promise<void>;
  reader: () => Promise<string>;
  build?: () => Promise<void>;
}
