const kCustomPromisifiedSymbol = Symbol('util.promisify.custom');

/**
 * This is util.promisify for functions with a callback signature of simply (result) => void;
 */
export function promisifySimple<Ret = any>(
  original: Function,
  context: any,
): (...args: any[]) => Promise<Ret> {
  if (typeof context === 'undefined') {
    context = {};
  }
  if (typeof original !== 'function') {
    throw new Error('original should be a function');
  }

  function fn(...args: any[]): Promise<Ret> {
    return new Promise((resolve, reject) => {
      try {
        original.call(context, ...args, (value: Ret) => {
          if (typeof value === 'object' && value !== null && 'error' in value) {
            // @ts-ignore
            reject(`${value.error}`);
          } else {
            resolve(value as Ret);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true,
  });
  return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(original));
}
