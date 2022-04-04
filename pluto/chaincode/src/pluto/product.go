package main

import (
	"cycoreutils"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/pkg/errors"
)

var ProductLogger = shim.NewLogger("Product")

const TAG_TYPE_QR_CODE = "qrcode"

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record Product to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordProduct(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Avalbytes []byte
	var stylebytes []byte
	var Product = &Product{}
	var ProductStyle = &ProductStyle{}
	// Convert the arg to a recordProduct object
	ProductLogger.Info("recordProduct() : Arguments for recordProduct : ", args[0])

	if len(args) < 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Product ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}

	Product.ObjectType = "Product"

	// Query and Retrieve the Full recordProduct
	keys := []string{Product.ProductID}
	ProductLogger.Debug("Keys for Product %s: ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Product.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product object")).Error(), nil)
	}

	if Avalbytes != nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("Product already exists"), nil)
	}

	//check if the product style exists
	productstylekeys := []string{Product.StyleID}
	stylebytes, err = cycoreutils.QueryObject(stub, "ProductStyle", productstylekeys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product Style object")).Error(), nil)
	}

	if stylebytes == nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("Product Style does not exists"), nil)
	}

	err = cycoreutils.JSONtoObject(stylebytes, ProductStyle)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert bytes to Product Style object")).Error(), nil)
	}

	//check if product style belongs to product brand
	if Product.BrandID != ProductStyle.BrandID {
		return cycoreutils.ConstructResponse("SBRAND001E", fmt.Sprintf("Selected style does not belong to the selected brand"), nil)
	}

	ProductBytes, _ := cycoreutils.ObjecttoJSON(Product)

	err = cycoreutils.UpdateObject(stub, Product.ObjectType, keys, ProductBytes, collectionName)

	if err != nil {
		ProductLogger.Errorf("recordProduct() : Error inserting Product object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Product object update failed")).Error(), nil)
	}

	imageargs := string(args[1])

	//check if the Product has any images uploaded
	if imageargs != "{}" {
		var images []string
		images = append(images, args[1])
		response := recordImages(stub, images)
		if response.Status == "ERROR" {
			ImagesLogger.Errorf("recordImages() : Error inserting Images object into LedgerState %s", err)
			return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Images object update failed")).Error(), nil)
		}

	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded Product object"), ProductBytes)
}

//////////////////////////////////////////////////////////////
/// Query Product Info from the ledger
//////////////////////////////////////////////////////////////
func queryProduct(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var Avalbytes []byte
	var ProductProfileBytes []byte
	var collectionName string
	var Product = &Product{}
	var ProductStyle = &ProductStyle{}
	var ProductDetail = &ProductDetail{}
	var Images = &Images{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Product ID}. Received %d arguments", len(args)), nil)
	}

	Product.ObjectType = "Product"

	err = cycoreutils.JSONtoObject([]byte(args[0]), Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}

	// Query and Retrieve the Full Product
	keys := []string{Product.ProductID}
	ProductLogger.Info("Keys for Product : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Product.ObjectType, keys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to Product object")).Error(), nil)
	}

	encodedImageStrings := []string{}
	if len(Product.ImageIDs) > 0 {
		for i := 0; i < len(Product.ImageIDs); i++ {
			imageArgs := []string{"{\"imageID\":\"" + Product.ImageIDs[i] + "\"}"}
			imageResponse := queryImages(stub, imageArgs)
			err = cycoreutils.JSONtoObject([]byte(imageResponse.ObjectBytes), Images)
			encodedImageStrings = append(encodedImageStrings, Images.ImageString)
		}
	}

	//query for the product profile
	productstylekeys := []string{Product.StyleID}
	ProductProfileLogger.Debug("Keys for ProductStyle %s: ", keys)

	collectionName = ""

	ProductProfileBytes, err = cycoreutils.QueryObject(stub, "ProductStyle", productstylekeys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query ProductStyle object")).Error(), nil)
	}

	if ProductProfileBytes == nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("ProductStyle does not exists"), nil)
	}

	err = cycoreutils.JSONtoObject(ProductProfileBytes, ProductStyle)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}

	if len(ProductStyle.ImageIDs) > 0 {
		for i := 0; i < len(ProductStyle.ImageIDs); i++ {
			imageArgs := []string{"{\"imageID\":\"" + ProductStyle.ImageIDs[i] + "\"}"}
			imageResponse := queryImages(stub, imageArgs)
			err = cycoreutils.JSONtoObject([]byte(imageResponse.ObjectBytes), Images)
			encodedImageStrings = append(encodedImageStrings, Images.ImageString)
		}
	}
	ProductDetail.ImageStrings = append(ProductDetail.ImageStrings, encodedImageStrings...)
	ProductDetail.Product = *Product
	ProductDetail.Profile = *ProductStyle

	ProductDetailBytes, _ := cycoreutils.ObjecttoJSON(ProductDetail)

	ProductLogger.Info("queryProduct() : Returning Product results")

	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Product object"), ProductDetailBytes)
}

