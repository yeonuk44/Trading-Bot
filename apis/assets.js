const token = require("./common/index");

const dotenv = require("dotenv");
dotenv.config();

const request = require("request");

function getAllAccountsInfo() {
  const server_url = process.env.UPBIT_OPEN_API_SERVER_URL;

  const options = {
    method: "GET",
    url: server_url + "/v1/accounts",
    headers: { Authorization: `Bearer ${token.getToken()}` },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}

module.exports = {
  getAllAccountsInfo,
};
