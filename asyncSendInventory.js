require('dotenv').config();
const superagent = require('superagent');

exports.send = async function retrieveEdited(data) {
  for (i = 0; i < data.length; i++){
    try{
      let response = await superagent
        .put('https://api.sellbrite.com/v1/inventory')
        .set('Authorization', process.env.APIKEY)
        .set('Content-Type', 'application/json')
        .send({ 'inventory': data[i] });
      return (response)
    }catch(error){console.log(error.response.res.text)}
  }
}
