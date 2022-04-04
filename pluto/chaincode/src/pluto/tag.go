package main

import (
	"bytes"
	"crypto/sha256"
	"cycoreutils"
	"fmt"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/pkg/errors"
)

var TagLogger = shim.NewLogger("Tag")

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record Tag to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordTag(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Avalbytes []byte
	var Tag = &Tag{}

	// Convert the arg to a recordTag object
	TagLogger.Info("recordTag() : Arguments for recordTag : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Tag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
	}

	Tag.ObjectType = "Tag"
	Tag.Status = "created"
	// Query and Retrieve the Full recordTag
	keys := []string{Tag.TagID}
	TagLogger.Debug("Keys for Tag %s: ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Tag.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Tag object")).Error(), nil)
	}

	if Avalbytes != nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("Tag already exists"), nil)
	}

	TagBytes, _ := cycoreutils.ObjecttoJSON(Tag)

	err = cycoreutils.UpdateObject(stub, Tag.ObjectType, keys, TagBytes, collectionName)

	if err != nil {
		TagLogger.Errorf("recordTag() : Error inserting Tag object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Tag object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded Tag object"), TagBytes)
}

//////////////////////////////////////////////////////////////
/// Query Tag Info from the ledger
//////////////////////////////////////////////////////////////
func queryTag(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var Avalbytes []byte
	var collectionName string
	var Tag = &Tag{}

	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Tag ID}. Received %d arguments", len(args)), nil)
	}

	Tag.ObjectType = "Tag"

	err = cycoreutils.JSONtoObject([]byte(args[0]), Tag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
	}

	// Query and Retrieve the Full Tag
	keys := []string{Tag.TagID}
	TagLogger.Info("Keys for Tag : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Tag.ObjectType, keys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Tag object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Tag not found"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, Tag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to Tag object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Tag object"), Avalbytes)
}

//////////////////////////////////////////////////////////////
/// Query Tag List from the ledger
//////////////////////////////////////////////////////////////
func queryTagList(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var collectionName string
	collectionName = ""

	queryString := fmt.Sprintf("{\"selector\":{\"objectType\":\"Tag\"}}")
	TagLogger.Info("Query List: queryString: ", queryString)

	queryResults, err := cycoreutils.GetQueryResultForQueryString(stub, queryString, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY006E", (errors.Wrapf(err, "Failed to query Tag object list")).Error(), nil)
	}

	if queryResults == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("No Tag record found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY007S", fmt.Sprintf("Successfully Retrieved the list of Tag objects "), queryResults)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Update Tag to the ledger by getting a copy of it, updating that copy, and overwriting the original to a newer version
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func updateTag(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var collectionName string

	var Tag = &Tag{}
	// Convert the arg to a updateTag object
	TagLogger.Info("updateTag() : Arguments for Query: Tag : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Tag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
	}
	Tag.ObjectType = "Tag"
	// Query and Retrieve the Full updateTag
	keys := []string{Tag.TagID}
	TagLogger.Info("Keys for Tag : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Tag.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Tag object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Tag does not exist to update"), nil)
	}

	TagBytes, _ := cycoreutils.ObjecttoJSON(Tag)

	err = cycoreutils.UpdateObject(stub, Tag.ObjectType, keys, TagBytes, collectionName)

	if err != nil {
		TagLogger.Errorf("updateTag() : Error updating Tag object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Tag object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTUPD010S", fmt.Sprintf("Successfully Updated Tag object"), TagBytes)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Delete Tag from the ledger.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func deleteTag(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	ObjectType := "Tag"
	var collectionName string
	var Tag = &Tag{}

	collectionName = ""

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Tag ID}. Received %d arguments", len(args)), nil)
	}
	// Convert the arg to a deleteTag object
	TagLogger.Info("deleteTag() : Arguments for Query: Tag : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Tag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
	}

	// Query and Retrieve the Full deleteTag
	keys := []string{Tag.TagID}
	TagLogger.Info("Keys for Tag : ", keys)

	err = cycoreutils.DeleteObject(stub, ObjectType, keys, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTDEL012E", (errors.Wrapf(err, "Failed to delete Tag object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTDEL013I", fmt.Sprintf("Successfully Deleted Tag object"), nil)
}

