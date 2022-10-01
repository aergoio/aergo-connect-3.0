const tuple = <T extends string[]>(...args: T) => args;

export interface ChainConfig {
  chainId: string;
  nodeUrl: string;
}

export const ChainConfigs: ChainConfig[] = [
  {
    chainId: 'testnet',
    nodeUrl: 'https://testnet-api-http.aergo.io',
  },
  {
    chainId: 'mainnet',
    nodeUrl: 'https://mainnet-api-http.aergo.io',
  },
  {
    chainId: 'alpha',
    nodeUrl: 'https://alpha-api-http.aergo.io',
  },
];

export const PublicChainIds = tuple('aergo.io', 'testnet.aergo.io');
type PublicChainId = typeof PublicChainIds[number];

export function isPublicChainId(chainId: string): chainId is PublicChainId {
  return PublicChainIds.indexOf(chainId as any) !== -1;
}

export const PublicChainData: Record<
  PublicChainId,
  { label: string; apiUrl: string; explorerUrl: string }
> = {
  'aergo.io': {
    label: 'Mainnet',
    apiUrl: 'https://api.aergoscan.io/main',
    explorerUrl: 'https://mainnet.aergoscan.io',
  },
  'testnet.aergo.io': {
    label: 'Testnet',
    apiUrl: 'https://api.aergoscan.io/testnet',
    explorerUrl: 'https://testnet.aergoscan.io',
  },
};

export default {
  ChainConfigs,
  PublicChainIds,
  PublicChainData,
};
