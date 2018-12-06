require('dotenv').config();
const superagent = require('superagent');

exports.get = async function fetchSbOrders() {
  var arr = [];
  var orderid = [];
  var date = new Date();
  date.setDate(date.getDate() - 3);
  let i;
  let done;
    for (i = 0; i < 5; ++i){
      try{
        await superagent
          .get('https://api.sellbrite.com/v1/orders?=min_ordered_at='+date+'&page='+i+'&sb_payment_status=all')
          .set('Authorization', process.env.APIKEY)
          .then(res => {
            for (var m = 0; m < 100; m++){
              if(orderid.indexOf(res.body[m].display_ref) > -1){
                i == 4;
                m == 100;
              }else{
                orderid.push(res.body[m].display_ref)
                arr.push(res.body[m]);
              }
            }
          })
      } catch(err){}
      if(i == 4){
        return(arr);
      }
    }
}
