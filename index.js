const accountsInfo = require("./apis/assets");

accountsInfo
  .getAllAccountsInfo()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
