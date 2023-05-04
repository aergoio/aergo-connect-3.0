import { PublicChainData, isPublicChainId } from '../config';

/**
 * Returs the explorer url (e.g. Aergoscan) for a public chainId and path
 * @param chainId
 * @param path
 */
export function getExplorerUrl(chainId: string, path: string): string {
  if (!isPublicChainId(chainId)) {
    return '';
  }
  const base = PublicChainData[chainId].scanExplorerUrl;
  return `${base}/${path}`;
}

/**
 * Returs the API url (e.g. Aergoscan API) for a public chainId and path
 * @param chainId
 * @param path
 */
export function getApiUrl(chainId: string, path: string): string {
  if (!isPublicChainId(chainId)) {
    return '';
  }
  const base = PublicChainData[chainId].scanApiUrl;
  return `${base}/${path}`;
}

export function getScanApiUrl(state) {
  const networkPath = state.networksPath.find((network) => network.chainId === state.chainId);
  return networkPath ? networkPath.scanApiUrl : '';
}

export function getScanExplorerUrl(state) {
  const networkPath = state.networksPath.find((network) => network.chainId === state.chainId);
  return networkPath ? networkPath.scanExplorerUrl : '';
}
