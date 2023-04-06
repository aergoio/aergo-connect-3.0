import {
  AergoClient,
  Address,
  Contract,
  // @ts-ignore
  GrpcWebProvider,
} from '@herajs/client';
import { ensureDelay } from 'timed-async';

export const getContractMethodResult = async (
  nodeURL: string,
  method: string,
  contractAddress: string,
  args?: any,
) => {
  const aergo = await new AergoClient({}, new GrpcWebProvider({ url: nodeURL }));
  const abi = await ensureDelay(aergo.getABI(contractAddress));
  const address = await new Address(contractAddress);
  const contract = await Contract.fromAbi(abi).setAddress(address);
  return await ensureDelay(aergo.queryContract(contract.functions[method](...args)));
};
