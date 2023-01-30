export declare class StorageSpec<T, K> {
  public static async build(props): Promise<StorageSpec>;

  public async create(body: T): Promise<K>;

  public async findOne(options: Partial<K>): Promise<K>;

  public async findMany(options: Partial<K>): Promise<K[]>;

  public async findByIdAndUpdate(id: string, body: Partial<K>): Promise<K>;

  public async findByIdAndDelete(id: string): Promise<K>;
}