//////////////////////////////////////////////////////////////
/// Query Tag History from the ledger
//////////////////////////////////////////////////////////////
func queryTagHistory(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var Tag = &Tag{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Tag ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Tag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
	}

	// Query and Retrieve the Full Tag
	keys := []string{Tag.TagID}
	TagLogger.Info("Keys for Tag : ", keys)

	Avalbytes, err = cycoreutils.GetObjectHistory(stub, "Tag", keys)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Tag object history")).Error(), nil)
	}
	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Tag object not found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY014S", fmt.Sprintf("Successfully Queried Tag object History"), Avalbytes)
}

func queryTagsbyBrand(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var tagBytes []byte
	var Brand = &Brand{}

	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Brand ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Brand)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Brand object")).Error(), nil)
	}

	var richQuery = richQuery{}
	richQuery.ObjectType = "Tag"

	var field1 = queryField{}
	field1.FieldName = "tagTechnology"
	field1.Operator = "$regex"
	field1.FieldValue = Brand.TagTechnology

	var field2 = queryField{}
	field2.FieldName = "productID"
	field2.Operator = "$eq"
	field2.FieldValue = ""

	richQuery.QueryFields = []queryField{field1, field2}

	tagBytes, err = invokeRichQuery(richQuery, stub)
	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Tag object")).Error(), nil)
	}

	if len(tagBytes) < 3 {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Tags not found"), nil)
	}

	TagLogger.Info("queryTag() : Returning Tag results")
	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Tag object"), tagBytes)
}

func recordTagforProduct(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Avalbytes []byte
	var Tag = &Tag{}
	var Product = &Product{}
	var productBytes []byte
	var updatedproductBytes []byte
	// Convert the arg to a recordTag object
	TagLogger.Info("recordTag() : Arguments for recordTag : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Tag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
	}

	//update the product with the tag id
	// Query and Retrieve the Full Product
	productkeys := []string{Tag.ProductID}
	ProductLogger.Info("Keys for Product : ", productkeys)

	productBytes, err = cycoreutils.QueryObject(stub, "Product", productkeys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product object")).Error(), nil)
	}

	if productBytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
	}

	err = cycoreutils.JSONtoObject(productBytes, Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
	}

	//generate the hash and sent to the node to generate the QR code

	hashSum, err := generateHash([]string{Tag.TagTechnology, Product.ManufacturerID, Product.FactoryID, Product.ProductID, Product.BrandID, Product.ManufactureDate}, []int{1, 0, 2, 3, 4, 5})
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Printf("Hash = %s\n", hashSum)
	}

	//record Tag
	Tag.ObjectType = "Tag"
	Tag.Status = "assigned"
	Tag.Hash = hashSum
	Tag.TagID = hashSum

	// Query and Retrieve the Full recordTag
	keys := []string{Tag.TagID}
	TagLogger.Debug("Keys for Tag %s: ", keys)
	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Tag.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Tag object")).Error(), nil)
	}

	if Avalbytes != nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("Tag already exists"), nil)
	}

	TagBytes, _ := cycoreutils.ObjecttoJSON(Tag)

	err = cycoreutils.UpdateObject(stub, Tag.ObjectType, keys, TagBytes, collectionName)

	if err != nil {
		TagLogger.Errorf("recordTag() : Error inserting Tag object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Tag object update failed")).Error(), nil)
	}

	Product.TagID = Tag.TagID
	updatedproductBytes, _ = cycoreutils.ObjecttoJSON(Product)

	err = cycoreutils.UpdateObject(stub, "Product", productkeys, updatedproductBytes, collectionName)

	if err != nil {
		ProductLogger.Errorf("updateProduct() : Error updating Product object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Product object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded Tag object"), TagBytes)
}

func generateHash(args []string, pattern []int) (string, error) {

	//Check Argument count
	if len(args) > len(pattern) {
		return "", errors.New("Not Enough Arguments")
	}

	var buffer bytes.Buffer

	for i := 0; i < len(args); i++ {
		buffer.WriteString(args[pattern[i]])
	}

	// Generate string based on pattern for hashing
	fmt.Println(buffer.String())

	// Generate sha256 Hash of the string
	sum := sha256.Sum256(buffer.Bytes())
	fmt.Printf("Hash = %x\n", sum)
	fmt.Printf("Length = %d\n", len(sum))

	// Return Hash
	return fmt.Sprintf("%x", sum), nil

}

// func scanTag(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
// 	var err error
// 	var collectionName string

