const tradingToken = require("./constant");
const accountsInfo = require("./apis/assets");
const orderCryptocurrency = require("./apis/order");
const getCandlesInfo = require("./apis/ticker");
const oneTimeFunction = require("./apis/market");

/**
 * INFO:
 * Get markets info & Save result value to JSON file
 */
// oneTimeFunction.getMarketsInfo();

async function findKRW() {
  const getAllAccountsInfo = await accountsInfo.getAllAccountsInfo();
  const isCurrency = getAllAccountsInfo.map((item) => item.currency);
  for (let i = 0; i < isCurrency.length; i++) {
    if (isCurrency[i] === `${tradingToken.TRADING_TOKEN.krw}`) {
      return i;
    }
  }
}

async function findMainToken() {
  const getAllAccountsInfo = await accountsInfo.getAllAccountsInfo();
  const isCurrency = getAllAccountsInfo.map((item) => item.currency);
  for (let i = 0; i < isCurrency.length; i++) {
    if (isCurrency[i] === tradingToken.TRADING_TOKEN.mainToken) {
      return i;
    }
  }
}

/**
 * INFO:
 * Trading Bot
 *
 * TODO:
 * 1. Currently, the bot trades in minute timeframes, so if you're looking for a short hit, you'll need to fetch information and trade in secondary timeframes.
 * 2. When you change the coin type and market type, you have to manually change everything. We need to create a constants file to manage the variables globally so that we can automate it.
 *
 * IF: Change trading token
 * 1. (*) Change the token in constant.js file ref. in the markets.js file
 * 2. ( ) Change period and multiplier in bb.js
 * 3. ( ) Change Query String(count) in ticker.js/getDailyCandlesInfo function
 * 4. ( ) Change your buy and sell ratios to account for risk
 */

