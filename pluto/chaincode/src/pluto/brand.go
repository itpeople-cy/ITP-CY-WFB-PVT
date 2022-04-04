package main

import (
	"cycoreutils"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/pkg/errors"
)

var BrandLogger = shim.NewLogger("brand")

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record Brand to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordBrand(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Avalbytes []byte
	var Brand = &Brand{}

	// Convert the arg to a recordBrand object
	BrandLogger.Info("recordBrand() : Arguments for recordBrand : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Brand)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Brand object")).Error(), nil)
	}

	Brand.ObjectType = "Brand"

	// Query and Retrieve the Full recordBrand
	keys := []string{Brand.BrandID}
	BrandLogger.Debug("Keys for Brand %s: ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Brand.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Brand object")).Error(), nil)
	}

	if Avalbytes != nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("Brand already exists"), nil)
	}

	BrandBytes, _ := cycoreutils.ObjecttoJSON(Brand)

	err = cycoreutils.UpdateObject(stub, Brand.ObjectType, keys, BrandBytes, collectionName)

	if err != nil {
		BrandLogger.Errorf("recordBrand() : Error inserting Brand object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Brand object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded Brand object"), BrandBytes)
}

//////////////////////////////////////////////////////////////
/// Query Brand Info from the ledger
//////////////////////////////////////////////////////////////
func queryBrand(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var Avalbytes []byte
	var collectionName string
	var Brand = &Brand{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Brand ID}. Received %d arguments", len(args)), nil)
	}

	Brand.ObjectType = "Brand"

	err = cycoreutils.JSONtoObject([]byte(args[0]), Brand)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Brand object")).Error(), nil)
	}

	// Query and Retrieve the Full Brand
	keys := []string{Brand.BrandID}
	BrandLogger.Info("Keys for Brand : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Brand.ObjectType, keys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Brand object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Brand not found"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, Brand)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to Brand object")).Error(), nil)
	}

	BrandLogger.Info("queryBrand() : Returning Brand results")

	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Brand object"), Avalbytes)
}

//////////////////////////////////////////////////////////////
/// Query Brand List from the ledger
//////////////////////////////////////////////////////////////
func queryBrandList(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var collectionName string
	collectionName = ""

	queryString := fmt.Sprintf("{\"selector\":{\"objectType\":\"Brand\"}}")
	BrandLogger.Info("Query List: queryString: ", queryString)

	queryResults, err := cycoreutils.GetQueryResultForQueryString(stub, queryString, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY006E", (errors.Wrapf(err, "Failed to query Brand object list")).Error(), nil)
	}

	if queryResults == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("No Brand record found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY007S", fmt.Sprintf("Successfully Retrieved the list of Brand objects "), queryResults)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Update Brand to the ledger by getting a copy of it, updating that copy, and overwriting the original to a newer version
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func updateBrand(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var collectionName string

	var Brand = &Brand{}
	// Convert the arg to a updateBrand object
	BrandLogger.Info("updateBrand() : Arguments for Query: Brand : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Brand)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Brand object")).Error(), nil)
	}
	Brand.ObjectType = "Brand"
	// Query and Retrieve the Full updateBrand
	keys := []string{Brand.BrandID}
	BrandLogger.Info("Keys for Brand : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Brand.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Brand object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Brand does not exist to update"), nil)
	}

	BrandBytes, _ := cycoreutils.ObjecttoJSON(Brand)

	err = cycoreutils.UpdateObject(stub, Brand.ObjectType, keys, BrandBytes, collectionName)

	if err != nil {
		BrandLogger.Errorf("updateBrand() : Error updating Brand object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Brand object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTUPD010S", fmt.Sprintf("Successfully Updated Brand object"), BrandBytes)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Delete Brand from the ledger.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func deleteBrand(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	ObjectType := "Brand"
	var collectionName string
	var Brand = &Brand{}

	collectionName = ""

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Brand ID}. Received %d arguments", len(args)), nil)
	}
	// Convert the arg to a deleteBrand object
	BrandLogger.Info("deleteBrand() : Arguments for Query: Brand : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Brand)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Brand object")).Error(), nil)
	}

	// Query and Retrieve the Full deleteBrand
	keys := []string{Brand.BrandID}
	BrandLogger.Info("Keys for Brand : ", keys)

	err = cycoreutils.DeleteObject(stub, ObjectType, keys, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTDEL012E", (errors.Wrapf(err, "Failed to delete Brand object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTDEL013I", fmt.Sprintf("Successfully Deleted Brand object"), nil)
}

//////////////////////////////////////////////////////////////
/// Query Brand History from the ledger
//////////////////////////////////////////////////////////////
func queryBrandHistory(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var Brand = &Brand{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Brand ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Brand)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Brand object")).Error(), nil)
	}

	// Query and Retrieve the Full Brand
	keys := []string{Brand.BrandID}
	BrandLogger.Info("Keys for Brand : ", keys)

	Avalbytes, err = cycoreutils.GetObjectHistory(stub, "Brand", keys)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Brand object history")).Error(), nil)
	}
	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Brand object not found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY014S", fmt.Sprintf("Successfully Queried Brand object History"), Avalbytes)
}

func queryBrandbyManufacturer(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var brandBytes []byte
	var Brand = &Brand{}

	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Manufacturer ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Brand)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Brand object")).Error(), nil)
	}

	var richQuery = richQuery{}
	richQuery.ObjectType = "Brand"

	var field1 = queryField{}
	field1.FieldName = "manufacturerID"
	field1.Operator = "$eq"
	//field1.FieldValue = Brand.ManufacturerID

	richQuery.QueryFields = []queryField{field1}

	brandBytes, err = invokeRichQuery(richQuery, stub)
	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Brand object")).Error(), nil)
	}

	if len(brandBytes) < 3 {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Brand not found"), nil)
	}

	ProductProfileLogger.Info("queryProductProfile() : Returning ProductStyle results")
	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Brand object"), brandBytes)
}

func queryBrandbyTagTechnology(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var brandBytes []byte
	var Brand = &Brand{}

	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Tag Technology}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Brand)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Brand object")).Error(), nil)
	}

	var richQuery = richQuery{}
	richQuery.ObjectType = "Brand"

	var field1 = queryField{}
	field1.FieldName = "tagTechnology"
	field1.Operator = "$eq"
	field1.FieldValue = Brand.TagTechnology

	richQuery.QueryFields = []queryField{field1}

	brandBytes, err = invokeRichQuery(richQuery, stub)
	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Brand object")).Error(), nil)
	}

	if len(brandBytes) < 3 {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Brand not found"), nil)
	}

	ProductProfileLogger.Info("queryProductProfile() : Returning Brand results")
	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Brand object"), brandBytes)
}
