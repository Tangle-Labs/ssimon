export interface IIdentityManagerProps {
  /**
   * Filepath to store stronghold file at
   */
  filepath: string;

  /**
   * Password for the stronghold file
   */
  password: string;

  /**
   * Identity Manager alias, alias will be used to create the stronghold file
   * and config
   */
  managerAlias: string;
}
