import { ExplorerUrl } from '@iota/identity-wasm/node';

export const clientConfig = {
  permanodes: [{ url: 'https://chrysalis-chronicle.iota.org/api/mainnet/' }],
  explorer: ExplorerUrl.mainnet(),
};
