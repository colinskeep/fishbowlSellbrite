require('dotenv').config();
const mysql = require('mysql2/promise');
const bluebird = require('bluebird');
const convertDate = require('./convertDate.js');

exports.get = async function mapSalesOrder(data){
  const connection = await mysql.createConnection({host: 'localhost', user: 'root', password: process.env.MY_PW, database: 'mysql', Promise: bluebird});
  let arr = [];
  var socount = 0;
  for(i = 0; i < data.length; i++){
    for(x = 0; x < data[i].items.length; x++){
      const [rows,fields] = await connection.execute(`SELECT fbsku, sbsku, isfba FROM legend WHERE sbsku = '${data[i].items[x].sku}' AND fbsku != ''`);
      try{
        let date = await convertDate.get(data[i].ordered_at);
        var location = rows.length != 0 ?
          rows[0].isfba === 'TRUE' ?
            'FBA':'Main'
          :console.log("couldn't import row no map: ", data[i].display_ref);
        if(data[i].shipping_country_code === 'MY' || data[i].shipping_country_code === 'SE' || data[i].shipping_country_code === 'NZ'){
          data[i].shipping_country_code = 'US';
          data[i].shipping_state_region = '';
        }
        // data[i].shipping_country_code === 'MY' || data[i].shipping_country_code === 'SE' || data[i].shipping_country_code === 'NZ' ?
        //   ()=>{
        //     data[i].shipping_country_code = 'US';
        //     data[i].shipping_state_region = '';
        //   } : null;
        if(x == rows.length - 1 && data[i].display_ref.startsWith('S') == false){
          if(socount == 0){
            arr.push('"Flag","SONum","Status","CustomerName","CustomerContact","BillToName","BillToAddress","BillToCity","BillToState","BillToZip","BillToCountry","ShipToName","ShipToAddress","ShipToCity","ShipToState","ShipToZip","ShipToCountry","ShipToResidential","CarrierName","TaxRateName","PriorityId","PONum","VendorPONum","Date","Salesman","ShippingTerms","PaymentTerms","FOB","Note","QuickBooksClassName","LocationGroupName","FulfillmentDate","URL","CarrierService","DateExpired","Phone","Email","CF-Custom"');
            arr.push('"Flag","SOItemTypeID","ProductNumber","ProductDescription","ProductQuantity","UOM","ProductPrice","Taxable","TaxCode","Note","QuickBooksClassName","FulfillmentDate","ShowItem","KitItem","RevisionLevel"');
          }
          arr.push('"SO","'+data[i].display_ref+'",20,"'+data[i].channel_name+'","'+data[i].shipping_contact_name.replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'')+'","'+data[i].shipping_contact_name.replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'')+'","'+data[i].shipping_address_1.replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'')+'","'+data[i].shipping_city.replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'')+'","'+data[i].shipping_state_region.replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'')+'","'+data[i].shipping_postal_code+'","'+data[i].shipping_country_code+'","'+data[i].shipping_contact_name.replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'')+'","'+data[i].shipping_address_1.replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'')+'","'+data[i].shipping_city.replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'')+'","'+data[i].shipping_state_region.replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'')+'","'+data[i].shipping_postal_code+'","'+data[i].shipping_country_code+'","FALSE","Will Call","None","30","'+data[i].display_ref+'","'+data[i].display_ref+'","'+date+'","admin","Prepaid","COD","Origin",,"None","'+location+'",,,,,,,')
          socount++
          for(let x = 0; x < data[i].items.length; x++){
            arr.push('"Item","10","'+rows[0].fbsku+'","'+data[i].items[x].title.replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'')+'","'+data[i].items[x].quantity+'","ea","'+data[i].items[x].unit_price+'","TRUE","NON",,"None",,"TRUE","FALSE"');
        }
      }
      if(socount == 10 || i== data.length -1){
          console.log("attempting to input ",socount," orders");
          return(arr)
          socount = 0;
       }
     }catch(error){console.log(error)}
    }
  }
}