async function fetchData() {
  try {
    const tradingToken = require("./constant");
    const dailyFetchData = await getCandlesInfo.getDailyCandlesInfo();

    console.log("----------------------------------------------------");
    console.log("Daily BB Value: ");
    console.log(dailyFetchData);
    console.log("----------------------------------------------------");

    const upperBand = dailyFetchData["Upper Band"];
    const middleBand = dailyFetchData["Middle Band"];
    const lowerBand = dailyFetchData["Lower Band"];

    let getAllAccountsInfo = await accountsInfo.getAllAccountsInfo();
    const isCurrency = getAllAccountsInfo.map((item) => item.currency);
    const isBalance = getAllAccountsInfo.map((item) => item.balance);
    const idxKRW = await findKRW();
    const idxMainToken = await findMainToken();
    const limitBalance = isBalance[idxKRW] / 2;

    console.log("보유중인 자산: ");
    console.log(getAllAccountsInfo);
    console.log("----------------------------------------------------");

    // 자산 운용 상한선 기준: 내 자산의 50%까지만 가용
    /**
     * TODO:
     * 내 자산의 기준으로 비교할 때, 보유한 토큰의 KRW 가치도 포함하여 총 자산에서 가용 자산을 분별할 수 있게 해야함.
     */
    if (isCurrency[idxKRW] === tradingToken.TRADING_TOKEN.krw) {
      console.log(
        `보유중인 ${tradingToken.TRADING_TOKEN.krw}: ${isBalance[idxKRW]}`
      );
      console.log("현재 가용 자산의 금액(KRW): " + limitBalance);
    } else {
      console.log(`더 이상 ${tradingToken.TRADING_TOKEN.krw}가 없습니다.`);
      return;
    }

    // API Call every minute
    const minuteInterval = setInterval(async () => {
      const minuteFetchData = await getCandlesInfo.getMinuteCandleInfo();
      const minuteCandlePrice = minuteFetchData.map((item) => item.price);
      const minuteCandleTime = minuteFetchData.map((item) => item.time);

      console.log("====================================================");
      console.log(
        minuteCandleTime + " 종가: " + minuteCandlePrice + " 입니다."
      );
      /**
       * INFO:
       * 매매 프로세스
       */
      if (minuteCandlePrice <= lowerBand * 1.001) {
        // 1. BB의 Lower Band 보다 가격이 낮을 때 구매
        console.log("====================================================");
        console.log(
          lowerBand * 1.01 +
            " lowerBand의 가격에 근접한 종가로 현재 종가는 " +
            minuteCandlePrice +
            " 입니다."
        );

        if (limitBalance > isBalance[idxKRW]) {
          console.log("====================================================");
          console.log(
            `더 이상 ${tradingToken.TRADING_TOKEN.krw}가 없습니다. 현재 가용 자산은 ${isBalance[idxKRW]} 입니다.`
          );
          console.log("보유중인 자산: ");
          console.log(getAllAccountsInfo);
          // 트레이딩 봇 종료
          // clearInterval(minuteInterval);
        } else if (
          isCurrency[idxKRW] === tradingToken.TRADING_TOKEN.krw &&
          isBalance[idxKRW] > 5000
        ) {
          console.log("====================================================");
          // 매수 주문
          const bidBody = {
            market: `${tradingToken.TRADING_TOKEN.krw}-${tradingToken.TRADING_TOKEN.mainToken}`,
            side: "bid",
            price: "42000",
            ord_type: "price",
          };
          await orderCryptocurrency
            .bidOrderCryptocurrency(bidBody)
            .then((result) => {
              console.log(
                `${bidBody.price}${tradingToken.TRADING_TOKEN.krw} 만큼의 ${tradingToken.TRADING_TOKEN.mainToken}를 매수했습니다.`
              );
              console.log(result);
              console.log("보유중인 자산: ");
              console.log(getAllAccountsInfo);
            })
            .catch((error) => {
              console.log("매매 실패");
              console.error(error);
            });
        }
      } else if (minuteCandlePrice >= upperBand * 0.975) {
        // 2. BB의 Upper Band 보다 가격이 높을 때 판매
        console.log("====================================================");
        console.log(
          upperBand +
            " upperBand의 가격에 근접한 종가로 현재 종가는 " +
            minuteCandlePrice +
            " 입니다."
        );
        // 토큰의 KRW 가치 환산 Response value가 없어 따로 계산
        let currentMainTokentoKRW = isBalance[idxMainToken]
          ? isBalance[idxMainToken]
          : 0 * minuteCandlePrice;
        console.log("====================================================");
        console.log(
          `현재 내가 가진 토큰의 ${
            tradingToken.TRADING_TOKEN.krw
          } 금액은 ${currentMainTokentoKRW}이고, 토큰의 메인 balance는 ${
            isBalance[idxMainToken] ? isBalance[idxMainToken] : 0
          } 입니다.`
        );
        if (
          isCurrency[idxMainToken] === tradingToken.TRADING_TOKEN.mainToken &&
          currentMainTokentoKRW > 5000
        ) {
          console.log("====================================================");
          // 매도 주문
          const askBody = {
            market: `${tradingToken.TRADING_TOKEN.krw}-${tradingToken.TRADING_TOKEN.mainToken}`,
            side: "ask",
            volume: isBalance[idxMainToken], // ratio setting: 0 ~ 1
            ord_type: "market",
          };
          await orderCryptocurrency
            .askOrderCryptocurrency(askBody)
            .then((result) => {
              console.log(
                `${currentMainTokentoKRW}만큼의 ${tradingToken.TRADING_TOKEN.mainToken}의 볼륨인 ${askBody.volume}을 시장가 매도했습니다.`
              );
              console.log(result);
              console.log("보유중인 자산: ");
              console.log(getAllAccountsInfo);
            })
            .catch((error) => {
              console.log("매매 실패");
              console.error(error);
            });
        }
      }
    }, 60000); //ms 단위, 1000ms to 1s
  } catch (error) {
    console.error(error);
  }
}

fetchData();