//////////////////////////////////////////////////////////////
/// Query Product List from the ledger
//////////////////////////////////////////////////////////////
func queryProductList(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var collectionName string
	collectionName = ""

	queryString := fmt.Sprintf("{\"selector\":{\"objectType\":\"Product\"}}")
	ProductLogger.Info("Query List: queryString: ", queryString)

	queryResults, err := cycoreutils.GetQueryResultForQueryString(stub, queryString, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY006E", (errors.Wrapf(err, "Failed to query Product object list")).Error(), nil)
	}

	if queryResults == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("No Product record found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY007S", fmt.Sprintf("Successfully Retrieved the list of Product objects "), queryResults)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Update Product to the ledger by getting a copy of it, updating that copy, and overwriting the original to a newer version
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func updateProduct(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var UpdatedProductBytes []byte
	var updatedTagBytes []byte
	var tagBytes []byte
	var collectionName string
	var InputProduct = &Product{}
	var Product = &Product{}
	var Tag = &Tag{}

	// Convert the arg to a updateProduct object
	ProductLogger.Info("updateProduct() : Arguments for Query: Product : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), InputProduct)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}
	InputProduct.ObjectType = "Product"
	// Query and Retrieve the Full updateProduct
	keys := []string{InputProduct.ProductID}
	ProductLogger.Info("Keys for Product : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, InputProduct.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product does not exist to update"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}

	if Product.ShippedDate != "" || Product.OrderNumber != "" || Product.RetailerID != "" {
		return cycoreutils.ConstructResponse("SPRODUCT001E", fmt.Sprintf("Product already shipped"), nil)
	}
	Product.ObjectType = "Product"
	Product.RetailerID = InputProduct.RetailerID
	Product.OrderNumber = InputProduct.OrderNumber
	Product.ShippedDate = InputProduct.ShippedDate

	UpdatedProductBytes, _ = cycoreutils.ObjecttoJSON(Product)

	err = cycoreutils.UpdateObject(stub, Product.ObjectType, keys, UpdatedProductBytes, collectionName)

	if err != nil {
		ProductLogger.Errorf("updateProduct() : Error updating Product object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Product object update failed")).Error(), nil)
	}

	//update tag status to activated
	tagkeys := []string{Product.TagID}
	ProductLogger.Info("Keys for Tag : ", tagkeys)

	tagBytes, err = cycoreutils.QueryObject(stub, "Tag", tagkeys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query tag object")).Error(), nil)
	}

	if tagBytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Tag not found"), nil)
	}
	err = cycoreutils.JSONtoObject(tagBytes, Tag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
	}
	Tag.Status = "activated"

	updatedTagBytes, _ = cycoreutils.ObjecttoJSON(Tag)
	err = cycoreutils.UpdateObject(stub, "Tag", tagkeys, updatedTagBytes, collectionName)

	if err != nil {
		ProductLogger.Errorf("updateTag() : Error updating Tag object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Tag object update failed")).Error(), nil)
	}
	return cycoreutils.ConstructResponse("SASTUPD010S", fmt.Sprintf("Successfully Updated Product object"), UpdatedProductBytes)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Delete Product from the ledger.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func deleteProduct(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	ObjectType := "Product"
	var collectionName string
	var Product = &Product{}

	collectionName = ""

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Product ID}. Received %d arguments", len(args)), nil)
	}
	// Convert the arg to a deleteProduct object
	ProductLogger.Info("deleteProduct() : Arguments for Query: Product : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}

	// Query and Retrieve the Full deleteProduct
	keys := []string{Product.ProductID}
	ProductLogger.Info("Keys for Product : ", keys)

	err = cycoreutils.DeleteObject(stub, ObjectType, keys, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTDEL012E", (errors.Wrapf(err, "Failed to delete Product object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTDEL013I", fmt.Sprintf("Successfully Deleted Product object"), nil)
}

//////////////////////////////////////////////////////////////
/// Query Product History from the ledger
//////////////////////////////////////////////////////////////
func queryProductHistory(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var Product = &Product{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Product ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}

	// Query and Retrieve the Full Product
	keys := []string{Product.ProductID}
	ProductLogger.Info("Keys for Product : ", keys)

	Avalbytes, err = cycoreutils.GetObjectHistory(stub, "Product", keys)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product object history")).Error(), nil)
	}
	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product object not found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY014S", fmt.Sprintf("Successfully Queried Product object History"), Avalbytes)
}

