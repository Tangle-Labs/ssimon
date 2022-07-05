export interface IStorageDriver<T> {
  /**
   * Find and return all instanstances
   */
  findAll: () => Promise<T[]>;

  /**
   * Find and return the first match with a similar partial
   */
  findOne: (data: Partial<T>) => Promise<T>;

  /**
   * Save a new piece of data
   */
  save: (data: Partial<T>) => Promise<T>;

  /**
   * Update the first entry which matches the identifier
   */
  update: (identifier: Partial<T>, body: Partial<T>) => Promise<T>;

  /**
   * Delete the first entry that matches the Identifier
   */
  delete: (data: Partial<T>) => Promise<T>;
}
