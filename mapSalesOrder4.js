const convertDate = require('./convertDate.js');
const db = require('./db.js');
const isFba = require('./isFba.js');
const diacritics = require('diacritics');

exports.get = async function mapSalesOrder(data){
  let arr = [];
  var socount = 0;
  const [rows,fields] = await db.execute(`SELECT * FROM fba`);
    for(i = 0; i < data.length; i++){
      try{
        console.log(i);
        let date = await convertDate.get(data[i].ordered_at);
        var fbaarr = [];
        const [rows,fields] = await db.execute(`SELECT sku FROM fba`);
        const location = await isFba.get(rows, data[i].items[0].sku);
        if(data[i].shipping_country_code !== 'US'){
          data[i].shipping_state_region = '';
        }
        if(data[i].display_ref.length > 24) {
          data[i].display_ref = data[i].display_ref.substring(8);
        }
        if (data[i].shipping_address_1 == null){
          data[i].shipping_address_1 = data[i].shipping_address_2
        }
        if(data[i].display_ref.startsWith('S') == false && data[i].items[0].inventory_sku != null && data[i].items[0].unit_price !== 0 && data[i].display_ref != '227653'){
          if(socount == 0){
            arr =  [];
            arr.push('"Flag","SONum","Status","CustomerName","CustomerContact","BillToName","BillToAddress","BillToCity","BillToState","BillToZip","BillToCountry","ShipToName","ShipToAddress","ShipToCity","ShipToState","ShipToZip","ShipToCountry","ShipToResidential","CarrierName","TaxRateName","PriorityId","PONum","VendorPONum","Date","Salesman","ShippingTerms","PaymentTerms","FOB","Note","QuickBooksClassName","LocationGroupName","FulfillmentDate","URL","CarrierService","DateExpired","Phone","Email","CF-Custom"');
            arr.push('"Flag","SOItemTypeID","ProductNumber","ProductDescription","ProductQuantity","UOM","ProductPrice","Taxable","TaxCode","Note","QuickBooksClassName","FulfillmentDate","ShowItem","KitItem","RevisionLevel"');
          }
          arr.push('"SO","'+data[i].display_ref+'",20,"'+data[i].channel_name+'","'+diacritics.remove(data[i].shipping_contact_name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'').replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, ''))+'","'+diacritics.remove(data[i].shipping_contact_name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'').replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, ''))+'","'+diacritics.remove(data[i].shipping_address_1.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'').replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, ''))+'","'+diacritics.remove(data[i].shipping_city.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,''))+'","'+diacritics.remove(data[i].shipping_state_region.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,''))+'","'+data[i].shipping_postal_code+'","'+data[i].shipping_country_code+'","'+diacritics.remove(data[i].shipping_contact_name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'').replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, ''))+'","'+diacritics.remove(data[i].shipping_address_1.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'').replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, ''))+'","'+diacritics.remove(data[i].shipping_city.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'').replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, ''))+'","'+diacritics.remove(data[i].shipping_state_region.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'').replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, ''))+'","'+data[i].shipping_postal_code+'","'+data[i].shipping_country_code+'","FALSE","Will Call","None","30","'+data[i].display_ref+'","'+data[i].display_ref+'","'+date+'","admin","Prepaid","COD","Origin",,"None","'+location+'",,,,,,,')
          socount++
          for(let x = 0; x < data[i].items.length && data[i].items[x].quantity > 0; x++){
            arr.push('"Item","10","'+data[i].items[x].inventory_sku+'","'+diacritics.remove(data[i].items[x].title.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/,/g, '').replace(/"/g, '').replace(/'/g, '').replace(/\./g,'').replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, ''))+'","'+data[i].items[x].quantity+'","ea","'+data[i].items[x].unit_price+'","TRUE","NON",,"None",,"TRUE","FALSE"');
          }
      } else {
        for (let v = 0; v < data[i].items.length && data[i].items[v].quantity > 0; v++) {
          if (data[i].items[v].inventory_sku == null  && data[i].display_ref.startsWith('S') == false){
            console.log(data[i].display_ref, data[i].items[v].sku, " needs to be mapped")
          }
        }
      }
      if(socount == 10 || (i == data.length -1 && data.length !== 0)){
          console.log("attempting to input ",socount," orders");
          socount = 0;
          return(arr);
       }
     }catch(err){console.log(err)}
    }
}
