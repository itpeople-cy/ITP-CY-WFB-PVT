package itpcutils

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var appconfigs = make(map[string]AppConfig)

var logger = shim.NewLogger("APP-CONFIG")

//AppConfig config for the
type AppConfig struct {
	ObjectType string `json:"doctype"`
	Key        string `json:"key"`
	Type       string `json:"type"`
	Value      string `json:"value"`
}

type CalConfig struct {
	ObjectType string   `json:"doctype"`
	Name       string   `json:"name"`
	Dates      []string `json:"dates"`
	IsDefault  string   `json:"isdefault"`
}
type Date struct {
	Month string `json:"month"`
	Year  string `json:"year"`
	Day   string `json:"day"`
}

type QueryAppConfig struct {
	Detail []AppConfig `json:"detail"`
}

func getConfig(key string) AppConfig {
	return appconfigs[key]
}

//////////////////////////////////////////////////////////////
//LoadConfig - Loads the configuration
//////////////////////////////////////////////////////////////
func LoadConfig(stub shim.ChaincodeStubInterface) error {
	var err error
	//pass empty struct
	var config = AppConfig{}
	//filter fileds
	var fields = []string{}

	queryString := prepareConfigurationQuery(config, fields)
	queryResults, err := GetQueryResultForQueryString(stub, queryString)
	if err != nil {
		return fmt.Errorf(GetMessageErrorString("SCONQRY004E", err))
	}

	configurations := &[]AppConfig{}
	_ = cycoreutils.JSONtoObject(queryResults, configurations) //catch the error

	logger.Debug("Load Configuration")
	logger.Debug(configurations)

	for _, configuration := range *configurations {
		logger.Debug("Added configuration: ", configuration)
		appconfigs[configuration.Key] = configuration
	}

	return nil
}

//////////////////////////////////////////////////////////////
//RecordConfig  Creates or Updates the configuration
//////////////////////////////////////////////////////////////
func RecordConfig(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	var Avalbytes []byte

	if len(args) != 1 {
		return shim.Error(GetMessageErrorString("CYAPPCPARM001E", err))
	}

	config := &AppConfig{}
	_ = cycoreutils.JSONtoObject([]byte(args[0]), config)

	keys := []string{config.Key}
	Avalbytes, _ = cycoreutils.ObjecttoJSON(config)

	err = cycoreutils.UpdateObject(stub, APPCONFIG, keys, Avalbytes)

	if err != nil {
		return shim.Error(GetMessageErrorString("CYAPPC002E", err))
	}

	if Avalbytes == nil {
		return shim.Error(GetMessageErrorString("CYAPPC002E", err))
	}

	appconfigs[config.Key] = *config

	return shim.Success(GetSuccessResponse("CYAPPC001S", Avalbytes)) //CYUSRQUR010S

}

/////////////////////////////////////////////////////////////
//RetrieveConfig Retrieves the configuration
//////////////////////////////////////////////////////////////
func RetrieveConfig(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	var Avalbytes []byte

	if len(args) != 1 {
		return shim.Error(GetMessageErrorString("CYAPPCPARM001E", err))
	}

	config := &AppConfig{}
	_ = cycoreutils.JSONtoObject([]byte(args[0]), config)

	keys := []string{config.Key}

	Avalbytes, err = cycoreutils.QueryObject(stub, APPCONFIG, keys)

	if err != nil {
		return shim.Error(GetMessageErrorString("CYAPPC002E", err))
	}

	if Avalbytes == nil {
		return shim.Error(GetMessageErrorString("CYAPPC002E", err))
	}

	return shim.Success(GetSuccessResponse("CYAPPC001S", Avalbytes)) //CYUSRQUR010S

}

//////////////////////////////////////////////////////////////
//DeleteConfig Deletes the configuration
//////////////////////////////////////////////////////////////
func DeleteConfig(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	var Avalbytes []byte

	if len(args) != 1 {
		return shim.Error(GetMessageErrorString("CYAPPCPARM001E", err))
	}

	config := &AppConfig{}
	_ = cycoreutils.JSONtoObject([]byte(args[0]), config)

	delete(appconfigs, config.Key)
	keys := []string{config.Key}

	err = cycoreutils.DeleteObject(stub, APPCONFIG, keys)

	if err != nil {
		return shim.Error(GetMessageErrorString("CYAPPC002E", err))
	}

	return shim.Success(GetSuccessResponse("CYAPPC001S", Avalbytes)) //CYUSRQUR010S

}

//////////////////////////////////////////////////////////////
//GetAllConfig Retrieves all the configuration
//////////////////////////////////////////////////////////////
func GetAllConfig(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	//pass empty struct
	var config = AppConfig{}
	//filter fileds
	var fields = []string{}

	queryString := prepareConfigurationQuery(config, fields)

	queryResults, err := GetQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(GetMessageErrorString("SCONQRY004E", err))
	}

	return shim.Success(GetSuccessResponse("SCONQRY024S", queryResults))

}

func prepareConfigurationQuery(config AppConfig, filter []string) string {
	// query object
	queryMap := map[string]interface{}{}

	// selector object
	selector := map[string]interface{}{
		"doctype": APPCONFIG,
	}

	queryMap["selector"] = selector
	jsonString, err := ObjecttoJSON(queryMap)
	if err != nil {
		logger.Error(" ***** Error while constructing query **** ", err)
	}
	queryString := fmt.Sprintf(string(jsonString[:]))

	logger.Debug(" ***** Query **** ", queryString)

	return queryString
}
