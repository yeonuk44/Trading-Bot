const fs = require("fs");
const request = require("request");

function getMarketsInfo() {
  const options = {
    method: "GET",
    url: "https://api.upbit.com/v1/market/all?isDetails=false",
    headers: { accept: "application/json" },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        try {
          const responseBody = JSON.parse(body);
          // 결과값을 JSON 파일에 저장
          const jsonResult = JSON.stringify(responseBody, null, 2);
          fs.writeFileSync("./markets_info.json", jsonResult);

          resolve(responseBody);
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

module.exports = {
  getMarketsInfo,
};
