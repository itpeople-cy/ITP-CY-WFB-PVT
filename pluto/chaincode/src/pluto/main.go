package main

import (
	"cycoreutils"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/lib/cid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"github.com/pkg/errors"
)

// ProjectKickerChaincode example - simple Chaincode implementation
type ProjectKickerChaincode struct {
	tableMap map[string]int
	funcMap  map[string]InvokeFunc
}

// Sample Asset struct
type Asset struct {
	ObjectType string `json:"objectType"`
	AssetID    string `json:"assetId"`
	AssetValue string `json:"assetValue"`
}

type Response struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type Role struct {
	Role         string `json:"role"`
	FunctionName string `json:"functionName"`
}

/////////////////////////////////////////////////////
// Constant for All function name that will be called from invoke
/////////////////////////////////////////////////////
const (
	QProduct        string = "queryProduct"
	RProduct        string = "recordProduct"
	UProduct        string = "updateProduct"
	DProduct        string = "deleteProduct"
	QProductL       string = "queryProductList"
	QProductHistory string = "queryProductHistory"

	QUntaggedProducts  string = "queryUntaggedProductsbyBrand"
	QProductsByBrand   string = "queryProductsbyBrand"
	QUnshippedProducts string = "queryUnshippedProducts"

	QProductProfile        string = "queryProductProfile"
	RProductProfile        string = "recordProductStyle"
	UProductProfile        string = "updateProductProfile"
	DProductProfile        string = "deleteProductProfile"
	QProductProfileL       string = "queryProductProfileList"
	QProductProfileHistory string = "queryProductProfileHistory"
	QProductbyRetailer     string = "queryProductbyRetailer"

	QProductProfileBrand string = "queryProductProfilebyBrand"

	QProductStyleSignature        string = "queryProductStyleSignature"
	RProductStyleSignature        string = "recordProductStyleSignature"
	UProductStyleSignature        string = "updateProductStyleSignature"
	DProductStyleSignature        string = "deleteProductStyleSignature"
	QProductStyleSignatureL       string = "queryProductStyleSignatureList"
	QProductStyleSignatureHistory string = "queryProductStyleSignatureHistory"

	QImages        string = "queryImages"
	RImages        string = "recordImages"
	UImages        string = "updateImages"
	DImages        string = "deleteImages"
	QImagesL       string = "queryImagesList"
	QImagesHistory string = "queryImagesHistory"

	QManufacturer        string = "queryManufacturer"
	RManufacturer        string = "recordManufacturer"
	UManufacturer        string = "updateManufacturer"
	DManufacturer        string = "deleteManufacturer"
	QManufacturerL       string = "queryManufacturerList"
	QManufacturerHistory string = "queryManufacturerHistory"

	RFactory        string = "recordFactory"
	QFactory        string = "queryFactory"
	QFactorybyBrand string = "queryFactorybyBrand"

	QRetailer        string = "queryRetailer"
	RRetailer        string = "recordRetailer"
	URetailer        string = "updateRetailer"
	DRetailer        string = "deleteRetailer"
	QRetailerL       string = "queryRetailerList"
	QRetailerHistory string = "queryRetailerHistory"

	QTagSupplier        string = "queryTagSupplier"
	RTagSupplier        string = "recordTagSupplier"
	UTagSupplier        string = "updateTagSupplier"
	DTagSupplier        string = "deleteTagSupplier"
	QTagSupplierL       string = "queryTagSupplierList"
	QTagSupplierHistory string = "queryTagSupplierHistory"

	QTag        string = "queryTag"
	RTag        string = "recordTag"
	UTag        string = "updateTag"
	DTag        string = "deleteTag"
	QTagL       string = "queryTagList"
	QTagHistory string = "queryTagHistory"

	RScan     string = "recordScan"
	QScanbyID string = "queryScanbyID"

	QTagsbyBrand    string = "queryTagsbyBrand"
	ATagtoProduct   string = "assignTagtoProduct"
	RTagProduct     string = "recordTagforProduct"
	AuthenticateTag string = "authenticateTag"

	QBrand        string = "queryBrand"
	RBrand        string = "recordBrand"
	UBrand        string = "updateBrand"
	DBrand        string = "deleteBrand"
	QBrandL       string = "queryBrandList"
	QBrandHistory string = "queryBrandHistory"

	QBrandbyTagTechnology string = "queryBrandbyTagTechnology"
	QBrandbyManufacturer  string = "queryBrandbyManufacturer"

	QTransaction        string = "queryTransaction"
	RTransaction        string = "recordTransaction"
	UTransaction        string = "updateTransaction"
	DTransaction        string = "deleteTransaction"
	QTransactionL       string = "queryTransactionList"
	QTransactionHistory string = "queryTransactionHistory"

	VCertificateHash string = "verifyCertificateHash"
)

var logger = shim.NewLogger("project-kicker-main")

type InvokeFunc func(stub shim.ChaincodeStubInterface, args []string) cycoreutils.Response

