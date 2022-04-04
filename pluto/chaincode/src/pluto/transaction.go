package main

import (
	"cycoreutils"
	"fmt"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/pkg/errors"
)

var TransactionLogger = shim.NewLogger("Transaction")

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record Transaction to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordTransaction(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string

	var TagSupplierbytes []byte
	var Productbytes []byte
	var TagBytes []byte
	var UpdatedTagBytes []byte

	var UpdatedTransaction = &Transaction{}
	var InputTransaction = &Transaction{}
	var TagSupplier = &TagSupplier{}
	var Tag = &Tag{}
	var Product = &Product{}

	// Convert the arg to a recordTransaction object
	TransactionLogger.Info("recordTransaction() : Arguments for recordTransaction : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), InputTransaction)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Transaction object")).Error(), nil)
	}

	//retrive the Tag Supplier
	err = cycoreutils.JSONtoObject([]byte(args[1]), Tag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Tag object")).Error(), nil)
	}

	//retrieve the Tag
	Tagkeys := []string{Tag.TagID}
	TagLogger.Info("Keys for Tag : ", Tagkeys)

	collectionName = ""

	TagBytes, err = cycoreutils.QueryObject(stub, "Tag", Tagkeys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Tag object")).Error(), nil)
	}

	if TagBytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Tag not found"), nil)
	}
	err = cycoreutils.JSONtoObject(TagBytes, Tag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to Tag object")).Error(), nil)
	}

	if Tag.Status == "deactivated" {
		return cycoreutils.ConstructResponse("SPRODUCT002E", fmt.Sprintf("Tag has been deactivated. Product is already sold"), nil)
	}
	//retrieve the TagSupplier
	TagSupplierkeys := []string{Tag.TagSupplierID}
	TagLogger.Info("Keys for Tag Supplier: ", TagSupplierkeys)

	collectionName = ""

	TagSupplierbytes, err = cycoreutils.QueryObject(stub, "TagSupplier", TagSupplierkeys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Tag Supplier object")).Error(), nil)
	}

	if TagSupplierbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Tag Supplier not found"), nil)
	}

	err = cycoreutils.JSONtoObject(TagSupplierbytes, TagSupplier)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to Tag Supplier object")).Error(), nil)
	}

	//retrieve product
	productkeys := []string{Tag.ProductID}
	TagLogger.Info("Keys for Product : ", productkeys)

	collectionName = ""

	Productbytes, err = cycoreutils.QueryObject(stub, "Product", productkeys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query product object")).Error(), nil)
	}

	if Productbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
	}
	// logger.Infof("productbytes", string(Productbytes))
	err = cycoreutils.JSONtoObject(Productbytes, Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to Product object")).Error(), nil)
	}

	//generate the cert hash
	hashSum, err := generateCertHash([]string{Tag.TagTechnology, Product.ManufacturerID, Product.FactoryID, Product.ProductID, Product.BrandID, Product.ManufactureDate, InputTransaction.Registration.EmailID}, []int{6, 1, 0, 2, 3, 4, 5})
	if err != nil {
		return cycoreutils.ConstructResponse("SHASH001E", (errors.Wrapf(err, "Failed to generate certificate hash")).Error(), nil)
	}

	//generate the transaction
	UpdatedTransaction.ObjectType = "Transaction"
	UpdatedTransaction.TransactionID = InputTransaction.TransactionID
	UpdatedTransaction.RetailerID = InputTransaction.RetailerID
	UpdatedTransaction.ProductID = InputTransaction.ProductID
	UpdatedTransaction.Location = InputTransaction.Location
	UpdatedTransaction.Date = InputTransaction.Date
	UpdatedTransaction.Registration = InputTransaction.Registration
	UpdatedTransaction.Registration.CertificateHash = hashSum

	TransactionBytes, _ := cycoreutils.ObjecttoJSON(UpdatedTransaction)

	transactionkeys := []string{UpdatedTransaction.TransactionID}
	TagLogger.Info("Keys for Transaction : ", transactionkeys)

	err = cycoreutils.UpdateObject(stub, UpdatedTransaction.ObjectType, transactionkeys, TransactionBytes, collectionName)

	if err != nil {
		TransactionLogger.Errorf("recordTransaction() : Error inserting Transaction object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Transaction object update failed")).Error(), nil)
	}

	Tag.Status = "deactivated"
	UpdatedTagBytes, _ = cycoreutils.ObjecttoJSON(Tag)

	err = cycoreutils.UpdateObject(stub, Tag.ObjectType, Tagkeys, UpdatedTagBytes, collectionName)

	if err != nil {
		ProductLogger.Errorf("updateProduct() : Error updating Tag object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Tag object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded Transaction object"), TransactionBytes)
}

