const getToken = require('jsonwebtoken')

module.exports.verToken = function(token){
  return new Promise((resolve,reject) => {
    const info = getToken.verify(token.split(' ')[1],"123456");
    resolve(info);
  })
}
