package main

import (
	"cycoreutils"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/pkg/errors"
)

var FactoryLogger = shim.NewLogger("factory")

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record Manufacturer to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordFactory(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Avalbytes []byte
	var Factory = &Factory{}

	// Convert the arg to a recordManufacturer object
	FactoryLogger.Info("recordFactory() : Arguments for recordFactory : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Factory)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Factory object")).Error(), nil)
	}

	Factory.ObjectType = "Factory"

	// Query and Retrieve the Full recordManufacturer
	keys := []string{Factory.FactoryID}
	FactoryLogger.Debug("Keys for Factory %s: ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Factory.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Factory object")).Error(), nil)
	}

	if Avalbytes != nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("Factory already exists"), nil)
	}

	FactoryBytes, _ := cycoreutils.ObjecttoJSON(Factory)

	err = cycoreutils.UpdateObject(stub, Factory.ObjectType, keys, FactoryBytes, collectionName)

	if err != nil {
		FactoryLogger.Errorf("recordFactory() : Error inserting Factory object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Factory object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded Factory object"), FactoryBytes)
}

func queryFactory(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var Avalbytes []byte
	var collectionName string
	var Factory = &Factory{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Factory ID}. Received %d arguments", len(args)), nil)
	}

	Factory.ObjectType = "Factory"

	err = cycoreutils.JSONtoObject([]byte(args[0]), Factory)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Factory object")).Error(), nil)
	}

	// Query and Retrieve the Full Brand
	keys := []string{Factory.FactoryID}
	BrandLogger.Info("Keys for Factory : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Factory.ObjectType, keys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Factory object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Factory not found"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, Factory)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to Factory object")).Error(), nil)
	}

	FactoryLogger.Info("queryFactory() : Returning Factory results")

	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Factory object"), Avalbytes)
}

func queryFactorybyBrand(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var collectionName string
	var InputBrand = &Brand{}
	var Factories = &[]Factory{}
	var factoryList []string
	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Brand ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), InputBrand)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Brand object")).Error(), nil)
	}

	queryString := fmt.Sprintf("{\"selector\":{\"objectType\":\"Factory\"}}")

	queryResults, err := cycoreutils.GetQueryResultForQueryString(stub, queryString, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY006E", (errors.Wrapf(err, "Failed to query Factory object list")).Error(), nil)
	}

	if queryResults == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Factory not found"), nil)
	}

	err = cycoreutils.JSONtoObject(queryResults, Factories)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Factory object")).Error(), nil)
	}

	for _, factory := range *Factories {
		brands := factory.BrandIDs
		for _, brand := range brands {
			if brand == InputBrand.BrandID {
				factoryList = append(factoryList, factory.FactoryID)
			}
		}
	}

	FactoryBytes, _ := cycoreutils.ObjecttoJSON(factoryList)

	FactoryLogger.Info("queryFactory() : Returning Factory results")
	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Factory object"), FactoryBytes)
}
