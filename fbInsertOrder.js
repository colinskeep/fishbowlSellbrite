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

exports.send = (mappedso) => {
    async function insertOrder() {
        const request = {
            action: 'ImportRq',
            params: {
              Type: 'ImportSalesOrder',
                Rows: {
                  Row:
                      mappedso
                  }
            }
        }
        const results = await fb.sendRequest(request, function (err, res) {
            if (err) {
                console.log(err);
                  for (i = 0; i < mappedso.length; i++){
                    console.log(mappedso[i])
                  }
            }
            else {
                console.log(res);
                return res;
            }
        });
    }
    insertOrder();
}
