var Fishbowl = require('node-fishbowl').default;

var fb = new Fishbowl({
    host          : process.env.FB_HOST,
    IADescription : process.env.FB_DESCRIPTION,
    IAID          : process.env.FB_IAID,
    IAName        : process.env.FB_NAME,
    password      : process.env.FB_PASS,
    username      : 'node',
    bunyanLevel   : process.env.FB_BUNYAN
});

exports.send = function openFbOrders(final){
  for (i = 0; i < 9; i++){
    var position = Math.floor(Math.random()*final.length);
    fb.sendRequest({
      action: 'QuickShipRq',
      params: {
        SONumber: final[position].customerPO,
        ShipDate: final[position].dateCreated
        }
    },
    function (error, response) {
      if (error) {
        console.log("error", error)
      }
      else {
        console.log(response)
        console.log("attempted quickship")
      }
    })
  }
}
