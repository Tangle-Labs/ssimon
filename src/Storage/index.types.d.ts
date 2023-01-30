export declare class StorageSpec<T, K> {
  public static async build(props): Promise<StorageSpec>;

  public async create(body: T): Promise<K>;

  public async findOne(options: Partial<K>): Promise<K>;

  public async findMany(options: Partial<K>): Promise<K[]>;

  public async findOneAndUpdate(
    searchParams: Partial<T>,
    body: Partial<K>
  ): Promise<K>;

  public async findOneAndDelete(searchParams: Partial<T>): Promise<K>;
}
