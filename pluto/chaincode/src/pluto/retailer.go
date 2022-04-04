package main

import (
	"cycoreutils"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/pkg/errors"
)

var RetailerLogger = shim.NewLogger("Retailer")

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record Retailer to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordRetailer(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Avalbytes []byte
	var Retailer = &Retailer{}

	// Convert the arg to a recordRetailer object
	RetailerLogger.Info("recordRetailer() : Arguments for recordRetailer : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Retailer)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Retailer object")).Error(), nil)
	}

	Retailer.ObjectType = "Retailer"

	// Query and Retrieve the Full recordRetailer
	keys := []string{Retailer.RetailerID}
	RetailerLogger.Debug("Keys for Retailer %s: ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Retailer.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Retailer object")).Error(), nil)
	}

	if Avalbytes != nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("Retailer already exists"), nil)
	}

	RetailerBytes, _ := cycoreutils.ObjecttoJSON(Retailer)

	err = cycoreutils.UpdateObject(stub, Retailer.ObjectType, keys, RetailerBytes, collectionName)

	if err != nil {
		RetailerLogger.Errorf("recordRetailer() : Error inserting Retailer object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Retailer object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded Retailer object"), RetailerBytes)
}

//////////////////////////////////////////////////////////////
/// Query Retailer Info from the ledger
//////////////////////////////////////////////////////////////
func queryRetailer(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var Avalbytes []byte
	var collectionName string
	var Retailer = &Retailer{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Retailer ID}. Received %d arguments", len(args)), nil)
	}

	Retailer.ObjectType = "Retailer"

	err = cycoreutils.JSONtoObject([]byte(args[0]), Retailer)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Retailer object")).Error(), nil)
	}

	// Query and Retrieve the Full Retailer
	keys := []string{Retailer.RetailerID}
	RetailerLogger.Info("Keys for Retailer : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Retailer.ObjectType, keys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Retailer object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Retailer not found"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, Retailer)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to Retailer object")).Error(), nil)
	}

	RetailerLogger.Info("queryRetailer() : Returning Retailer results")

	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Retailer object"), Avalbytes)
}

//////////////////////////////////////////////////////////////
/// Query Retailer List from the ledger
//////////////////////////////////////////////////////////////
func queryRetailerList(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var collectionName string
	collectionName = ""

	queryString := fmt.Sprintf("{\"selector\":{\"objectType\":\"Retailer\"}}")
	RetailerLogger.Info("Query List: queryString: ", queryString)

	queryResults, err := cycoreutils.GetQueryResultForQueryString(stub, queryString, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY006E", (errors.Wrapf(err, "Failed to query Retailer object list")).Error(), nil)
	}

	if queryResults == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("No Retailer record found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY007S", fmt.Sprintf("Successfully Retrieved the list of Retailer objects "), queryResults)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Update Retailer to the ledger by getting a copy of it, updating that copy, and overwriting the original to a newer version
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func updateRetailer(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var collectionName string

	var Retailer = &Retailer{}
	// Convert the arg to a updateRetailer object
	RetailerLogger.Info("updateRetailer() : Arguments for Query: Retailer : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Retailer)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Retailer object")).Error(), nil)
	}
	Retailer.ObjectType = "Retailer"
	// Query and Retrieve the Full updateRetailer
	keys := []string{Retailer.RetailerID}
	RetailerLogger.Info("Keys for Retailer : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Retailer.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Retailer object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Retailer does not exist to update"), nil)
	}

	RetailerBytes, _ := cycoreutils.ObjecttoJSON(Retailer)

	err = cycoreutils.UpdateObject(stub, Retailer.ObjectType, keys, RetailerBytes, collectionName)

	if err != nil {
		RetailerLogger.Errorf("updateRetailer() : Error updating Retailer object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Retailer object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTUPD010S", fmt.Sprintf("Successfully Updated Retailer object"), RetailerBytes)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Delete Retailer from the ledger.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func deleteRetailer(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	ObjectType := "Retailer"
	var collectionName string
	var Retailer = &Retailer{}

	collectionName = ""

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Retailer ID}. Received %d arguments", len(args)), nil)
	}
	// Convert the arg to a deleteRetailer object
	RetailerLogger.Info("deleteRetailer() : Arguments for Query: Retailer : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Retailer)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Retailer object")).Error(), nil)
	}

	// Query and Retrieve the Full deleteRetailer
	keys := []string{Retailer.RetailerID}
	RetailerLogger.Info("Keys for Retailer : ", keys)

	err = cycoreutils.DeleteObject(stub, ObjectType, keys, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTDEL012E", (errors.Wrapf(err, "Failed to delete Retailer object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTDEL013I", fmt.Sprintf("Successfully Deleted Retailer object"), nil)
}

//////////////////////////////////////////////////////////////
/// Query Retailer History from the ledger
//////////////////////////////////////////////////////////////
func queryRetailerHistory(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var Retailer = &Retailer{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Retailer ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Retailer)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Retailer object")).Error(), nil)
	}

	// Query and Retrieve the Full Retailer
	keys := []string{Retailer.RetailerID}
	RetailerLogger.Info("Keys for Retailer : ", keys)

	Avalbytes, err = cycoreutils.GetObjectHistory(stub, "Retailer", keys)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Retailer object history")).Error(), nil)
	}
	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Retailer object not found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY014S", fmt.Sprintf("Successfully Queried Retailer object History"), Avalbytes)
}
