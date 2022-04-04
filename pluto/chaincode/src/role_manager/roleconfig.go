package main

import (
	"cycoreutils"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func getKeyForMap(chaincodeName string, org string, role string) string {
	return chaincodeName + "_" + org + "_" + role
}

func queryFunctionAccessCheck(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Infof("queryFunctionAccessCheck Entry-->")

	var err error
	var Avalbytes []byte
	var RoleConfig = &RoleConfig{}
	var AvailableActions []string
	var access bool

	var AccessReq = &AccessReqQueryObj{}

	if len(args) != 1 {
		return shim.Error("queryFunctionAccessCheck() Incorrect number of arguments. Expecting RoleConfig ID")
	}

	err = JSONtoObject([]byte(args[0]), AccessReq)
	if err != nil {
		return shim.Error("queryFunctionAccessCheck() Failed to convert arg[0] to object")
	}

	logger.Infof("queryFunctionAccessCheck input: %+v", AccessReq)

	// Query and Retrieve the Full RoleConfig
	keys := []string{AccessReq.Role}
	logger.Infof("Keys for RoleConfig : ", keys)

	Avalbytes, err = cycoreutils.QueryObject(stub, "RoleConfig", keys, "")
	if Avalbytes == nil {
		return shim.Error("Could not get any existing role config")
	}

	err = JSONtoObject(Avalbytes, RoleConfig)
	if err != nil {
		return shim.Error("Failed to convert stored ledger data into RoleConfig object")
	}

	logger.Info("avalbytes", string(Avalbytes))

	AvailableActions = RoleConfig.RoleAccess

	for _, e := range AvailableActions {
		if AccessReq.FunctionName == e {
			access = true
			break
		}
	}

	if access == true {
		return shim.Success(Avalbytes)
	}

	return shim.Error("The given cid.role does not have access to the %s function")

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Record RoleConfig to the ledger
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func recordRoleConfig(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	var Avalbytes []byte
	var RoleConfig = &RoleConfig{}
	// Convert the arg to a recordRoleConfig object
	logger.Infof("recordRoleConfig() : Arguments for recordRoleConfig : ", args[0])
	err = cycoreutils.JSONtoObject([]byte(args[0]), RoleConfig)
	if err != nil {
		return shim.Error("Failed to convert arg[0] to RoleConfig object")
	}

	RoleConfig.ObjectType = "RoleConfig"

	// Query and Retrieve the Full recordRoleConfig
	keys := []string{RoleConfig.Role}
	logger.Infof("Keys for RoleConfig %s: ", keys)

	Avalbytes, err = cycoreutils.QueryObject(stub, RoleConfig.ObjectType, keys, "")
	if err != nil {
		return shim.Error("Failed to query RoleConfig object")
	}

	if Avalbytes != nil {
		return shim.Error("RoleConfig already exists")
	}

	RoleConfigBytes, _ := json.Marshal(RoleConfig)
	err = cycoreutils.UpdateObject(stub, RoleConfig.ObjectType, keys, RoleConfigBytes, "")
	if err != nil {
		fmt.Printf("recordRoleConfig() : Error inserting RoleConfig object into LedgerState %s", err)
		return shim.Error("RoleConfig object update failed")
	}

	return shim.Success(RoleConfigBytes)
}

//////////////////////////////////////////////////////////////
/// Query RoleConfig Info from the ledger
//////////////////////////////////////////////////////////////
func queryRoleConfig(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	var Avalbytes []byte
	var RoleConfig = &RoleConfig{}

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting RoleConfig ID")
	}

	err = JSONtoObject([]byte(args[0]), RoleConfig)
	if err != nil {
		return shim.Error("Failed to convert arg[0] to RoleConfig object")
	}

	// Query and Retrieve the Full RoleConfig
	keys := []string{RoleConfig.Role}
	logger.Infof("Keys for RoleConfig : ", keys)

	Avalbytes, err = cycoreutils.QueryObject(stub, "RoleConfig", keys, "")
	if Avalbytes == nil {
		return shim.Success(Avalbytes)
	}

	err = JSONtoObject(Avalbytes, RoleConfig)
	if err != nil {
		return shim.Error("Failed to convert arg[0] to RoleConfig object")
	}
	// logger.Infof("queryRoleConfig() : **** RoleConfig ****", me)

	if err != nil {
		return shim.Error("Failed to query RoleConfig object")
	}

	if Avalbytes == nil {
		return shim.Error("RoleConfig not found " + args[1])
	}

	logger.Infof("queryRoleConfig() : Returning RoleConfig results")
	// logger.Infof(me)

	return shim.Success(Avalbytes)
}

//////////////////////////////////////////////////////////////
/// Query RoleConfig List from the ledger
//////////////////////////////////////////////////////////////
func queryRoleConfigList(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	queryString := fmt.Sprintf("{\"selector\":{\"objectType\":\"RoleConfig\"}}")

	queryResults, err := cycoreutils.GetQueryResultForQueryString(stub, queryString, "")
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(queryResults)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Update RoleConfig to the ledger by getting a copy of it, updating that copy, and overwriting the original to a newer version
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func updateRoleConfig(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	var Avalbytes []byte

	var RoleConfig = &RoleConfig{}
	// Convert the arg to a updateRoleConfig object
	logger.Infof("updateRoleConfig() : Arguments for Query: RoleConfig : ", args[0])
	err = JSONtoObject([]byte(args[0]), RoleConfig)
	if err != nil {
		return shim.Error("Failed to convert arg[0] to RoleConfig object")
	}
	RoleConfig.ObjectType = "RoleConfig"
	// Query and Retrieve the Full updateRoleConfig
	keys := []string{RoleConfig.Role}
	logger.Infof("Keys for RoleConfig : ", keys)

	Avalbytes, err = cycoreutils.QueryObject(stub, RoleConfig.ObjectType, keys, "")
	if err != nil {
		return shim.Error("Failed to query RoleConfig object")
	}

	if Avalbytes == nil {
		return shim.Error("RoleConfig does not exist to update")
	}

	RoleConfigBytes, _ := json.Marshal(RoleConfig)
	err = cycoreutils.UpdateObject(stub, RoleConfig.ObjectType, keys, RoleConfigBytes, "")
	if err != nil {
		fmt.Printf("updateRoleConfig() : Error inserting RoleConfig object into LedgerState %s", err)
		return shim.Error("RoleConfig object update failed")
	}

	return shim.Success(RoleConfigBytes)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Delete RoleConfig from the ledger.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func deleteRoleConfig(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	ObjectType := "RoleConfig"
	var RoleConfig = &RoleConfig{}
	// Convert the arg to a deleteRoleConfig object
	logger.Infof("deleteRoleConfig() : Arguments for Query: RoleConfig : ", args[0])
	err = JSONtoObject([]byte(args[0]), RoleConfig)
	if err != nil {
		return shim.Error("Failed to convert arg[0] to RoleConfig object")
	}

	// Query and Retrieve the Full deleteRoleConfig
	keys := []string{RoleConfig.Role}
	logger.Infof("Keys for RoleConfig : ", keys)

	err = cycoreutils.DeleteObject(stub, ObjectType, keys, "")
	if err != nil {
		return shim.Error("Failed to delete RoleConfig object")
	}

	return shim.Success(nil)
}