// 	var InputTag = &Tag{}
// 	var Tag = &[]Tag{}
// 	var productBytes []byte
// 	var tagBytes []byte
// 	var brandBytes []byte
// 	var profileBytes []byte
// 	var retailerBytes []byte
// 	var manufacturerBytes []byte
// 	var ProductDetail = &ProductDetail{}
// 	var ProductStyle = &ProductStyle{}
// 	var Brand = &Brand{}
// 	var Manufacturer = &Manufacturer{}
// 	var Retailer = &Retailer{}
// 	var Images = &Images{}

// 	var productkeys []string
// 	// Convert the arg to a recordTag object
// 	TagLogger.Info("recordTag() : Arguments for scanTag : ", args[0])
// 	err = cycoreutils.JSONtoObject([]byte(args[0]), InputTag)
// 	if err != nil {
// 		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
// 	}

// 	var richQuery = richQuery{}
// 	richQuery.ObjectType = "Tag"

// 	var field1 = queryField{}
// 	field1.FieldName = "hash"
// 	field1.Operator = "$eq"
// 	field1.FieldValue = InputTag.Hash

// 	richQuery.QueryFields = []queryField{field1}

// 	tagBytes, err = invokeRichQuery(richQuery, stub)
// 	if err != nil {
// 		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query tag object")).Error(), nil)
// 	}

// 	if len(tagBytes) < 3 {
// 		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
// 	}

// 	err = cycoreutils.JSONtoObject(tagBytes, Tag)
// 	if err != nil {
// 		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
// 	}

// 	for _, tag := range *Tag {
// 		productkeys = []string{tag.ProductID}
// 	}

// 	//query the product
// 	ProductLogger.Info("Keys for Product : ", productkeys)

// 	productBytes, err = cycoreutils.QueryObject(stub, "Product", productkeys, collectionName)

// 	if err != nil {
// 		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product object")).Error(), nil)
// 	}

// 	if productBytes == nil {
// 		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
// 	}

// 	logger.Infof("productBytes", productBytes)

// 	err = cycoreutils.JSONtoObject(productBytes, ProductDetail)
// 	if err != nil {
// 		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
// 	}

// 	if len(ProductDetail.ImageIDs) > 0 {
// 		encodedImageStrings := []string{}
// 		for i := 0; i < len(ProductDetail.ImageIDs); i++ {
// 			imageArgs := []string{"{\"imageID\":\"" + ProductDetail.ImageIDs[i] + "\"}"}
// 			imageResponse := queryImages(stub, imageArgs)
// 			err = cycoreutils.JSONtoObject([]byte(imageResponse.ObjectBytes), Images)
// 			encodedImageStrings = append(encodedImageStrings, Images.ImageString)
// 		}
// 		ProductDetail.ImageStrings = append(ProductDetail.ImageStrings, encodedImageStrings...)
// 	}

// 	//query the brand
// 	brandkeys := []string{ProductDetail.BrandID}
// 	ProductLogger.Info("Keys for Brand : ", brandkeys)

// 	brandBytes, err = cycoreutils.QueryObject(stub, "Brand", brandkeys, collectionName)

// 	if err != nil {
// 		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Brand object")).Error(), nil)
// 	}

// 	if brandBytes == nil {
// 		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
// 	}

// 	logger.Infof("brandBytes", brandBytes)
// 	err = cycoreutils.JSONtoObject(brandBytes, Brand)
// 	if err != nil {
// 		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
// 	}

// 	//query the productprofile
// 	profilekeys := []string{ProductDetail.ProfileID}
// 	ProductLogger.Info("Keys for Product Profile : ", profilekeys)

// 	profileBytes, err = cycoreutils.QueryObject(stub, "ProductStyle", profilekeys, collectionName)

// 	if err != nil {
// 		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query profile object")).Error(), nil)
// 	}

// 	if profileBytes == nil {
// 		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product Profile not found"), nil)
// 	}

// 	logger.Infof("profileBytes", profileBytes)

// 	err = cycoreutils.JSONtoObject(profileBytes, ProductStyle)
// 	if err != nil {
// 		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
// 	}

// 	if len(ProductStyle.ImageIDs) > 0 {
// 		encodedImageStrings := []string{}
// 		for i := 0; i < len(ProductStyle.ImageIDs); i++ {
// 			imageArgs := []string{"{\"imageID\":\"" + ProductStyle.ImageIDs[i] + "\"}"}
// 			imageResponse := queryImages(stub, imageArgs)
// 			err = cycoreutils.JSONtoObject([]byte(imageResponse.ObjectBytes), Images)
// 			encodedImageStrings = append(encodedImageStrings, Images.ImageString)
// 		}
// 		ProductDetail.ImageStrings = append(ProductDetail.ImageStrings, encodedImageStrings...)
// 	}