func verifyCertificateHash(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var collectionName string

	var ProductBytes []byte
	var TagBytes []byte

	var InputTransaction = &Transaction{}

	var Tag = &Tag{}
	var Product = &Product{}
	var Authenticate = &Authenticate{}

	// Convert the arg to a recordTransaction object
	TransactionLogger.Info("recordTransaction() : Arguments for recordTransaction : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), InputTransaction)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Transaction object")).Error(), nil)
	}

	//query the product
	productkeys := []string{InputTransaction.ProductID}
	collectionName = ""

	ProductBytes, err = cycoreutils.QueryObject(stub, "Product", productkeys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query product object")).Error(), nil)
	}

	if ProductBytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Product not found"), nil)
	}
	err = cycoreutils.JSONtoObject(ProductBytes, Product)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to product object")).Error(), nil)
	}

	//retrieve the Tag
	Tagkeys := []string{Product.TagID}
	TagLogger.Info("Keys for Tag : ", Tagkeys)

	collectionName = ""

	TagBytes, err = cycoreutils.QueryObject(stub, "Tag", Tagkeys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Tag object")).Error(), nil)
	}

	if TagBytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Tag not found"), nil)
	}
	err = cycoreutils.JSONtoObject(TagBytes, Tag)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to Tag object")).Error(), nil)
	}

	//regenerate the cert hash using the email provided
	hashSum, err := generateCertHash([]string{Tag.TagTechnology, Product.ManufacturerID, Product.FactoryID, Product.ProductID, Product.BrandID, Product.ManufactureDate, InputTransaction.Registration.EmailID}, []int{6, 1, 0, 2, 3, 4, 5})
	if err != nil {
		return cycoreutils.ConstructResponse("SHASH001E", (errors.Wrapf(err, "Failed to generate hash")).Error(), nil)
	}

	if hashSum == InputTransaction.Registration.CertificateHash {
		Authenticate.IsAuthentic = true
	} else {
		Authenticate.IsAuthentic = false
	}

	logger.Infof("Authenticate.IsAuthentic", Authenticate.IsAuthentic)
	authenticatebytes, _ := cycoreutils.ObjecttoJSON(Authenticate)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to authenticate object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTREC011S", fmt.Sprintf("Successfully Recorded Transaction object"), authenticatebytes)
}

//////////////////////////////////////////////////////////////
/// Query Transaction Info from the ledger
//////////////////////////////////////////////////////////////
func queryTransaction(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	var Avalbytes []byte
	var collectionName string
	var Transaction = &Transaction{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Transaction ID}. Received %d arguments", len(args)), nil)
	}

	Transaction.ObjectType = "Transaction"

	err = cycoreutils.JSONtoObject([]byte(args[0]), Transaction)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrap(err, "Failed to convert arg[0] to Transaction object")).Error(), nil)
	}

	// Query and Retrieve the Full Transaction
	keys := []string{Transaction.TransactionID}
	TransactionLogger.Info("Keys for Transaction : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Transaction.ObjectType, keys, collectionName)

	if err != nil {
		cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Transaction object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Transaction not found"), nil)
	}

	err = cycoreutils.JSONtoObject(Avalbytes, Transaction)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert query result to Transaction object")).Error(), nil)
	}

	TransactionLogger.Info("queryTransaction() : Returning Transaction results")

	return cycoreutils.ConstructResponse("SASTQRY005S", fmt.Sprintf("Successfully Queried Transaction object"), Avalbytes)
}