/////////////////////////////////////////////////////
// Map all the Functions here for Invoke
/////////////////////////////////////////////////////
func (t *ProjectKickerChaincode) initMaps() {
	t.tableMap = make(map[string]int)
	t.funcMap = make(map[string]InvokeFunc)

	t.funcMap[QProduct] = queryProduct
	t.funcMap[RProduct] = recordProduct
	t.funcMap[UProduct] = updateProduct
	t.funcMap[DProduct] = deleteProduct
	t.funcMap[QProductL] = queryProductList
	t.funcMap[QProductHistory] = queryProductHistory
	t.funcMap[QUntaggedProducts] = queryUntaggedProductsbyBrand
	t.funcMap[QProductsByBrand] = queryProductsbyBrand
	t.funcMap[QUnshippedProducts] = queryUnshippedProducts
	//t.funcMap[SProductCode] = scanProductCode

	t.funcMap[QProductProfile] = queryProductProfile
	t.funcMap[RProductProfile] = recordProductStyle
	t.funcMap[UProductProfile] = updateProductProfile
	t.funcMap[DProductProfile] = deleteProductProfile
	t.funcMap[QProductProfileL] = queryProductProfileList
	t.funcMap[QProductProfileHistory] = queryProductProfileHistory
	t.funcMap[QProductProfileBrand] = queryProductProfilebyBrand

	t.funcMap[QProductStyleSignature] = queryProductStyleSignature
	t.funcMap[RProductStyleSignature] = recordProductStyleSignature
	t.funcMap[UProductStyleSignature] = updateProductStyleSignature
	t.funcMap[DProductStyleSignature] = deleteProductStyleSignature
	t.funcMap[QProductStyleSignatureL] = queryProductStyleSignatureList
	t.funcMap[QProductStyleSignatureHistory] = queryProductStyleSignatureHistory

	t.funcMap[QFactorybyBrand] = queryFactorybyBrand
	t.funcMap[QBrandbyTagTechnology] = queryBrandbyTagTechnology
	//t.funcMap[STag] = scanTag
	t.funcMap[QFactory] = queryFactory

	t.funcMap[QImages] = queryImages
	t.funcMap[RImages] = recordImages
	t.funcMap[UImages] = updateImages
	t.funcMap[DImages] = deleteImages
	t.funcMap[QImagesL] = queryImagesList
	t.funcMap[QImagesHistory] = queryImagesHistory

	t.funcMap[QBrandbyManufacturer] = queryBrandbyManufacturer
	t.funcMap[QTagsbyBrand] = queryTagsbyBrand
	t.funcMap[QManufacturer] = queryManufacturer
	t.funcMap[RManufacturer] = recordManufacturer
	t.funcMap[UManufacturer] = updateManufacturer
	t.funcMap[DManufacturer] = deleteManufacturer
	t.funcMap[QManufacturerL] = queryManufacturerList
	t.funcMap[QManufacturerHistory] = queryManufacturerHistory

	t.funcMap[QProductbyRetailer] = queryProductbyRetailer
	t.funcMap[QRetailer] = queryRetailer
	t.funcMap[RRetailer] = recordRetailer
	t.funcMap[URetailer] = updateRetailer
	t.funcMap[DRetailer] = deleteRetailer
	t.funcMap[QRetailerL] = queryRetailerList
	t.funcMap[QRetailerHistory] = queryRetailerHistory

	t.funcMap[RFactory] = recordFactory

	t.funcMap[QTagSupplier] = queryTagSupplier
	t.funcMap[RTagSupplier] = recordTagSupplier
	t.funcMap[UTagSupplier] = updateTagSupplier
	t.funcMap[DTagSupplier] = deleteTagSupplier
	t.funcMap[QTagSupplierL] = queryTagSupplierList
	t.funcMap[QTagSupplierHistory] = queryTagSupplierHistory

	t.funcMap[RScan] = recordScan
	t.funcMap[QScanbyID] = queryScanbyID

	t.funcMap[QTag] = queryTag
	t.funcMap[RTag] = recordTag
	t.funcMap[RTagProduct] = recordTagforProduct
	t.funcMap[UTag] = updateTag
	t.funcMap[DTag] = deleteTag
	t.funcMap[QTagL] = queryTagList
	t.funcMap[QTagHistory] = queryTagHistory
	t.funcMap[AuthenticateTag] = authenticateTag
	t.funcMap[QBrand] = queryBrand
	t.funcMap[RBrand] = recordBrand
	t.funcMap[UBrand] = updateBrand
	t.funcMap[DBrand] = deleteBrand
	t.funcMap[QBrandL] = queryBrandList
	t.funcMap[QBrandHistory] = queryBrandHistory

	t.funcMap[QTransaction] = queryTransaction
	t.funcMap[RTransaction] = recordTransaction
	t.funcMap[UTransaction] = updateTransaction
	t.funcMap[DTransaction] = deleteTransaction
	t.funcMap[QTransactionL] = queryTransactionList
	t.funcMap[QTransactionHistory] = queryTransactionHistory

	t.funcMap[ATagtoProduct] = assignTagtoProduct
	t.funcMap[VCertificateHash] = verifyCertificateHash
}

