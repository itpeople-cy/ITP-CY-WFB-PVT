package main

import (
	"cycoreutils"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/pkg/errors"
)

var ScanLogger = shim.NewLogger("scan")

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record Manufacturer to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordScan(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Avalbytes []byte
	var Scan = &Scan{}

	// Convert the arg to a recordManufacturer object
	ScanLogger.Info("recordScan() : Arguments for recordScan : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Scan)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Scan object")).Error(), nil)
	}

	Scan.ObjectType = "Scan"

	// Query and Retrieve the Full recordManufacturer
	keys := []string{Scan.ScanID}
	ScanLogger.Debug("Keys for Scan %s: ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Scan.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Scan object")).Error(), nil)
	}

	if Avalbytes != nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("Scan already exists"), nil)
	}

	ScanBytes, _ := cycoreutils.ObjecttoJSON(Scan)

	err = cycoreutils.UpdateObject(stub, Scan.ObjectType, keys, ScanBytes, collectionName)

	if err != nil {
		ScanLogger.Errorf("recordScan() : Error inserting Scan object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Scan object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded Scan object"), ScanBytes)
}

func queryScanbyID(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var scanBytes []byte
	var Scan = &Scan{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Product or Scan ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Scan)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Brand object")).Error(), nil)
	}

	var richQuery = richQuery{}
	richQuery.ObjectType = "Scan"

	var field1 = queryField{}

	if Scan.TagID != "" {
		field1.FieldName = "tagID"
		field1.FieldValue = Scan.TagID
	} else {
		field1.FieldName = "productID"
		field1.FieldValue = Scan.ProductID
	}

	field1.Operator = "$eq"

	richQuery.QueryFields = []queryField{field1}

	scanBytes, err = invokeRichQuery(richQuery, stub)
	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Scan object")).Error(), nil)
	}

	if len(scanBytes) < 3 {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Scans not found"), nil)
	}

	ProductProfileLogger.Info("queryScan() : Returning Scan results")
	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Scan objects"), scanBytes)
}