//////////////////////////////////////////////////////////////
/// Query Transaction List from the ledger
//////////////////////////////////////////////////////////////
func queryTransactionList(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var collectionName string
	collectionName = ""

	queryString := fmt.Sprintf("{\"selector\":{\"objectType\":\"Transaction\"}}")
	TransactionLogger.Info("Query List: queryString: ", queryString)

	queryResults, err := cycoreutils.GetQueryResultForQueryString(stub, queryString, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY006E", (errors.Wrapf(err, "Failed to query Transaction object list")).Error(), nil)
	}

	if queryResults == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("No Transaction record found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY007S", fmt.Sprintf("Successfully Retrieved the list of Transaction objects "), queryResults)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Update Transaction to the ledger by getting a copy of it, updating that copy, and overwriting the original to a newer version
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func updateTransaction(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var collectionName string

	var Transaction = &Transaction{}
	// Convert the arg to a updateTransaction object
	TransactionLogger.Info("updateTransaction() : Arguments for Query: Transaction : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Transaction)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Transaction object")).Error(), nil)
	}
	Transaction.ObjectType = "Transaction"
	// Query and Retrieve the Full updateTransaction
	keys := []string{Transaction.TransactionID}
	TransactionLogger.Info("Keys for Transaction : ", keys)

	collectionName = ""

	Avalbytes, err = cycoreutils.QueryObject(stub, Transaction.ObjectType, keys, collectionName)

	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Transaction object")).Error(), nil)
	}

	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Transaction does not exist to update"), nil)
	}

	TransactionBytes, _ := cycoreutils.ObjecttoJSON(Transaction)

	err = cycoreutils.UpdateObject(stub, Transaction.ObjectType, keys, TransactionBytes, collectionName)

	if err != nil {
		TransactionLogger.Errorf("updateTransaction() : Error updating Transaction object into LedgerState %s", err)
		return cycoreutils.ConstructResponse("SASTUPD009E", (errors.Wrapf(err, "Transaction object update failed")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTUPD010S", fmt.Sprintf("Successfully Updated Transaction object"), TransactionBytes)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Delete Transaction from the ledger.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func deleteTransaction(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {

	var err error
	ObjectType := "Transaction"
	var collectionName string
	var Transaction = &Transaction{}

	collectionName = ""

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Transaction ID}. Received %d arguments", len(args)), nil)
	}
	// Convert the arg to a deleteTransaction object
	TransactionLogger.Info("deleteTransaction() : Arguments for Query: Transaction : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), Transaction)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Transaction object")).Error(), nil)
	}

	// Query and Retrieve the Full deleteTransaction
	keys := []string{Transaction.TransactionID}
	TransactionLogger.Info("Keys for Transaction : ", keys)

	err = cycoreutils.DeleteObject(stub, ObjectType, keys, collectionName)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTDEL012E", (errors.Wrapf(err, "Failed to delete Transaction object")).Error(), nil)
	}

	return cycoreutils.ConstructResponse("SASTDEL013I", fmt.Sprintf("Successfully Deleted Transaction object"), nil)
}

//////////////////////////////////////////////////////////////
/// Query Transaction History from the ledger
//////////////////////////////////////////////////////////////
func queryTransactionHistory(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response {
	var err error
	var Avalbytes []byte
	var Transaction = &Transaction{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return cycoreutils.ConstructResponse("SUSRPARM001E", fmt.Sprintf("Expecting Transaction ID}. Received %d arguments", len(args)), nil)
	}

	err = cycoreutils.JSONtoObject([]byte(args[0]), Transaction)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTCONV002E", (errors.Wrapf(err, "Failed to convert arg[0] to Transaction object")).Error(), nil)
	}

	// Query and Retrieve the Full Transaction
	keys := []string{Transaction.TransactionID}
	TransactionLogger.Info("Keys for Transaction : ", keys)

	Avalbytes, err = cycoreutils.GetObjectHistory(stub, "Transaction", keys)
	if err != nil {
		return cycoreutils.ConstructResponse("SASTQRY003E", (errors.Wrapf(err, "Failed to query Transaction object history")).Error(), nil)
	}
	if Avalbytes == nil {
		return cycoreutils.ConstructResponse("SASTDNE004E", fmt.Sprintf("Transaction object not found"), nil)
	}

	return cycoreutils.ConstructResponse("SASTQRY014S", fmt.Sprintf("Successfully Queried Transaction object History"), Avalbytes)
}

func generateCertHash(args []string, pattern []int) (string, error) {

	// Checj Argument count
	if len(args) < 7 {
		return "", errors.New("Not Enough Arguments")
	}

	if !strings.Contains(args[6], "@") {
		return "", errors.New("Invalid email address")
	}

	// Return Hash
	return generateHash(args, pattern)

}
