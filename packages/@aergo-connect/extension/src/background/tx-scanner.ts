import { Address } from '@herajs/client';
import { Wallet, Transaction, Account } from '@herajs/wallet';

/**
 * This is a data source for transactionManager.getAccountTransactions.
 * It uses the Aergoscan API which is experimental and subject to change.
 * It is not recommended to use this data source.
 */
export class AergoscanTransactionScanner {
  fetchAccountTransactionsAfter() {
    return (next: Function) =>
      async ({ account, blockno, limit }: { account: Account; blockno: number; limit: number }) => {
        const chainId = account.data.spec.chainId;
        if (
          chainId !== 'testnet.aergo.io' &&
          chainId !== 'aergo.io' &&
          chainId !== 'alpha.aergo.io'
        ) {
          return next({ account, blockno, limit });
        }
        let baseUrl;
        if (chainId == 'testnet.aergo.io') {
          baseUrl = 'https://api2-testnet.aergoscan.io/v2';
        }
        if (chainId == 'aergo.io') {
          baseUrl = 'https://api2-mainnet.aergoscan.io/v2';
        }
        if (chainId === 'alpha.aergo.io') {
          baseUrl = 'https://api2-mainnet.aergoscan.io/v2';
        }
        // demo 용
        // baseUrl = 'https://api2-mainnet.aergoscan.io/v2';

        const address = new Address(account.data.spec.address);
        const q = encodeURIComponent(`(from:${address} OR to:${address}) AND blockno:>${blockno}`);

        const size = 1000;
        const offset = 0;
        const url = `${baseUrl}/transactions?q=${q}&sort=blockno:desc&size=${size}&from=${offset}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (!data.hits) return [];
          console.log(
            `[track account] Got ${data.hits.length} (of ${data.total}) txs for ${address} since ${blockno}.`,
          );
          // console.log(data);
          return data.hits.map(
            (tx: any) =>
              new Transaction(tx.hash, {
                chainId,
                from: tx.meta.from,
                to: tx.meta.to,
                hash: tx.hash,
                ts: tx.meta.ts,
                blockhash: '', // TODO: remove or add?
                blockno: tx.meta.blockno,
                amount: tx.meta.amount,
                type: tx.meta.type,
                status: Transaction.Status.Confirmed,
              }),
          );
        } catch (e) {
          console.log(`[track account] Failed: ${e}`);
          return [];
        }
      };
  }

  fetchAccountTransactions(wallet: Wallet) {
    return () => async (account: Account) => {
      const accountSpec = wallet.accountManager.getCompleteAccountSpec(account.data.spec);
      const { bestHeight } = await wallet.getClient(accountSpec.chainId).blockchain();
      // @ts-ignore
      return this.fetchAccountTransactionsBefore(wallet)(async () => [])({
        account,
        blockno: bestHeight,
      });
    };
  }
}