func queryUntaggedProductsbyBrand(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var productBytes []byte
	var Product = &Product{}

	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Brand ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to ProductProfile object")).Error(), nil)
	}

	var richQuery = richQuery{}
	richQuery.ObjectType = "Product"

	var field1 = queryField{}
	field1.FieldName = "brandID"
	field1.Operator = "$eq"
	field1.FieldValue = Product.BrandID

	var field2 = queryField{}
	field2.FieldName = "tagID"
	field2.Operator = "$eq"
	field2.FieldValue = ""

	richQuery.QueryFields = []queryField{field1, field2}

	productBytes, err = invokeRichQuery(richQuery, stub)
	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product object")).Error(), nil)
	}

	if len(productBytes) < 3 {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
	}

	ProductProfileLogger.Info("queryProductProfile() : Returning ProductProfile results")
	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Product object"), productBytes)
}

func queryProductsbyBrand(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var productBytes []byte
	var Product = &Product{}

	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Brand ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}

	var richQuery = richQuery{}
	richQuery.ObjectType = "Product"

	var field1 = queryField{}
	field1.FieldName = "brandID"
	field1.Operator = "$eq"
	field1.FieldValue = Product.BrandID

	richQuery.QueryFields = []queryField{field1}

	productBytes, err = invokeRichQuery(richQuery, stub)
	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product object")).Error(), nil)
	}

	if len(productBytes) < 3 {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
	}

	ProductProfileLogger.Info("queryProductProfile() : Returning ProductProfile results")
	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Product object"), productBytes)
}

func queryUnshippedProducts(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var productBytes []byte
	var Product = &Product{}

	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Product ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to ProductProfile object")).Error(), nil)
	}

	var richQuery = richQuery{}
	richQuery.ObjectType = "Product"

	var field1 = queryField{}
	field1.FieldName = "retailerID"
	field1.Operator = "$eq"
	field1.FieldValue = ""

	var field2 = queryField{}
	field2.FieldName = "orderNumber"
	field2.Operator = "$eq"
	field2.FieldValue = ""

	var field3 = queryField{}
	field3.FieldName = "tagID"
	field3.Operator = "$ne"
	field3.FieldValue = ""

	var field4 = queryField{}
	field4.FieldName = "factoryID"
	field4.Operator = "$eq"
	field4.FieldValue = Product.FactoryID

	richQuery.QueryFields = []queryField{field1, field2, field3, field4}

	productBytes, err = invokeRichQuery(richQuery, stub)
	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product object")).Error(), nil)
	}

	if len(productBytes) < 3 {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
	}

	ProductProfileLogger.Info("queryProductProfile() : Returning Product results")
	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Product object"), productBytes)
}

