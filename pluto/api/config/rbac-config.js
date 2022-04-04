'use strict';
module.exports = {
   "manufacturer": {
      "can": [

         "POST:/product",
         // "PUT:/product",
         // "GET:/product/*",
         // "GET:/productlist",


         "GET:/productprofilebybrand/*",
         "GET:/factory" + "*",
         // "GET:/images/*",
         // "GET:/imageslist",
         // "POST:/images",
         // "PUT:/images",

         "GET:/manufacturer",
         // "GET:/manufacturerlist",
         // "POST:/manufacturer",
         // "PUT:/manufacturer",

         // "GET:/tag/*",
         // "GET:/taglist",
         // "POST:/tag",
         // "PUT:/tag",
         // "GET:/brandbymanufacturer"
         "GET:/productsbybrand/*"
      ]
   },
   "retailer": {
      "can": [
         // "GET:/images/*",
         // "GET:/imageslist",

         "GET:/retailer",
         // "GET:/retailerlist",
         // "POST:/retailer",
         // "PUT:/retailer",
         "POST:/authenticatetag",
         "GET:/tag/*",
         "GET:/taglist",
         "POST:/tag",
         "PUT:/tag",
         "GET:/scantag/*",
         "GET:/transaction/*",
         "GET:/transactionlist",
         "POST:/transaction",
         "PUT:/transaction",
         "POST:/email",
         "PUT:/verifyemail",
         "GET:/productlist",
         "GET:/scanproductcode/*",
         "GET:/salescantag/*"
      ]
   },
   "consumer": {
      "can": [
         "POST:/verifycert",
         "POST:/email",
         "PUT:/verifyemail"
      ]
   },
   "tagsupplier": {
      "can": [
         "GET:/tagsupplier",
         "GET:/brand/*",
         "GET:/untaggedproducts/*",
         // "GET:/tagsupplierlist",
         // "POST:/tagsupplier",
         // "PUT:/tagsupplier",
         // "POST:/untaggedproducts",
         // "GET:/factory" + "*",
         //"GET:/brand" + "*",

         // "GET:/tag/*",
         // "GET:/taglist",
         "POST:/tag",
         //"PUT:/tag"
      ]
   },
   "factory": {
      "can": [
         "GET:/unshippedproducts",
         "GET:/brand" + "*",
         "GET:/factory",
         "GET:/unassignedtags/*",
         "GET:/untaggedproducts/*",
         "POST:/assigntagtoproduct",
         "PUT:/product",
         "POST:/tag",
         "POST:/scanbyid"
      ]
   },
   "warehouse": {
      "can": [
         "POST:/scan",
         "POST:/scanbyid"
      ]
   },
   "admin": {
      "can": [
         "POST:/brand",
         "POST:/factory",
         "POST:/manufacturer",
         "PUT:/manufacturer",
         "POST:/tagsupplier",
         "POST:/retailer",
         "POST:/productprofile",
         "PUT:/productprofile",
         "GET:/retailerlist"
         // "GET:/brand/*",
         // "GET:/brandlist",

         // "PUT:/brand",
         // "GET:/productprofilelist",

         // "PUT:/productprofile",
         // "GET:/productprofile/*",

         // "GET:/productprofilesignature/*",
         // "GET:/productprofilesignaturelist",
         // "POST:/productprofilesignature",
         // "PUT:/productprofilesignature"
      ]
   }
}