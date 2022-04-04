package main

import (
	"bytes"
	"cycoreutils"
	"fmt"
	"html/template"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/pkg/errors"
)

var ProductProfileLogger = shim.NewLogger("ProductStyle")

var selectorTemplate = `{ "selector": { "objectType": "{{.ObjectType}}",
                        {{range $i, $e := .QueryFields}} "{{.FieldName}}": {{if .BoolFieldValue}} 
                        { "$eq": {{.BoolFieldValue}} {{else}} { "{{.Operator}}": "{{.FieldValue}}" 
						{{end}} } {{if len $.QueryFields | sub 1 | eq $i | not}},{{end}} {{end}}}}`

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record ProductStyle to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordProductStyle(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Avalbytes []byte
	var ProductStyle = &ProductStyle{}

	// Convert the arg to a recordProductStyle object
	ProductProfileLogger.Info("recordProductStyle() : Arguments for recordProductStyle : ", args[0])

	if len(args) < 1 {
		return cycoreutils.ConstructResponse("SASTCONV002E", fmt.Sprintf(" Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), ProductStyle)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
	}

	ProductStyle.ObjectType = "ProductStyle"

	// Query and Retrieve the Full recordProductStyle
	keys := []string{ProductStyle.StyleID}
	ProductProfileLogger.Debug("Keys for ProductStyle %s: ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, ProductStyle.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query ProductStyle object")).Error(), nil)
	}

	if Avalbytes != nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("ProductStyle already exists"), nil)
	}

	ProductProfileBytes, _ := cycoreutils.ObjecttoJSON(ProductStyle)

	err = cycoreutils.UpdateObject(stub, ProductStyle.ObjectType, keys, ProductProfileBytes, collectionName)

	if err != nil {
		ProductProfileLogger.Errorf("recordProductStyle() : Error inserting ProductStyle object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "ProductStyle object update failed")).Error(), nil)
	}

	imageargs := string(args[1])

	//check if the Product Profile has any images uploaded
	if imageargs != "{}" {
		var images []string
		images = append(images, args[1])
		response := recordImages(stub, images)
		if response.Status == "ERROR" {
			ImagesLogger.Errorf("recordImages() : Error inserting Images object into LedgerState %s", err)
			return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Images object update failed")).Error(), nil)
		}

	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded ProductStyle object"), ProductProfileBytes)
}

//////////////////////////////////////////////////////////////
/// Query ProductStyle Info from the ledger
//////////////////////////////////////////////////////////////
func queryProductProfile(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var Avalbytes []byte
	var collectionName string
	var ProductStyle = &ProductStyle{}
	var Images = &Images{}
	var ProductWithImages = &productWithImages{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting ProductStyle ID}. Received %d arguments", len(args)), nil)
	}

	ProductStyle.ObjectType = "ProductStyle"

	err = cycoreutils.JSONtoObject([]byte(args[0]), ProductStyle)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
	}

	// Query and Retrieve the Full ProductStyle
	keys := []string{ProductStyle.StyleID}
	ProductProfileLogger.Info("Keys for ProductStyle : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, ProductStyle.ObjectType, keys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query ProductStyle object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("ProductStyle not found"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, ProductStyle)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to ProductStyle object")).Error(), nil)
	}

	if len(ProductStyle.ImageIDs) > 0 {
		encodedImageStrings := []string{}
		for i := 0; i < len(ProductStyle.ImageIDs); i++ {
			imageArgs := []string{"{\"imageID\":\"" + ProductStyle.ImageIDs[i] + "\"}"}
			imageResponse := queryImages(stub, imageArgs)
			err = cycoreutils.JSONtoObject([]byte(imageResponse.ObjectBytes), Images)
			encodedImageStrings = append(encodedImageStrings, Images.ImageString)
		}
		ProductWithImages.StructName = ProductStyle
		ProductWithImages.EndodedImages = encodedImageStrings
		Avalbytes, _ = cycoreutils.ObjecttoJSON(ProductWithImages)
	}

	ProductProfileLogger.Info("queryProductProfile() : Returning ProductStyle results")

	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried ProductStyle object"), Avalbytes)
}

