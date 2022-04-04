package itpcutils

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type Document struct {
	ObjectType  string `json:"doctype"`
	ID          string `json:"id"`
	Type        string `json:"type"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Hash        string `json:"hash"`
	EntityType  string `json:"entitytype"`
	EntityID    string `json:"entityid"`
}

type validationParm struct {
	stub        shim.ChaincodeStubInterface
	shouldExist bool
	args        []string
}

type documentResponse struct {
	document      Document
	documentBytes []byte
	ccDocument    Document
	documentKeys  []string
	status        pb.Response
}

func RegisterDocument(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var ledgerDocumentBytes []byte
	var documentParam = validationParm{}
	var ledgerDocument = Document{}

	//Create the validation input parameter and call basic validation
	documentParam.args = args
	documentParam.stub = stub
	documentParam.shouldExist = false
	validation := documentValidation(documentParam)
	//Throw any returned error up the stack
	if validation.status.Status == shim.ERROR {
		return shim.Error(validation.status.GetMessage())
	}

	//Call the hash compare for the new Address which is stored in the ledger Address
	inputObject := string(validation.documentBytes)
	entityId := validation.document.EntityID
	hash, err := GenerateHash(inputObject, entityId)
	//Throw any exception up the stack
	if err != nil {
		return shim.Error(err.Error())
	}
	if hash == "" {
		//TODO: Need hash failure message
		msgBytes, _ := GetMessageError("CYDOCHSH014I", err.Error())
		return shim.Error(string(msgBytes))
	}
	ledgerDocument.ObjectType = DOCUMENT
	ledgerDocument.ID = validation.document.ID
	ledgerDocument.EntityID = validation.document.EntityID
	ledgerDocument.EntityType = validation.document.EntityType
	ledgerDocument.Hash = hash
	ledgerDocument.Name = validation.document.Name
	ledgerDocument.Type = validation.document.Type
	ledgerDocument.Description = validation.document.Description

	//We have a valid object that does not exist in the ledger, so we can convert it to bytes
	ledgerDocumentBytes, err = cycoreutils.ObjecttoJSON(ledgerDocument)
	if err != nil {
		msgBytes, _ := GetMessageError("CYDOCCONV003E", err.Error())
		return shim.Error(string(msgBytes))
	}
	///Wer can now add the object to the ledger
	if err = cycoreutils.UpdateObject(stub, DOCUMENT, validation.documentKeys, ledgerDocumentBytes); err != nil {
		msgBytes, _ := GetMessageError("CYDOCUPD006E", err.Error())
		return shim.Error(string(msgBytes))
	}
	msgBytes, _ := GetMessageObject("CYDOCREG007I", fmt.Sprintf("Successfully registered document %s", validation.document.EntityID), string(args[0]))
	return shim.Success(msgBytes)
}

// UPDATE DOCUMENT
func UpdateDocument(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var ledgerDocumentBytes []byte
	var document = &Document{}
	var documentParam = validationParm{}

	//Create the validation input parameter and call basic validation
	documentParam.args = args
	documentParam.stub = stub
	documentParam.shouldExist = true
	validation := documentValidation(documentParam)
	//Throw any returned error up the stack
	if validation.status.Status == shim.ERROR {
		return shim.Error(validation.status.GetMessage())
	}

	//Call the hash generate and compare passing in the original ledger entity id
	entityId := validation.ccDocument.EntityID
	inputObject := string(validation.documentBytes)
	hash, err := GenerateHash(inputObject, entityId)
	//Throw any exception up the stack
	if err != nil {
		return shim.Error(err.Error())
	}
	if hash == "" {
		//TODO: Need hash failure message
		msgBytes, _ := GetMessageError("CYDOCHSH014I", err.Error())
		return shim.Error(string(msgBytes))
	}
	validation.document.Hash = hash
	//Convert incoming address object to JSON object
	if ledgerDocumentBytes, err = cycoreutils.ObjecttoJSON(validation.document); err != nil {
		msgBytes, _ := GetMessageError("CYDOCCONV003E", err.Error())
		return shim.Error(string(msgBytes))
	}

	//Update the existing records with the new Hash
	if err = cycoreutils.UpdateObject(stub, DOCUMENT, validation.documentKeys, ledgerDocumentBytes); err != nil {
		msgBytes, _ := GetMessageError("CYDOCUPD006E", err.Error())
		return shim.Error(string(msgBytes))
	}

	//return the original data
	msgBytes, _ := GetMessageObject("CYDOCUPD010I", fmt.Sprintf("Successfully updated document %s", document.ID), args[0])
	return shim.Success(msgBytes)
}

func GetDocument(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//Call the hash generate and compare passing in the original ledger entity id
	// Check number of parameters
	if len(args) < 1 {
		msgBytes, _ := GetMessageDetail("CYDOCPARM001E", fmt.Sprintf("Received %d parameters", len(args)))
		return shim.Error(string(msgBytes))

	}

	documentKeys := []string{args[0]}

	objBytes, err := cycoreutils.QueryObject(stub, DOCUMENT, documentKeys)

	if err != nil {
		return shim.Error(GetMessageErrorString("CYDOCQRY004E", err))
	}

	if objBytes == nil {
		return shim.Error(GetMessageErrorString("CYDOCDNE009E", nil))
	}

	return shim.Success(GetSuccessResponse("CYDOCQRY013I", objBytes))

}

func DeleteDocument(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//Call the hash generate and compare passing in the original ledger entity id
	// Check number of parameters
	if len(args) < 1 {
		msgBytes, _ := GetMessageDetail("CYDOCPARM001E", fmt.Sprintf("Received %d parameters", len(args)))
		return shim.Error(string(msgBytes))

	}

	documentKeys := []string{args[0]}

	if err := cycoreutils.DeleteObject(stub, DOCUMENT, documentKeys); err != nil {
		msgBytes, _ := GetMessageError("CYDOCDEL011E", err.Error())
		return shim.Error(string(msgBytes))
	}

	msgBytes, _ := GetMessageDetail("CYDOCDEL012I", fmt.Sprintf("Successfully deleted document %s", documentKeys[0]))
	return shim.Success(msgBytes)
}

func documentValidation(request validationParm) documentResponse {
	var documentBytes []byte
	var document = &Document{}
	var err error
	var response = documentResponse{}

	// Check number of parameters
	if len(request.args) < 1 {
		msgBytes, _ := GetMessageDetail("CYDOCPARM001E", fmt.Sprintf("Received %d parameters", len(request.args)))
		response.status = shim.Error(string(msgBytes))
		return response
	}
	//Convert inbound documnet data into Document struc
	if err = cycoreutils.JSONtoObject([]byte(request.args[0]), document); err != nil {
		msgBytes, _ := GetMessageError("CYDOCCONV002E", err.Error())
		response.status = shim.Error(string(msgBytes))
		return response
	}
	response.documentBytes, err = cycoreutils.cycoreutils.ObjecttoJSON(document)
	if err != nil {
		msgBytes, _ := GetMessageError("CYDOCCONV002E", err.Error())
		response.status = shim.Error(string(msgBytes))
		return response
	}

	documentKeys := []string{document.ID}

	//Retrieve the document object from the ledger
	if documentBytes, err = cycoreutils.QueryObject(request.stub, DOCUMENT, documentKeys); err != nil {
		msgBytes, _ := GetMessageError("CYDOCQRY004E", err.Error())
		response.status = shim.Error(string(msgBytes))
		return response
	}
	//If it should exist but does not, then error
	if documentBytes == nil && request.shouldExist {
		msgBytes, _ := GetMessageDetail("CYDOCQRY004E", fmt.Sprintf("Document does not exist with entity ID %s ", document.ID))
		response.status = shim.Error(string(msgBytes))
		return response
	}
	//If it should not exist but does then error
	if documentBytes != nil && !request.shouldExist {
		msgBytes, _ := GetMessageDetail("CYDOCAE005E", fmt.Sprintf("Document already exists with addressID %s", document.ID))
		response.status = shim.Error(string(msgBytes))
		return response
	}

	if request.shouldExist {
		err = cycoreutils.JSONtoObject(documentBytes, &response.ccDocument)
		if err != nil {
			msgBytes, _ := GetMessageError("CYDOCCONV002E", err.Error())
			response.status = shim.Error(string(msgBytes))
			return response
		}
	}
	response.status = shim.Success(nil)
	response.document = *document
	response.documentKeys = documentKeys
	return response
}

// UPDATE DOCUMENT
//  Input: Document JSON parameter
//  Output: Message indicating status of document update.
// The received JSON is converted to the type object.
// Unique keys are generated for the received document parameter and the ledger is queried using these keys.
// If the output of the query is null, it implies that the no document with the given key exist. Hence a corresponding error message is displayed to the user.
// If the output of the query is not null, the corresponding document is updated on the ledger and a success message is displayed as the output.
func GetDocuments(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//Call the hash generate and compare passing in the original ledger entity id
	// Check number of parameters
	if len(args) < 1 {
		msgBytes, _ := GetMessageDetail("CYDOCPARM001E", fmt.Sprintf("Received %d parameters", len(args)))
		return shim.Error(string(msgBytes))

	}
	var document = &Document{}
	//Convert inbound documnet data into Document struc
	if err := cycoreutils.JSONtoObject([]byte(args[0]), document); err != nil {
		msgBytes, _ := GetMessageError("CYDOCCONV002E", err.Error())
		return shim.Error(string(msgBytes))

	}

	queryString := prepareDocumentQuery(*document, nil)

	queryResults, err := GetQueryResultForQueryString(stub, queryString)

	if err != nil {
		return shim.Error(GetMessageErrorString("SCONQRY004E", err))
	}

	return shim.Success(GetSuccessResponse("SCONQRY024S", queryResults))
}

func prepareDocumentQuery(document Document, filter []string) string {
	// query object
	queryMap := map[string]interface{}{}

	// selector object
	selector := map[string]interface{}{
		"doctype": DOCUMENT,
	}
	if document.EntityID != "" {
		selector["entityid"] = document.EntityID
	}
	queryMap["selector"] = selector
	jsonString, err := cycoreutils.ObjecttoJSON(queryMap)
	println(" ***** Error while constructing query **** ", err)
	queryString := fmt.Sprintf(string(jsonString[:]))

	println(" ***** Query **** ", queryString)

	return queryString
}