func assignTagtoProduct(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var productBytes []byte
	var updatedproductBytes []byte
	var tagBytes []byte
	var updatedtagBytes []byte
	var Tag = &Tag{}
	var collectionName string
	type AssignTagtoProductRequest struct {
		ObjectType    string
		ProductID     string `json:"productID"`
		TagID         string `json:"tagID"`
		TagTechnology string `json:"tagTechnology"`
	}

	var UntaggedProduct = &AssignTagtoProductRequest{}
	var LedgerProduct = &Product{}

	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Product ID and Tag ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), UntaggedProduct)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}

	UntaggedProduct.ObjectType = "Product"
	// Query and Retrieve the Full Product
	keys := []string{UntaggedProduct.ProductID}
	ProductLogger.Info("Keys for Product : ", keys)

	collectionName = ""

	productBytes, err = cycoreutils.QueryObject(stub, UntaggedProduct.ObjectType, keys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product object")).Error(), nil)
	}

	if productBytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
	}

	err = cycoreutils.JSONtoObject(productBytes, LedgerProduct)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}

	//query for the tag
	tagkeys := []string{UntaggedProduct.TagID}
	ProductLogger.Info("Keys for Tag : ", tagkeys)

	tagBytes, err = cycoreutils.QueryObject(stub, "Tag", tagkeys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Tag object")).Error(), nil)
	}

	ProductLogger.Info("TagTechnology : ", UntaggedProduct.TagTechnology)
	//check tag exists only if the tag is of type "qrcode"
	if UntaggedProduct.TagTechnology == TAG_TYPE_QR_CODE {
		if tagBytes == nil {
			return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Tag not found"), nil)
		}

		err = cycoreutils.JSONtoObject(tagBytes, Tag)
		if err != nil {
			return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
		}

		logger.Infof("Tag.BrandID", Tag.BrandID)
		logger.Infof("LedgerProduct.BrandID", LedgerProduct.BrandID)
		//check if Tag and Product belong to same brand
		if Tag.BrandID != LedgerProduct.BrandID {
			return cycoreutils.ConstructResponse("SBRAND002E", fmt.Sprintf("Tag and Product do not belong to same brand"), nil)
		}

		//check if Tag is not already assigned
		if Tag.ProductID != "" {
			return cycoreutils.ConstructResponse("STAGASG001E", fmt.Sprintf("Tag already assigned. Cannot reasign it to another product"), nil)
		}
	} else {
		if tagBytes != nil {
			err = cycoreutils.JSONtoObject(tagBytes, Tag)
			if err != nil {
				return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
			}

			logger.Infof("Tag.BrandID", Tag.BrandID)
			logger.Infof("LedgerProduct.BrandID", LedgerProduct.BrandID)
			//check if Tag and Product belong to same brand
			if Tag.BrandID != LedgerProduct.BrandID {
				return cycoreutils.ConstructResponse("SBRAND002E", fmt.Sprintf("Tag and Product do not belong to same brand"), nil)
			}

			//check if Tag is not already assigned
			if Tag.ProductID != "" {
				return cycoreutils.ConstructResponse("STAGASG001E", fmt.Sprintf("Tag already assigned. Cannot reasign it to another product"), nil)
			}
		}
	}

	LedgerProduct.ObjectType = "Product"
	LedgerProduct.TagID = UntaggedProduct.TagID

	updatedproductBytes, _ = cycoreutils.ObjecttoJSON(LedgerProduct)

	err = cycoreutils.UpdateObject(stub, LedgerProduct.ObjectType, keys, updatedproductBytes, collectionName)

	if err != nil {
		ProductLogger.Errorf("updateProduct() : Error updating Product object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Product object update failed")).Error(), nil)
	}

	//updateTag
	Tag.ObjectType = "Tag"
	Tag.ProductID = UntaggedProduct.ProductID
	Tag.Status = "Assigned"

	//generate the hash and sent to the node to generate the QR code

	// hashSum, err := generateHash([]string{Tag.TagTechnology, UntaggedProduct.ManufacturerID, UntaggedProduct.FactoryID, UntaggedProduct.ProductID, UntaggedProduct.BrandID, UntaggedProduct.ManufactureDate}, []int{1, 0, 2, 3, 4, 5})
	// if err != nil {
	// 	fmt.Println(err)
	// } else {
	// 	fmt.Printf("Hash = %s\n", hashSum)
	// }

	// Tag.Hash = hashSum
	updatedtagBytes, _ = cycoreutils.ObjecttoJSON(Tag)

	err = cycoreutils.UpdateObject(stub, Tag.ObjectType, tagkeys, updatedtagBytes, collectionName)

	if err != nil {
		ProductLogger.Errorf("updateProduct() : Error updating Tag object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Tag object update failed")).Error(), nil)
	}

	ProductProfileLogger.Info("queryProductProfile() : Returning ProductProfile results")
	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Product object"), updatedtagBytes)
}

func queryProductbyRetailer(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var productBytes []byte
	var Product = &Product{}

	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Retailer ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Product object")).Error(), nil)
	}

	var richQuery = richQuery{}
	richQuery.ObjectType = "Product"

	var field1 = queryField{}
	field1.FieldName = "retailerID"
	field1.Operator = "$eq"
	field1.FieldValue = Product.RetailerID

	richQuery.QueryFields = []queryField{field1}

	productBytes, err = invokeRichQuery(richQuery, stub)
	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Product object")).Error(), nil)
	}

	if len(productBytes) < 3 {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
	}

	ProductProfileLogger.Info("queryProduct() : Returning Product results")
	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Product object"), productBytes)
}
