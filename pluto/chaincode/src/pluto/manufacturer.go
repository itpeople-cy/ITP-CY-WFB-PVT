package main

import (
	"cycoreutils"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/pkg/errors"
)

var ManufacturerLogger = shim.NewLogger("manufacturer")

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record Manufacturer to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordManufacturer(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Avalbytes []byte
	var Manufacturer = &Manufacturer{}

	// Convert the arg to a recordManufacturer object
	ManufacturerLogger.Info("recordManufacturer() : Arguments for recordManufacturer : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Manufacturer)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Manufacturer object")).Error(), nil)
	}

	Manufacturer.ObjectType = "Manufacturer"

	// Query and Retrieve the Full recordManufacturer
	keys := []string{Manufacturer.ManufacturerID}
	ManufacturerLogger.Debug("Keys for Manufacturer %s: ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Manufacturer.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Manufacturer object")).Error(), nil)
	}

	if Avalbytes != nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("Manufacturer already exists"), nil)
	}

	ManufacturerBytes, _ := cycoreutils.ObjecttoJSON(Manufacturer)

	err = cycoreutils.UpdateObject(stub, Manufacturer.ObjectType, keys, ManufacturerBytes, collectionName)

	if err != nil {
		ManufacturerLogger.Errorf("recordManufacturer() : Error inserting Manufacturer object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Manufacturer object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded Manufacturer object"), ManufacturerBytes)
}

//////////////////////////////////////////////////////////////
/// Query Manufacturer Info from the ledger
//////////////////////////////////////////////////////////////
func queryManufacturer(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var Avalbytes []byte
	var collectionName string
	var Manufacturer = &Manufacturer{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Manufacturer ID}. Received %d arguments", len(args)), nil)
	}

	Manufacturer.ObjectType = "Manufacturer"

	err = cycoreutils.JSONtoObject([]byte(args[0]), Manufacturer)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Manufacturer object")).Error(), nil)
	}

	// Query and Retrieve the Full Manufacturer
	keys := []string{Manufacturer.ManufacturerID}
	ManufacturerLogger.Info("Keys for Manufacturer : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Manufacturer.ObjectType, keys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Manufacturer object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Manufacturer not found"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, Manufacturer)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to Manufacturer object")).Error(), nil)
	}

	ManufacturerLogger.Info("queryManufacturer() : Returning Manufacturer results")

	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Manufacturer object"), Avalbytes)
}

//////////////////////////////////////////////////////////////
/// Query Manufacturer List from the ledger
//////////////////////////////////////////////////////////////
func queryManufacturerList(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var collectionName string
	collectionName = ""

	queryString := fmt.Sprintf("{\"selector\":{\"objectType\":\"Manufacturer\"}}")
	ManufacturerLogger.Info("Query List: queryString: ", queryString)

	queryResults, err := cycoreutils.GetQueryResultForQueryString(stub, queryString, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY006E", (errors.Wrapf(err, "Failed to query Manufacturer object list")).Error(), nil)
	}

	if queryResults == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("No Manufacturer record found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY007S", fmt.Sprintf("Successfully Retrieved the list of Manufacturer objects "), queryResults)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Update Manufacturer to the ledger by getting a copy of it, updating that copy, and overwriting the original to a newer version
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func updateManufacturer(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var collectionName string

	var Manufacturer = &Manufacturer{}
	// Convert the arg to a updateManufacturer object
	ManufacturerLogger.Info("updateManufacturer() : Arguments for Query: Manufacturer : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Manufacturer)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Manufacturer object")).Error(), nil)
	}
	Manufacturer.ObjectType = "Manufacturer"
	// Query and Retrieve the Full updateManufacturer
	keys := []string{Manufacturer.ManufacturerID}
	ManufacturerLogger.Info("Keys for Manufacturer : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Manufacturer.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Manufacturer object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Manufacturer does not exist to update"), nil)
	}

	ManufacturerBytes, _ := cycoreutils.ObjecttoJSON(Manufacturer)

	err = cycoreutils.UpdateObject(stub, Manufacturer.ObjectType, keys, ManufacturerBytes, collectionName)

	if err != nil {
		ManufacturerLogger.Errorf("updateManufacturer() : Error updating Manufacturer object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Manufacturer object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTUPD010S", fmt.Sprintf("Successfully Updated Manufacturer object"), ManufacturerBytes)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Delete Manufacturer from the ledger.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func deleteManufacturer(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	ObjectType := "Manufacturer"
	var collectionName string
	var Manufacturer = &Manufacturer{}

	collectionName = ""

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Manufacturer ID}. Received %d arguments", len(args)), nil)
	}
	// Convert the arg to a deleteManufacturer object
	ManufacturerLogger.Info("deleteManufacturer() : Arguments for Query: Manufacturer : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Manufacturer)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Manufacturer object")).Error(), nil)
	}

	// Query and Retrieve the Full deleteManufacturer
	keys := []string{Manufacturer.ManufacturerID}
	ManufacturerLogger.Info("Keys for Manufacturer : ", keys)

	err = cycoreutils.DeleteObject(stub, ObjectType, keys, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTDEL012E", (errors.Wrapf(err, "Failed to delete Manufacturer object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTDEL013I", fmt.Sprintf("Successfully Deleted Manufacturer object"), nil)
}

//////////////////////////////////////////////////////////////
/// Query Manufacturer History from the ledger
//////////////////////////////////////////////////////////////
func queryManufacturerHistory(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var Manufacturer = &Manufacturer{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Manufacturer ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Manufacturer)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Manufacturer object")).Error(), nil)
	}

	// Query and Retrieve the Full Manufacturer
	keys := []string{Manufacturer.ManufacturerID}
	ManufacturerLogger.Info("Keys for Manufacturer : ", keys)

	Avalbytes, err = cycoreutils.GetObjectHistory(stub, "Manufacturer", keys)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Manufacturer object history")).Error(), nil)
	}
	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Manufacturer object not found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY014S", fmt.Sprintf("Successfully Queried Manufacturer object History"), Avalbytes)
}
