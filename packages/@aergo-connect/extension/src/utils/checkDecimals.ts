/* eslint-disable no-extend-native */
// import {} from "Prototype";

const re = /^([0-9]+)([.]([0-9]+))?$/;
//! BigInt로 바꿈, 토큰 단위값(사용자)을 BIGINT로 바꿔주는 함수
export function parseToBigInt(input: string, decimals: number) {
  const matched = input.match(re);
  if (matched === null) {
    return null;
  }
  // 정수부와 소수부 분리하고 앞뒤 필요없는 0 제거
  const integerPart = matched[1].replace(/^0+/, '');
  let fractionPart = matched[3];
  if (fractionPart == null) {
    fractionPart = '';
  }
  fractionPart = fractionPart.replace(/0+$/, '');

  // 소숫점 자리만큼 0 채우기
  if (fractionPart.length >= decimals) {
    fractionPart = fractionPart.substr(0, decimals);
  } else if (fractionPart.length < decimals) {
    const fillCount = decimals - fractionPart.length;
    for (let i = 0; i < fillCount; i++) {
      fractionPart += '0';
    }
  }
  return BigInt(integerPart + fractionPart);
} // ? 단위 변환

function printParsed(input: string, decimals: number) {
  const vals = parseToBigInt(input, decimals);
  //   global.console.log(`${input}(${decimals}):=>  ${vals}`);
}

Number.prototype.countDecimals = function () {
  if (Math.floor(this.valueOf()) === this.valueOf()) return 0;

  return this.toString().countDecimals();
};

String.prototype.countDecimals = function () {
  if (this.indexOf('.') !== -1 && this.indexOf('-') !== -1) {
    return this.split('-')[1] || 0;
  }
  if (this.indexOf('.') !== -1) {
    return this.split('.')[1].length || 0;
  }
  return this.split('-')[1] || 0;
};

// userRatioX,Y 는 string, decimalsX,Y는 숫자
function Swapper(userRatioX: string, userRatioY: string, decimalsX: number, decimalsY: number) {
  // ? 환전할때, 사용 할 것 같음. contract payload
  const digitRX = userRatioX.countDecimals();
  const digitRY = userRatioY.countDecimals();
  const minimumScale = Math.max(digitRX, digitRY);
  const smallerDecimals = Math.min(decimalsX, decimalsY);
  // 사용자 입력에 포함된 소숫점을 올리기 위한 최소 수준
  let scaleX = decimalsX - smallerDecimals;
  let scaleY = decimalsY - smallerDecimals;
  if (minimumScale > 0) {
    scaleX += minimumScale;
    scaleY += minimumScale;
  }

  const ratioX = parseToBigInt(userRatioX, scaleX);
  const ratioY = parseToBigInt(userRatioY, scaleY);

  return {
    userRatioX,
    userRatioY,
    ratioX,
    ratioY,
    decimalsX,
    decimalsY,
    magnitudeX: BigInt(10) ** BigInt(decimalsX),
    magnitudeY: BigInt(10) ** BigInt(decimalsY),
    // Y를 넣었을 때 받게되는 X의 예상 수량
    getAmountX(amountY: bigint) {
      return (amountY * ratioX) / ratioY;
    },
    // X를 넣었을 때 받게되는 Y의 예상 수량
    getAmountY(amountX: bigint) {
      return (amountX * ratioY) / ratioX;
    },
    toChainAmountX(userAmount: number) {
      return parseToBigInt(userAmount.toString(), this.decimalsX);
    },
    toChainAmountY(userAmount: number) {
      return parseToBigInt(userAmount.toString(), this.decimalsY);
    },
    normalizedRatioY() {
      return (
        Number.parseFloat(bigIntToString(this.ratioY, this.decimalsY)) /
        Number.parseFloat(bigIntToString(this.ratioX, this.decimalsX))
      );
    },
  };
}

const zeros = '00000000000000000000';
export function bigIntToString(bigInt: bigint, decimals: number) {
  const magnitute = BigInt(10) ** BigInt(decimals);
  const intPart = bigInt / magnitute;
  const rawFractal = bigInt % magnitute;
  if (rawFractal !== 0n) {
    const rawFractalStr = rawFractal.toString();
    const toPad = decimals - rawFractalStr.length;
    const zeroPadFractal = zeros.substr(0, toPad) + rawFractalStr.replace(/0+$/, '');
    return `${intPart}.${zeroPadFractal}`;
  }
  return intPart.toString();
}

// function testSwap(
//   s: {
//     userRatioX?: string;
//     userRatioY?: string;
//     ratioX?: bigint;
//     ratioY?: bigint;
//     decimalsX?: number;
//     decimalsY?: number;
//     magnitudeX?: bigint;
//     magnitudeY?: bigint;
//     getAmountX: any;
//     getAmountY: any;
//     toChainAmountX: any;
//     toChainAmountY: any;
//   },
//   x: string,
//   y: string,
// ) {
//   global.console.log(
//     `${x}:${y}  ==>   ${s.getAmountX(s.toChainAmountY(y))} : ${s.getAmountY(
//       s.toChainAmountX(x),
//     )}`,
//   );
// }
// const s = Swapper("1", "100", 18, 18);
// testSwap(s, "44", "4400");
// s = Swapper("300", "125", 18, 18);
// testSwap(s, "750", "312.5");
// s = Swapper("3", "1.25", 18, 18);
// testSwap(s, "750", "312.5");
// s = Swapper("1", "1.1415", 18, 18);
// testSwap(s, "33", "37.6695");
// s = Swapper("20", "1.1415", 18, 18);
// testSwap(s, "660", "37.6695");

// s = Swapper("1", "1.1415", 1, 9);
// testSwap(s, "3.311111", "3.76695");
// s = Swapper("1", "100", 1, 9);
// testSwap(s, "44", "4400");
// s = Swapper("300", "125", 1, 9);
// testSwap(s, "750", "312.5");
