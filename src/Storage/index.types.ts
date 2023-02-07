export declare class StorageSpec<T, K> {
  public static build<T, K>(...props: any[]): Promise<StorageSpec<T, K>>;

  public create(body: T): Promise<K>;

  public findOne(options: Partial<K>): Promise<K>;

  public findMany(options: Partial<K>): Promise<K[]>;

  public findOneAndUpdate(
    searchParams: Partial<T>,
    body: Partial<K>
  ): Promise<K>;

  public findOneAndDelete(searchParams: Partial<T>): Promise<K>;
}
