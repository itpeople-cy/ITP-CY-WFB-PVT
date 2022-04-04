package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
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
	Status  string `json:"status`
	Message string `json:message`
}

/////////////////////////////////////////////////////
// Constant for All function name that will be called from invoke
/////////////////////////////////////////////////////
const (
	QRoleConfig  string = "queryRoleConfig"
	RRoleConfig  string = "recordRoleConfig"
	URoleConfig  string = "updateRoleConfig"
	DRoleConfig  string = "deleteRoleConfig"
	QFunAcsCheck string = "queryFunctionAccessCheck"
	QRoleConfigList  string = "queryRoleConfigList"
)

var logger = shim.NewLogger("simple-main")

type InvokeFunc func(stub shim.ChaincodeStubInterface, args []string) pb.Response

/////////////////////////////////////////////////////
// Map all the Functions here for Invoke
/////////////////////////////////////////////////////
func (t *ProjectKickerChaincode) initMaps() {
	t.tableMap = make(map[string]int)
	t.funcMap = make(map[string]InvokeFunc)
	t.funcMap[QRoleConfig] = queryRoleConfig
	t.funcMap[RRoleConfig] = recordRoleConfig
	t.funcMap[URoleConfig] = updateRoleConfig
	t.funcMap[DRoleConfig] = deleteRoleConfig
	t.funcMap[QFunAcsCheck] = queryFunctionAccessCheck
	t.funcMap[QRoleConfigList] = queryRoleConfigList

}

//////////////////////////////////////////////////////////////////////////////////
// Initialize Chaincode at Deploy Time
//////////////////////////////////////////////////////////////////////////////////
func (t *ProjectKickerChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### Init ###########")
	t.initMaps()
	isInit = true
	fmt.Println("ProjectKickerChaincode Init")
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
	logger.Info("########### Invoke/Query ###########")
	function, args := stub.GetFunctionAndParameters()
	f, ok := t.funcMap[function]
	if ok {
		return f(stub, args)
	}
	logger.Errorf("Invalid function name %s", function)
	return shim.Error(fmt.Sprintf("Invalid function %s", function))
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
	response, err := json.Marshal(res)
	if err != nil {
		logger.Errorf(fmt.Sprintf("Invalid function %s", err))
	}
	return response
}

func init() {
	logger.SetLevel(shim.LogDebug)
}

// JSONToAsset : Converts JSON String to an Asset Object
func JSONToAsset(data []byte) (Asset, error) {
	fmt.Println("JSONToAsset Init")
	asset := Asset{}
	err := json.Unmarshal([]byte(data), &asset)
	if err != nil {
		fmt.Println("Unmarshal failed : ", err)
	}
	fmt.Println("Asset : ", asset)
	return asset, err
}

// AssetToJSON : Converts Asset Object to JSON
func AssetToJSON(asset Asset) ([]byte, error) {
	fmt.Println("AssetToJSON Init")
	ajson, err := json.Marshal(asset)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	fmt.Println("Asset Bytes : ", ajson)
	return ajson, nil
}

// common function for unmarshalls : JSONtoObject function unmarshalls a JSON into an object
func JSONtoObject(data []byte, object interface{}) error {
	if err := json.Unmarshal([]byte(data), object); err != nil {
		logger.Errorf("Unmarshal failed : %s ", err.Error()) //SCOMCONV004E
		return err
	}
	logger.Debugf("**** %s Object %s: ", "", object)
	return nil
}

//  common function for marshalls :  ObjecttoJSON function marshalls an object into a JSON
func ObjecttoJSON(object interface{}) ([]byte, error) {
	var byteArray []byte
	var err error

	if byteArray, err = json.Marshal(object); err != nil {
		logger.Errorf("Marshal failed : %s ", err.Error()) //SCOMCONV005E
		return nil, err
	}

	if len(byteArray) == 0 {
		return nil, fmt.Errorf(("failed to convert object")) //SCOMLENB006E
	}

	logger.Debugf("**** %s is %s: ", "", object)
	return byteArray, nil
}
