const dotenv = require("dotenv");
dotenv.config();

const uuidv4 = require("uuid/v4");
const sign = require("jsonwebtoken").sign;

function getToken() {
  const access_key = process.env.UPBIT_OPEN_API_ACCESS_KEY;
  const secret_key = process.env.UPBIT_OPEN_API_SECRET_KEY;

  const payload = {
    access_key: access_key,
    nonce: uuidv4(),
  };

  const token = sign(payload, secret_key);

  return token;
}

module.exports = {
  getToken,
};
