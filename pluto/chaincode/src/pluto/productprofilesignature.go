package main

import (
	"cycoreutils"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/pkg/errors"
)

var ProductStyleSignatureLogger = shim.NewLogger("ProductStyleSignature")

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record ProductStyleSignature to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordProductStyleSignature(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Avalbytes []byte
	var ProductStyleSignature = &ProductStyleSignature{}

	// Convert the arg to a recordProductStyleSignature object
	ProductStyleSignatureLogger.Info("recordProductStyleSignature() : Arguments for recordProductStyleSignature : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), ProductStyleSignature)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to ProductStyleSignature object")).Error(), nil)
	}

	ProductStyleSignature.ObjectType = "ProductStyleSignature"

	// Query and Retrieve the Full recordProductStyleSignature
	keys := []string{ProductStyleSignature.StyleID}
	ProductStyleSignatureLogger.Debug("Keys for ProductStyleSignature %s: ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, ProductStyleSignature.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query ProductStyleSignature object")).Error(), nil)
	}

	if Avalbytes != nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("ProductStyleSignature already exists"), nil)
	}

	ProductStyleSignatureBytes, _ := cycoreutils.ObjecttoJSON(ProductStyleSignature)

	err = cycoreutils.UpdateObject(stub, ProductStyleSignature.ObjectType, keys, ProductStyleSignatureBytes, collectionName)

	if err != nil {
		ProductStyleSignatureLogger.Errorf("recordProductStyleSignature() : Error inserting ProductStyleSignature object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "ProductStyleSignature object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded ProductStyleSignature object"), ProductStyleSignatureBytes)
}

//////////////////////////////////////////////////////////////
/// Query ProductStyleSignature Info from the ledger
//////////////////////////////////////////////////////////////
func queryProductStyleSignature(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var Avalbytes []byte
	var collectionName string
	var ProductStyleSignature = &ProductStyleSignature{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting ProductStyleSignature ID}. Received %d arguments", len(args)), nil)
	}

	ProductStyleSignature.ObjectType = "ProductStyleSignature"

	err = cycoreutils.JSONtoObject([]byte(args[0]), ProductStyleSignature)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to ProductStyleSignature object")).Error(), nil)
	}

	// Query and Retrieve the Full ProductStyleSignature
	keys := []string{ProductStyleSignature.StyleID}
	ProductStyleSignatureLogger.Info("Keys for ProductStyleSignature : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, ProductStyleSignature.ObjectType, keys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query ProductStyleSignature object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("ProductStyleSignature not found"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, ProductStyleSignature)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to ProductStyleSignature object")).Error(), nil)
	}

	ProductStyleSignatureLogger.Info("queryProductStyleSignature() : Returning ProductStyleSignature results")

	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried ProductStyleSignature object"), Avalbytes)
}

//////////////////////////////////////////////////////////////
/// Query ProductStyleSignature List from the ledger
//////////////////////////////////////////////////////////////
func queryProductStyleSignatureList(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var collectionName string
	collectionName = ""

	queryString := fmt.Sprintf("{\"selector\":{\"objectType\":\"ProductStyleSignature\"}}")
	ProductStyleSignatureLogger.Info("Query List: queryString: ", queryString)

	queryResults, err := cycoreutils.GetQueryResultForQueryString(stub, queryString, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY006E", (errors.Wrapf(err, "Failed to query ProductStyleSignature object list")).Error(), nil)
	}

	if queryResults == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("No ProductStyleSignature record found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY007S", fmt.Sprintf("Successfully Retrieved the list of ProductStyleSignature objects "), queryResults)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Update ProductStyleSignature to the ledger by getting a copy of it, updating that copy, and overwriting the original to a newer version
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func updateProductStyleSignature(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var collectionName string

	var ProductStyleSignature = &ProductStyleSignature{}
	// Convert the arg to a updateProductStyleSignature object
	ProductStyleSignatureLogger.Info("updateProductStyleSignature() : Arguments for Query: ProductStyleSignature : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), ProductStyleSignature)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to ProductStyleSignature object")).Error(), nil)
	}
	ProductStyleSignature.ObjectType = "ProductStyleSignature"
	// Query and Retrieve the Full updateProductStyleSignature
	keys := []string{ProductStyleSignature.StyleID}
	ProductStyleSignatureLogger.Info("Keys for ProductStyleSignature : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, ProductStyleSignature.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query ProductStyleSignature object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("ProductStyleSignature does not exist to update"), nil)
	}

	ProductStyleSignatureBytes, _ := cycoreutils.ObjecttoJSON(ProductStyleSignature)

	err = cycoreutils.UpdateObject(stub, ProductStyleSignature.ObjectType, keys, ProductStyleSignatureBytes, collectionName)

	if err != nil {
		ProductStyleSignatureLogger.Errorf("updateProductStyleSignature() : Error updating ProductStyleSignature object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "ProductStyleSignature object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTUPD010S", fmt.Sprintf("Successfully Updated ProductStyleSignature object"), ProductStyleSignatureBytes)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Delete ProductStyleSignature from the ledger.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func deleteProductStyleSignature(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	ObjectType := "ProductStyleSignature"
	var collectionName string
	var ProductStyleSignature = &ProductStyleSignature{}

	collectionName = ""

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting ProductStyleSignature ID}. Received %d arguments", len(args)), nil)
	}
	// Convert the arg to a deleteProductStyleSignature object
	ProductStyleSignatureLogger.Info("deleteProductStyleSignature() : Arguments for Query: ProductStyleSignature : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), ProductStyleSignature)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to ProductStyleSignature object")).Error(), nil)
	}

	// Query and Retrieve the Full deleteProductStyleSignature
	keys := []string{ProductStyleSignature.StyleID}
	ProductStyleSignatureLogger.Info("Keys for ProductStyleSignature : ", keys)

	err = cycoreutils.DeleteObject(stub, ObjectType, keys, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTDEL012E", (errors.Wrapf(err, "Failed to delete ProductStyleSignature object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTDEL013I", fmt.Sprintf("Successfully Deleted ProductStyleSignature object"), nil)
}

//////////////////////////////////////////////////////////////
/// Query ProductStyleSignature History from the ledger
//////////////////////////////////////////////////////////////
func queryProductStyleSignatureHistory(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var ProductStyleSignature = &ProductStyleSignature{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting ProductStyleSignature ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), ProductStyleSignature)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to ProductStyleSignature object")).Error(), nil)
	}

	// Query and Retrieve the Full ProductStyleSignature
	keys := []string{ProductStyleSignature.StyleID}
	ProductStyleSignatureLogger.Info("Keys for ProductStyleSignature : ", keys)

	Avalbytes, err = cycoreutils.GetObjectHistory(stub, "ProductStyleSignature", keys)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query ProductStyleSignature object history")).Error(), nil)
	}
	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("ProductStyleSignature object not found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY014S", fmt.Sprintf("Successfully Queried ProductStyleSignature object History"), Avalbytes)
}
