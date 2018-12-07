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

exports.get = async function openFbOrders(){
  const request = {
      action: 'ExecuteQueryRq',
      params: {
        Query: "SELECT so.customerPO, so.dateCreated FROM SO WHERE so.statusid = '20'"
      }
  }
  try{
    const results = await fb.sendRequest(request, await function(err, res){
      if(err){
        console.log(err)
      }
      if(res){
        console.log(res)
        return(res);
      }
    });
  }catch(error){console.log(error)}
}
