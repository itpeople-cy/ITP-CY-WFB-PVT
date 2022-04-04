package main

import (
	"cycoreutils"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/pkg/errors"
)

var TagSupplierLogger = shim.NewLogger("TagSupplier")

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record TagSupplier to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordTagSupplier(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Avalbytes []byte
	var TagSupplier = &TagSupplier{}

	// Convert the arg to a recordTagSupplier object
	TagSupplierLogger.Info("recordTagSupplier() : Arguments for recordTagSupplier : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), TagSupplier)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to TagSupplier object")).Error(), nil)
	}

	TagSupplier.ObjectType = "TagSupplier"

	// Query and Retrieve the Full recordTagSupplier
	keys := []string{TagSupplier.TagSupplierID}
	TagSupplierLogger.Debug("Keys for TagSupplier %s: ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, TagSupplier.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query TagSupplier object")).Error(), nil)
	}

	if Avalbytes != nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("TagSupplier already exists"), nil)
	}

	TagSupplierBytes, _ := cycoreutils.ObjecttoJSON(TagSupplier)

	err = cycoreutils.UpdateObject(stub, TagSupplier.ObjectType, keys, TagSupplierBytes, collectionName)

	if err != nil {
		TagSupplierLogger.Errorf("recordTagSupplier() : Error inserting TagSupplier object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "TagSupplier object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded TagSupplier object"), TagSupplierBytes)
}

//////////////////////////////////////////////////////////////
/// Query TagSupplier Info from the ledger
//////////////////////////////////////////////////////////////
func queryTagSupplier(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var Avalbytes []byte
	var collectionName string
	var TagSupplier = &TagSupplier{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting TagSupplier ID}. Received %d arguments", len(args)), nil)
	}

	TagSupplier.ObjectType = "TagSupplier"

	err = cycoreutils.JSONtoObject([]byte(args[0]), TagSupplier)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to TagSupplier object")).Error(), nil)
	}

	// Query and Retrieve the Full TagSupplier
	keys := []string{TagSupplier.TagSupplierID}
	TagSupplierLogger.Info("Keys for TagSupplier : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, TagSupplier.ObjectType, keys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query TagSupplier object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("TagSupplier not found"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, TagSupplier)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to TagSupplier object")).Error(), nil)
	}

	TagSupplierLogger.Info("queryTagSupplier() : Returning TagSupplier results")

	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried TagSupplier object"), Avalbytes)
}

//////////////////////////////////////////////////////////////
/// Query TagSupplier List from the ledger
//////////////////////////////////////////////////////////////
func queryTagSupplierList(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var collectionName string
	collectionName = ""

	queryString := fmt.Sprintf("{\"selector\":{\"objectType\":\"TagSupplier\"}}")
	TagSupplierLogger.Info("Query List: queryString: ", queryString)

	queryResults, err := cycoreutils.GetQueryResultForQueryString(stub, queryString, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY006E", (errors.Wrapf(err, "Failed to query TagSupplier object list")).Error(), nil)
	}

	if queryResults == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("No TagSupplier record found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY007S", fmt.Sprintf("Successfully Retrieved the list of TagSupplier objects "), queryResults)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Update TagSupplier to the ledger by getting a copy of it, updating that copy, and overwriting the original to a newer version
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func updateTagSupplier(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var collectionName string

	var TagSupplier = &TagSupplier{}
	// Convert the arg to a updateTagSupplier object
	TagSupplierLogger.Info("updateTagSupplier() : Arguments for Query: TagSupplier : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), TagSupplier)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to TagSupplier object")).Error(), nil)
	}
	TagSupplier.ObjectType = "TagSupplier"
	// Query and Retrieve the Full updateTagSupplier
	keys := []string{TagSupplier.TagSupplierID}
	TagSupplierLogger.Info("Keys for TagSupplier : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, TagSupplier.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query TagSupplier object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("TagSupplier does not exist to update"), nil)
	}

	TagSupplierBytes, _ := cycoreutils.ObjecttoJSON(TagSupplier)

	err = cycoreutils.UpdateObject(stub, TagSupplier.ObjectType, keys, TagSupplierBytes, collectionName)

	if err != nil {
		TagSupplierLogger.Errorf("updateTagSupplier() : Error updating TagSupplier object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "TagSupplier object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTUPD010S", fmt.Sprintf("Successfully Updated TagSupplier object"), TagSupplierBytes)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Delete TagSupplier from the ledger.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func deleteTagSupplier(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	ObjectType := "TagSupplier"
	var collectionName string
	var TagSupplier = &TagSupplier{}

	collectionName = ""

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting TagSupplier ID}. Received %d arguments", len(args)), nil)
	}
	// Convert the arg to a deleteTagSupplier object
	TagSupplierLogger.Info("deleteTagSupplier() : Arguments for Query: TagSupplier : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), TagSupplier)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to TagSupplier object")).Error(), nil)
	}

	// Query and Retrieve the Full deleteTagSupplier
	keys := []string{TagSupplier.TagSupplierID}
	TagSupplierLogger.Info("Keys for TagSupplier : ", keys)

	err = cycoreutils.DeleteObject(stub, ObjectType, keys, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTDEL012E", (errors.Wrapf(err, "Failed to delete TagSupplier object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTDEL013I", fmt.Sprintf("Successfully Deleted TagSupplier object"), nil)
}

//////////////////////////////////////////////////////////////
/// Query TagSupplier History from the ledger
//////////////////////////////////////////////////////////////
func queryTagSupplierHistory(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var TagSupplier = &TagSupplier{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting TagSupplier ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), TagSupplier)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to TagSupplier object")).Error(), nil)
	}

	// Query and Retrieve the Full TagSupplier
	keys := []string{TagSupplier.TagSupplierID}
	TagSupplierLogger.Info("Keys for TagSupplier : ", keys)

	Avalbytes, err = cycoreutils.GetObjectHistory(stub, "TagSupplier", keys)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query TagSupplier object history")).Error(), nil)
	}
	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("TagSupplier object not found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY014S", fmt.Sprintf("Successfully Queried TagSupplier object History"), Avalbytes)
}
