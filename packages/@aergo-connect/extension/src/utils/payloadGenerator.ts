export const payloadGenerator = (to: string, Name: string, Args: unknown, amount?: string) => {
  const payload = {
    type: 5,
    to,
    amount: amount || '0 aergo',
    limit: 0,
    payload_json: {
      Name,
      Args,
    },
  };
  return payload;
};
