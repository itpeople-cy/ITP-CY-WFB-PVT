package main

import (
	"cycoreutils"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/pkg/errors"
)

var ImagesLogger = shim.NewLogger("images")

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record Images to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordImages(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string
	var Avalbytes []byte
	var Images = &Images{}

	// Convert the arg to a recordImages object
	ImagesLogger.Info("recordImages() : Arguments for recordImages : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Images)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Images object")).Error(), nil)
	}

	Images.ObjectType = "Images"

	// Query and Retrieve the Full recordImages
	keys := []string{Images.ImageID}
	ImagesLogger.Debug("Keys for Images %s: ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Images.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Images object")).Error(), nil)
	}

	if Avalbytes != nil {
		return cycoreutils.ConstructResponse("SASTQRY008E", fmt.Sprintf("Images already exists"), nil)
	}

	ImagesBytes, _ := cycoreutils.ObjecttoJSON(Images)

	err = cycoreutils.UpdateObject(stub, Images.ObjectType, keys, ImagesBytes, collectionName)

	if err != nil {
		ImagesLogger.Errorf("recordImages() : Error inserting Images object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Images object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded Images object"), ImagesBytes)
}

//////////////////////////////////////////////////////////////
/// Query Images Info from the ledger
//////////////////////////////////////////////////////////////
func queryImages(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var Avalbytes []byte
	var collectionName string
	var Images = &Images{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Images ID}. Received %d arguments", len(args)), nil)
	}

	Images.ObjectType = "Images"

	err = cycoreutils.JSONtoObject([]byte(args[0]), Images)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Images object")).Error(), nil)
	}

	// Query and Retrieve the Full Images
	keys := []string{Images.ImageID}
	ImagesLogger.Info("Keys for Images : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Images.ObjectType, keys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Images object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Images not found"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, Images)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to Images object")).Error(), nil)
	}

	ImagesLogger.Info("queryImages() : Returning Images results")

	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Images object"), Avalbytes)
}

//////////////////////////////////////////////////////////////
/// Query Images List from the ledger
//////////////////////////////////////////////////////////////
func queryImagesList(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var collectionName string
	collectionName = ""

	queryString := fmt.Sprintf("{\"selector\":{\"objectType\":\"Images\"}}")
	ImagesLogger.Info("Query List: queryString: ", queryString)

	queryResults, err := cycoreutils.GetQueryResultForQueryString(stub, queryString, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY006E", (errors.Wrapf(err, "Failed to query Images object list")).Error(), nil)
	}

	if queryResults == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("No Images record found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY007S", fmt.Sprintf("Successfully Retrieved the list of Images objects "), queryResults)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Update Images to the ledger by getting a copy of it, updating that copy, and overwriting the original to a newer version
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func updateImages(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var collectionName string

	var Images = &Images{}
	// Convert the arg to a updateImages object
	ImagesLogger.Info("updateImages() : Arguments for Query: Images : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Images)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Images object")).Error(), nil)
	}
	Images.ObjectType = "Images"
	// Query and Retrieve the Full updateImages
	keys := []string{Images.ImageID}
	ImagesLogger.Info("Keys for Images : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Images.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Images object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Images does not exist to update"), nil)
	}

	ImagesBytes, _ := cycoreutils.ObjecttoJSON(Images)

	err = cycoreutils.UpdateObject(stub, Images.ObjectType, keys, ImagesBytes, collectionName)

	if err != nil {
		ImagesLogger.Errorf("updateImages() : Error updating Images object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Images object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTUPD010S", fmt.Sprintf("Successfully Updated Images object"), ImagesBytes)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Delete Images from the ledger.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func deleteImages(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	ObjectType := "Images"
	var collectionName string
	var Images = &Images{}

	collectionName = ""

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Images ID}. Received %d arguments", len(args)), nil)
	}
	// Convert the arg to a deleteImages object
	ImagesLogger.Info("deleteImages() : Arguments for Query: Images : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Images)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Images object")).Error(), nil)
	}

	// Query and Retrieve the Full deleteImages
	keys := []string{Images.ImageID}
	ImagesLogger.Info("Keys for Images : ", keys)

	err = cycoreutils.DeleteObject(stub, ObjectType, keys, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTDEL012E", (errors.Wrapf(err, "Failed to delete Images object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTDEL013I", fmt.Sprintf("Successfully Deleted Images object"), nil)
}

//////////////////////////////////////////////////////////////
/// Query Images History from the ledger
//////////////////////////////////////////////////////////////
func queryImagesHistory(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var Images = &Images{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Images ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Images)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Images object")).Error(), nil)
	}

	// Query and Retrieve the Full Images
	keys := []string{Images.ImageID}
	ImagesLogger.Info("Keys for Images : ", keys)

	Avalbytes, err = cycoreutils.GetObjectHistory(stub, "Images", keys)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Images object history")).Error(), nil)
	}
	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Images object not found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY014S", fmt.Sprintf("Successfully Queried Images object History"), Avalbytes)
}
