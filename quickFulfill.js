var Fishbowl = require('node-fishbowl').default;

var fb = new Fishbowl({
    host          : process.env.FB_HOST,
    IADescription : process.env.FB_DESCRIPTION,
    IAID          : process.env.FB_IAID,
    IAName        : process.env.FB_NAME,
    password      : process.env.FB_PASS,
    username      : process.env.FB_USER,
    bunyanLevel   : process.env.FB_BUNYAN
});

exports.send = function openFbOrders(final){
  for (i = 0; i < final.length; i++){
    fb.sendRequest({
      action: 'QuickShipRq',
      params: {
        SONumber: final[i].customerPO,
        ShipDate: final[i].dateCreated
        }
    },
    function (error, response) {
      if (error) {
        console.log("error", error)
      }
      else {
        console.log("attempted quickship")
      }
    })
  }
}
