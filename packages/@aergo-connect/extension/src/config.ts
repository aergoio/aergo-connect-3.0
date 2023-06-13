const tuple = <T extends string[]>(...args: T) => args;

export interface ChainConfig {
  label: string;
  chainId: string;
  nodeUrl: string;
  scanExplorerUrl?: string;
  scanApiUrl?: string;
}

export const ChainConfigs: ChainConfig[] = [
  {
    label: 'mainnet',
    chainId: 'aergo.io',
    nodeUrl: 'https://mainnet-api-http.aergo.io',
    scanExplorerUrl: 'https://mainnet.aergoscan.io',
    scanApiUrl: 'https://api2-mainnet.aergoscan.io/v2',
  },
  {
    label: 'testnet',
    chainId: 'testnet.aergo.io',
    nodeUrl: 'https://testnet-api-http.aergo.io',
    scanExplorerUrl: 'https://testnet.aergoscan.io',
    scanApiUrl: 'https://api2-testnet.aergoscan.io/v2',
  },
  {
    label: 'alpha',
    chainId: 'alpha.aergo.io',
    nodeUrl: 'https://alpha-api-http.aergo.io',
    scanExplorerUrl: 'https://alpha.aergoscan.io',
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
  { label: string; chainId: string; scanApiUrl: string; scanExplorerUrl: string; nodeUrl: string }
> = {
  mainnet: {
    label: 'mainnet',
    chainId: 'aergo.io',
    scanApiUrl: 'https://api2-mainnet.aergoscan.io/v2',
    scanExplorerUrl: 'https://mainnet.aergoscan.io',
    nodeUrl: 'https://mainnet-api-http.aergo.io',
  },
  testnet: {
    label: 'testnet',
    chainId: 'testnet.aergo.io',
    scanApiUrl: 'https://api2-testnet.aergoscan.io/v2',
    scanExplorerUrl: 'https://testnet.aergoscan.io',
    nodeUrl: 'https://testnet-api-http.aergo.io',
  },
  alpha: {
    label: 'alpha',
    chainId: 'alpha.aergo.io',
    scanApiUrl: 'https://api2-alpha.aergoscan.io/v2',
    scanExplorerUrl: 'https://alpha.aergoscan.io',
    nodeUrl: 'https://alpha-api-http.aergo.io',
  },
};

export default {
  ChainConfigs,
  PublicChainIds,
  PublicChainData,
};
