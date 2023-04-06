const tuple = <T extends string[]>(...args: T) => args;

export interface ChainConfig {
  chainId: string;
  nodeUrl: string;
  scanApiUrl?: string;
}

export const ChainConfigs: ChainConfig[] = [
  {
    chainId: 'mainnet',
    nodeUrl: 'https://mainnet-api-http.aergo.io',
    scanApiUrl: 'https://api.aergoscan.io/mainnet/v2',
  },
  {
    chainId: 'testnet',
    nodeUrl: 'https://testnet-api-http.aergo.io',
    scanApiUrl: 'https://api.aergoscan.io/testnet/v2',
  },
  {
    chainId: 'alpha',
    nodeUrl: 'https://alpha-api-http.aergo.io',
    scanApiUrl: 'https://api2-alpha.aergoscan.io/v2',
  },
];

export const PublicChainIds = tuple('mainnet', 'testnet', 'alpha');
export type PublicChainId = typeof PublicChainIds[number];

export function isPublicChainId(chainId: string): chainId is PublicChainId {
  return PublicChainIds.indexOf(chainId as any) !== -1;
}

export const PublicChainData: Record<
  PublicChainId,
  { label: string; scanApiUrl: string; explorerUrl: string; nodeUrl: string }
> = {
  mainnet: {
    label: 'Mainnet',
    scanApiUrl: 'https://api.aergoscan.io/mainnet/v2',
    explorerUrl: 'https://mainnet.aergoscan.io',
    nodeUrl: 'https://mainnet-api-http.aergo.io',
  },
  testnet: {
    label: 'Testnet',
    scanApiUrl: 'https://api.aergoscan.io/testnet/v2',
    explorerUrl: 'https://testnet.aergoscan.io',
    nodeUrl: 'https://testnet-api-http.aergo.io',
  },
  alpha: {
    label: 'Alpha',
    scanApiUrl: 'https://api2-alpha.aergoscan.io/v2',
    explorerUrl: 'https://alpha.aergoscan.io',
    nodeUrl: 'https://alpha-api-http.aergo.io',
  },
};

export default {
  ChainConfigs,
  PublicChainIds,
  PublicChainData,
};