//////////////////////////////////////////////////////////////////////////////////
// Initialize Chaincode at Deploy Time
//////////////////////////////////////////////////////////////////////////////////
func (t *ProjectKickerChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### Init ###########")
	t.initMaps()
	isInit = true
	logger.Info("ProjectKickerChaincode Init")
	return shim.Success((GetResponse("success", "Succesfully Initiated ProjectKickerChaincode")))
}

//////////////////////////////////////////////////////////////////////////////////
// Invoke Chaincode functions as requested by the Invoke Function
// In fabric 1.0 both Invoke and Query Requests are handled by Invoke
//////////////////////////////////////////////////////////////////////////////////
func (t *ProjectKickerChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	//Temporay fix  if the initialization not done on the specific peer do it before Invoke a method
	if !isInit {
		t.initMaps()
		isInit = true
	}

	var returnValue cycoreutils.Response
	function, args := stub.GetFunctionAndParameters()
	f, ok := t.funcMap[function]
	var access bool
	var err error
	if ok {
		access, err = functionCheckAccess(stub, function)

		if err != nil {
			logger.Errorf("Error in fetching access. For function Name:%s ", function)
			return shim.Error(string("{\"function\":function,\"error\":err}"))
		}
		if !access {
			logger.Errorf("Invalid access for function:%s", function)
			return shim.Error(string("{\"status\":\"ERROR\",\"function\":" + function + ",\"description\":\"Unauthorized\",\"detail\":\"Unauthorized\"}"))
		}
		logger.Infof("########### Invoke/Query ###########: %s", function)

		rargs, err := stub.GetTransient()
		if err != nil {
			logger.Infof("arg[0] is not transient: %s", err.Error())
		} else {
			targs, ok1 := rargs["pargs"]
			if ok1 {
				args[0] = string(targs[:])
				logger.Info("arg[0] is transient")
			} else {
				logger.Error("arg[0] transient but could not read properly")
			}
		}

		returnValue = f(stub, args)
		returnBytes, err := cycoreutils.ObjecttoJSON(returnValue)
		if err != nil {
			logger.Errorf("Error converting the Result to JSON bytes: %s", err.Error())
			logger.Debugf("Returned Value: %+v", returnValue)
			return shim.Error(string("{\"status\":\"ERROR\",\"description\":\"Unexpected end of action. Please retry!\",\"detail\":\"" +
				(errors.Wrap(err, "Error converting the Result to JSON bytes")).Error() + "\"}"))
		}

		if returnValue.Status != "SUCCESS" {
			logger.Errorf("%s Error returned from chaincode %s", function, string(returnBytes))
			return shim.Error(string(returnBytes))
		}

		return shim.Success(returnBytes)

	}
	logger.Errorf("Invalid function name %s", function)
	return shim.Error(fmt.Sprintf("Invalid function %s", function))
}

func functionCheckAccess(stub shim.ChaincodeStubInterface, functionName string) (bool, error) {
	logger.Infof("functionCheckAccess() Entry--> ")
	var err error
	role, ok, err := cid.GetAttributeValue(stub, "role")

	if err != nil {
		return false, err
	}

	if !ok {
		return false, err
	}

	keyRole := Role{Role: role, FunctionName: functionName}

	keys, err := RoleToJSON(keyRole)

	logger.Infof("Keys for functionCheckAccess : ", string(keys))

	f := "queryFunctionAccessCheck"

	invokeArgs := toChaincodeArgs(f, string(keys))

	response := stub.InvokeChaincode("role_manager", invokeArgs, "defaultchannel")
	logger.Info("response status 1", response.Status)
	if response.Status != 200 {
		return false, nil
	}
	access := string(response.Payload[:])
	logger.Infof("Access recevied from AccessChecker chaincode is: %s", access)

	return true, nil
}

func toChaincodeArgs(args ...string) [][]byte {
	bargs := make([][]byte, len(args))
	for i, arg := range args {
		bargs[i] = []byte(arg)
	}
	return bargs
}

var isInit = false

func main() {
	logger.Info("ProjectKickerChaincode: main(): Init ")
	err := shim.Start(new(ProjectKickerChaincode))
	if err != nil {
		logger.Errorf("ProjectKickerChaincode: main(): Error starting Simple Chaincode : %s", err)
	}
}

//Prepare the response
func GetResponse(status string, message string) []byte {
	res := Response{Status: status, Message: message}
	logger.Info("GetResponse: Called For: ", res)
	response, err := cycoreutils.ObjecttoJSON(res)
	if err != nil {
		logger.Errorf(fmt.Sprintf("Invalid function %s", err))
	}
	return response
}

func init() {
	logger.SetLevel(shim.LogDebug)
}

// RoleToJSON : Converts Role Object to JSON
func RoleToJSON(role Role) ([]byte, error) {
	fmt.Println("RoleToJSON Init")
	rjson, err := json.Marshal(role)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	fmt.Println("Role Bytes : ", rjson)
	return rjson, nil
}