// 	//query the manufacturer
// 	manufacturerKeys := []string{ProductDetail.ManufacturerID}
// 	manufacturerBytes, err = cycoreutils.QueryObject(stub, "Manufacturer", manufacturerKeys, collectionName)

// 	if err != nil {
// 		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Manufacturer object")).Error(), nil)
// 	}

// 	if manufacturerBytes == nil {
// 		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Manufacturer not found"), nil)
// 	}

// 	logger.Infof("manufactureBytes", manufacturerBytes)
// 	err = cycoreutils.JSONtoObject(manufacturerBytes, Manufacturer)
// 	if err != nil {
// 		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Manufcaturer object")).Error(), nil)
// 	}

// 	//query the retailer
// 	retailerKeys := []string{ProductDetail.RetailerID}
// 	retailerBytes, err = cycoreutils.QueryObject(stub, "Retailer", retailerKeys, collectionName)

// 	if err != nil {
// 		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Retailer object")).Error(), nil)
// 	}

// 	if retailerBytes == nil {
// 		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Retailer not found"), nil)
// 	}

// 	logger.Infof("retailerBytes", retailerBytes)
// 	err = cycoreutils.JSONtoObject(retailerBytes, Retailer)
// 	if err != nil {
// 		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Retailer object")).Error(), nil)
// 	}

// 	ProductDetail.Brand = *Brand
// 	ProductDetail.Profile = *ProductStyle
// 	ProductDetail.Manufacturer = *Manufacturer
// 	ProductDetail.Retailer = *Retailer
// 	ProductDetail.Tag = *Tag

// 	productdetailbytes, _ := cycoreutils.ObjecttoJSON(ProductDetail)
// 	if err != nil {
// 		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
// 	}
// 	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully queried product object"), productdetailbytes)
// }

func authenticateTag(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Authenticate = &Authenticate{}
	var InputTag = &Tag{}
	var Tag = &Tag{}
	var LedgerProduct = &Product{}
	var InputProduct = &Product{}
	var productBytes []byte
	var tagBytes []byte
	var tagKeys []string
	var productkeys []string
	// Convert the arg to a recordTag object
	TagLogger.Info("recordTag() : Arguments for authenticateTag : ", args[0], args[1])

	err = cycoreutils.JSONtoObject([]byte(args[0]), InputTag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[1]), InputProduct)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}

	productkeys = []string{InputProduct.ProductID}
	ProductLogger.Info("Keys for Product : ", productkeys)

	productBytes, err = cycoreutils.QueryObject(stub, "Product", productkeys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product object")).Error(), nil)
	}

	if productBytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
	}

	logger.Infof("productBytes", productBytes)

	err = cycoreutils.JSONtoObject(productBytes, LedgerProduct)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}

	if LedgerProduct.RetailerID == InputProduct.RetailerID {
		Authenticate.IsAuthentic = true
	} else {
		Authenticate.IsAuthentic = false
	}

	tagKeys = []string{LedgerProduct.TagID}
	ProductLogger.Info("Keys for Tag : ", tagKeys)

	tagBytes, err = cycoreutils.QueryObject(stub, "Tag", tagKeys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Tag object")).Error(), nil)
	}

	if tagBytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Tag not found"), nil)
	}

	err = cycoreutils.JSONtoObject(tagBytes, Tag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
	}

	if strings.EqualFold(Tag.Status, "deactivated") {
		return cycoreutils.ConstructResponse("STAGAUTH001E", fmt.Sprintf("Tag already deactivated.Cannot authenticate tag"), nil)
	}

	hashSum, err := generateHash([]string{Tag.TagTechnology, LedgerProduct.ManufacturerID, LedgerProduct.FactoryID, LedgerProduct.ProductID, LedgerProduct.BrandID, LedgerProduct.ManufactureDate}, []int{1, 0, 2, 3, 4, 5})
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Printf("Hash = %s\n", hashSum)
	}

	if hashSum == InputTag.Hash {
		Authenticate.IsAuthentic = true
	} else {
		Authenticate.IsAuthentic = false
	}

	logger.Infof("Authenticate.IsAuthentic", Authenticate.IsAuthentic)
	authenticatebytes, _ := cycoreutils.ObjecttoJSON(Authenticate)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to authenticate object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SAUTH001S", fmt.Sprintf("Successfully sending authentication object"), authenticatebytes)
}
