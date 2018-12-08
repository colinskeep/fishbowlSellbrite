require('dotenv').config();
const superagent = require('superagent');

exports.get = async function shippedSbOrders(data) {
  var arr = [];
  var orderid = [];
  var qs = [];
  var date = new Date();
  date.setDate(date.getDate() - 3);
  let i;
    for (i = 0; i < 5; ++i){
      try{
        await superagent
          .get('https://api.sellbrite.com/v1/orders?page='+i+'&sb_payment_status=all&shipment_status=all')
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
          if(i == 4){
            for (var x = 0; x < data.length; x++){
              if(orderid.indexOf(data[x].customerPO) >  -1){
                qs.push({'customerPO': data[x].customerPO, 'dateCreated': data[x].dateCreated})
              }
              if(x === data.length - 1){
                return(qs)
              }
            }
          }
      } catch(err){console.log(err)}
    }
}
