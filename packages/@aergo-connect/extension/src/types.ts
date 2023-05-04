export type Primitive = null | boolean | number | string;

export type Json = Primitive | Json[] | { [prop: string]: Json };

export type JsonCompatible<T> = {
  [P in keyof T]: T[P] extends Json
    ? T[P]
    : Pick<T, P> extends Required<Pick<T, P>>
    ? never
    : JsonCompatible<T[P]>;
};

interface TokenType {
  blockno: number;
  decimals: number;
  image: string;
  name: string;
  supply: string;
  supply_float: number;
  symbol: string;
  token_transfers: number;
  total_transfer?: number;
  tx_id: string;
  type: string;
  url: string;
}

interface NftType {
  account: string;
  address: string;
  blockno: number;
  token_id: string;
  ts: string;
}
export interface NftTokenType {
  balance: number;
  hash: string;
  meta: TokenType | NftType;
  dropdownState?: boolean;
  nftWallet?: NftInventoryType[];
}

export interface NftInventoryType {
  hash: string;
  meta: NftType;
  token: TokenType;
}
