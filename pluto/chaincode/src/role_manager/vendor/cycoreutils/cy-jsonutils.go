/******************************************************************
Copyright IT People Corporation. 2018 All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

                 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

******************************************************************/
package cycoreutils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"reflect"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

// Sample Asset struct
type Asset struct {
	ObjectType string `json:"objectType"`
	AssetID    string `json:"assetId"`
	AssetValue string `json:"assetValue"`
}

var utilsLogger = shim.NewLogger("utils")

// common function for unmarshalls : JSONtoObject function unmarshalls a JSON into an object
func JSONtoObject(data []byte, object interface{}) error {
	if err := json.Unmarshal([]byte(data), object); err != nil {
		utilsLogger.Errorf("Unmarshal failed : %s ", err.Error()) //SCOMCONV004E
		return err
	}
	utilsLogger.Debugf("**** %s is %+v: ", string(data), object)
	return nil
}

//  common function for marshalls :  ObjecttoJSON function marshalls an object into a JSON
func ObjecttoJSON(object interface{}) ([]byte, error) {
	var byteArray []byte
	var err error

	if byteArray, err = json.Marshal(object); err != nil {
		utilsLogger.Errorf("Marshal failed : %s ", err.Error()) //SCOMCONV005E
		return nil, err
	}

	if len(byteArray) == 0 {
		return nil, fmt.Errorf(("failed to convert object")) //SCOMLENB006E
	}
	utilsLogger.Debugf("**** %+v is %s: ", object, string(byteArray))
	return byteArray, nil
}

//GetBytes from string array
func GetBytes(sa []string) []byte {
	arrayBytes, _ := json.Marshal(sa)
	return arrayBytes
}

func CompareJSON(jsonString string, compareJson string) (bool, error) {
	var jsonIface interface{}
	var compareIface interface{}
	var msg = Response{}

	if err := JSONtoObject([]byte(jsonString), &jsonIface); err != nil {
		return false, fmt.Errorf("Unable to unmarshal original string " + err.Error())
	}

	if err := JSONtoObject([]byte(compareJson), &msg); err != nil {
		return false, fmt.Errorf("Unable to unmarshal message " + err.Error())
	}

	if err := JSONtoObject([]byte(msg.ObjectBytes), &compareIface); err != nil {
		return false, fmt.Errorf("Unable to unmarshal compare string")
	}
	return reflect.DeepEqual(jsonIface, compareIface), nil
}

// AssetToJSON : Converts Asset Object to JSON
func AssetToJSON(asset Asset) ([]byte, error) {
	utilsLogger.Info("AssetToJSON Init")
	ajson, err := json.Marshal(asset)
	if err != nil {
		utilsLogger.Error("Marshal failed : ", err)
		return nil, err
	}
	utilsLogger.Debugf("Asset Bytes : %s", string(ajson))
	return ajson, nil
}

// JSONToAsset : Converts JSON String to an Asset Object
func JSONToAsset(data []byte) (Asset, error) {
	utilsLogger.Info("JSONToAsset Init")
	asset := Asset{}
	err := json.Unmarshal([]byte(data), &asset)
	if err != nil {
		utilsLogger.Error("Unmarshal failed : ", err)
		return Asset{}, err
	}
	utilsLogger.Debug("Asset : ", asset)
	return asset, err
}

func generateAndCompareHash(inputHash string, data string, key string) (bool, error) {
	//Calculate the address of the incoming data
	utilsLogger.Infof("gnc Hash Object %s", data)
	utilsLogger.Infof("gnc Key %s", key)
	utilsLogger.Infof("gnc Length of input %d", len(data))
	hData := hmac.New(sha256.New, []byte(key))
	hData.Write([]byte(data))
	hash := base64.StdEncoding.EncodeToString(hData.Sum(nil))
	utilsLogger.Infof("gnc Hash %s", hash)

	//Compare the hash of the ledger address to the has of the incoming data
	if strings.Compare(hash, inputHash) != 0 {
		msgBytes, _ := GetMessageDetail("SHASHERR001E", fmt.Sprintf("Hash comparison has not been successful"))
		return false, fmt.Errorf(string(msgBytes))
	}
	return true, nil
}

func GenerateHash(data string, key string) (string, error) {
	// Calculate the address of the incoming data
	utilsLogger.Infof("Hash Object %s", data)
	utilsLogger.Infof("HaKey %s", key)
	utilsLogger.Infof("Size of register data %d", len(data))
	hData := hmac.New(sha256.New, []byte(key))
	hData.Write([]byte(data))
	hash := base64.StdEncoding.EncodeToString(hData.Sum(nil))
	utilsLogger.Infof("Hash %s", hash)

	return hash, nil
}
