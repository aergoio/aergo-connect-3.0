// @ts-ignore
import AergoClient, { GrpcWebProvider } from '@herajs/client';

const useGetTransactionReceipt = async (txId: string, nodeURL: string) => {
  const aergo = new AergoClient({}, new GrpcWebProvider({ url: nodeURL }));
  try {
    const callTx = await aergo.getTransactionReceipt(txId);
    return callTx;
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    }
  }
};

export const useGetTransactionInfo = async (txId: string, nodeURL: string) => {
  const aergo = new AergoClient({}, new GrpcWebProvider({ url: nodeURL }));
  try {
    const callTx = await aergo.getTransaction(txId);
    return callTx;
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    }
  }
};

export default useGetTransactionReceipt;
