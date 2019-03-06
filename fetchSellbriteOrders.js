require('dotenv').config();
const superagent = require('superagent');

exports.get = async function fetchSbOrders() {
  var arr = [];
  var orderid = [];

  var date = new Date();
  let fiveDaysAgo = date.setDate(date.getDate() - 5);
  fiveDaysAgo = new Date(fiveDaysAgo).toISOString();
  let i;
  let done;
    for (i = 1; i < 25; ++i){
      try{
        await superagent
          .get('https://api.sellbrite.com/v1/orders?min_ordered_at='+fiveDaysAgo+'&page='+i+'&sb_payment_status=all&limit=100')
          .set('Authorization', process.env.APIKEY)
          .then(res => {
            for (var m = 0; m < 100; m++){
              if(orderid.indexOf(res.body[m].display_ref) > -1){
                console.log('end of orders', i, m, arr.length)
                i == 24;
                m == 100;
              }else{
                orderid.push(res.body[m].display_ref)
                arr.push(res.body[m]);
              }
            }
          })
      } catch(err){}
      if(i == 24){
        return(arr);
      }
    }
}