//////////////////////////////////////////////////////////////
/// Query ProductStyle List from the ledger
//////////////////////////////////////////////////////////////
func queryProductProfileList(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var collectionName string
	collectionName = ""

	queryString := fmt.Sprintf("{\"selector\":{\"objectType\":\"ProductStyle\"}}")
	ProductProfileLogger.Info("Query List: queryString: ", queryString)

	queryResults, err := cycoreutils.GetQueryResultForQueryString(stub, queryString, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY006E", (errors.Wrapf(err, "Failed to query ProductStyle object list")).Error(), nil)
	}

	if queryResults == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("No ProductStyle record found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY007S", fmt.Sprintf("Successfully Retrieved the list of ProductStyle objects "), queryResults)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Update ProductStyle to the ledger by getting a copy of it, updating that copy, and overwriting the original to a newer version
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func updateProductProfile(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var collectionName string

	var InputProductStyle = &ProductStyle{}
	var LedgerProductStyle = &ProductStyle{}
	// Convert the arg to a updateProductProfile object
	ProductProfileLogger.Info("updateProductProfile() : Arguments for Query: ProductStyle : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), InputProductStyle)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
	}
	InputProductStyle.ObjectType = "ProductStyle"
	// Query and Retrieve the Full updateProductProfile
	keys := []string{InputProductStyle.StyleID}
	ProductProfileLogger.Info("Keys for ProductStyle : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, InputProductStyle.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query ProductStyle object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("ProductStyle does not exist to update"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, LedgerProductStyle)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
	}

	LedgerProductStyle.ImageIDs = append(LedgerProductStyle.ImageIDs, InputProductStyle.ImageIDs[0])

	ProductProfileBytes, _ := cycoreutils.ObjecttoJSON(LedgerProductStyle)

	err = cycoreutils.UpdateObject(stub, InputProductStyle.ObjectType, keys, ProductProfileBytes, collectionName)

	if err != nil {
		ProductProfileLogger.Errorf("updateProductProfile() : Error updating ProductStyle object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "ProductStyle object update failed")).Error(), nil)
	}
	//add images to the image collection
	imageargs := string(args[1])

	//check if the Product Profile has any images uploaded
	if imageargs != "{}" {
		var images []string
		images = append(images, args[1])
		response := recordImages(stub, images)
		if response.Status == "ERROR" {
			ImagesLogger.Errorf("recordImages() : Error inserting Images object into LedgerState %s", err)
			return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Images object update failed")).Error(), nil)
		}

	}

	return cycoreutils.ConstructResponse("SASTUPD010S", fmt.Sprintf("Successfully Updated ProductStyle object"), ProductProfileBytes)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Delete ProductStyle from the ledger.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func deleteProductProfile(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	ObjectType := "ProductStyle"
	var collectionName string
	var ProductStyle = &ProductStyle{}

	collectionName = ""

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting ProductStyle ID}. Received %d arguments", len(args)), nil)
	}
	// Convert the arg to a deleteProductProfile object
	ProductProfileLogger.Info("deleteProductProfile() : Arguments for Query: ProductStyle : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), ProductStyle)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
	}

	// Query and Retrieve the Full deleteProductProfile
	keys := []string{ProductStyle.StyleID}
	ProductProfileLogger.Info("Keys for ProductStyle : ", keys)

	err = cycoreutils.DeleteObject(stub, ObjectType, keys, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTDEL012E", (errors.Wrapf(err, "Failed to delete ProductStyle object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTDEL013I", fmt.Sprintf("Successfully Deleted ProductStyle object"), nil)
}

//////////////////////////////////////////////////////////////
/// Query ProductStyle History from the ledger
//////////////////////////////////////////////////////////////
func queryProductProfileHistory(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var ProductStyle = &ProductStyle{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting ProductStyle ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), ProductStyle)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
	}

	// Query and Retrieve the Full ProductStyle
	keys := []string{ProductStyle.StyleID}
	ProductProfileLogger.Info("Keys for ProductStyle : ", keys)

	Avalbytes, err = cycoreutils.GetObjectHistory(stub, "ProductStyle", keys)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query ProductStyle object history")).Error(), nil)
	}
	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("ProductStyle object not found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY014S", fmt.Sprintf("Successfully Queried ProductStyle object History"), Avalbytes)
}

func queryProductProfilebyBrand(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var productProfileBytes []byte
	var ProductStyle = &ProductStyle{}

	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting ProductStyle ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), ProductStyle)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to ProductStyle object")).Error(), nil)
	}

	var richQuery = richQuery{}
	richQuery.ObjectType = "ProductStyle"

	var field1 = queryField{}
	field1.FieldName = "brandID"
	field1.Operator = "$eq"
	field1.FieldValue = ProductStyle.BrandID

	richQuery.QueryFields = []queryField{field1}

	productProfileBytes, err = invokeRichQuery(richQuery, stub)
	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query ProductStyle object")).Error(), nil)
	}

	if len(productProfileBytes) < 3 {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("ProductStyle not found"), nil)
	}

	ProductProfileLogger.Info("queryProductProfile() : Returning ProductStyle results")
	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried ProductStyle object"), productProfileBytes)
}

func invokeRichQuery(query richQuery, stub shim.ChaincodeStubInterface) ([]byte, error) {
	var selectorString bytes.Buffer
	var resultBytes []byte

	selectTempl, err := template.New("selector").Funcs(fns).Parse(selectorTemplate)
	if err != nil {
		logger.Infof("Error in the templates %s", err.Error())
		return nil, err
	}

	if err = selectTempl.Execute(&selectorString, query); err != nil {
		logger.Infof("Error executing the templates %s", err.Error())
		return nil, err
	}

	logger.Infof("++++InvokeRichQuery++++", selectorString.String())

	if resultBytes, err = cycoreutils.GetQueryResultForQueryString(stub, selectorString.String(), ""); err != nil {
		return nil, err
	}

	return resultBytes, nil
}

var fns = template.FuncMap{
	"eq": func(x, y interface{}) bool {
		return x == y
	},
	"sub": func(y, x int) int {
		return x - y
	},
}
