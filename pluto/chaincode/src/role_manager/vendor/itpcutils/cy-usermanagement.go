/******************************************************************
Copyright IT People Corp. 2017 All Rights Reserved.

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

// Date Created:
// Author: Archana
// Organization: IT People Corporation
// Last update: May 11 2017

package itpcutils

import (
	"errors"
	"fmt"

	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type RoleAction struct {
	Role    string   `json:"role"`
	Actions []string `json:"actions"`
}

type RoleActions struct {
	ObjectType  string       `json:"doctype"`
	RoleActions []RoleAction `json:"roleactions"`
}

type User struct {
	ObjectType         string  `json:"doctype"`
	EnrollmentID       string  `json:"enrollmentid"`
	Email              string  `json:"email"`
	Role               string  `json:"role"`
	Org                string  `json:"org"`
	Certificate        string  `json:"certificate"`
	ApprovedBy         string  `json:"approvedby"`
	ApprovalTimeStamp  string  `json:"approvaltimestamp"`
	PrivacyDocHash     string  `json:"privacydochash"`
	PrivacyDocVersion  float64 `json:"privacydocversion"`
	IsAgreedForPrivacy bool    `json:"isagreedforprivacy"`
	TimeStamp          int64   `json:"timestamp"`
	Status             int     `json:"status"`
}

func GetUser(stub shim.ChaincodeStubInterface, user User) (User, error) {
	keys := []string{user.Org, user.EnrollmentID}

	objBytes, err := QueryObject(stub, USER, keys)

	if err != nil {
		return user, errors.New("GetUserEmail() : Failed to query USER object " + user.EnrollmentID)
	}

	if objBytes == nil {
		return user, errors.New("GetUserEmail() : USER not found " + user.EnrollmentID)
	}
	newUser := &User{}
	_ = JSONtoObject(objBytes, newUser)

	// isExist := stringInSlice(user.Role, strings.Split(newUser.Role, ","))
	// if !isExist {
	// 	return user, errors.New("GetParticipant() : USER " + user.EnrollmentID + " does not have the Role : " + user.Role)
	// }

	//Handling multiple roles
	newUser.Role = strings.ToLower(user.Role)

	return *newUser, nil
}

func IsUserAccessAvailable(acl map[string]AccessControl, user User) bool {
	isAccess := false
	if value, exists := acl[user.Role]; exists {
		for _, email := range value.Participants {
			if email == user.Email {
				isAccess = true
				break
			}
		}
	}
	return isAccess
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Record User
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func RecordUser(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	var Avalbytes []byte
	ObjectType := USER
	// Convert the arg to a RecordUser object
	// logger.Debug("RecordUser() : Arguments for Query: USER : ", args[0])
	user := &User{}
	err = JSONtoObject([]byte(args[0]), user)
	if err != nil {
		return shim.Error(GetMessageErrorString("CYUSRCONV002E", err))
	}
	// Query and Retrieve the Full RecordUser
	keys := []string{user.Org, user.EnrollmentID}
	// logger.Debug("Keys for USER : ", keys)

	Avalbytes, err = QueryObject(stub, ObjectType, keys)
	if err != nil {
		return shim.Error(GetMessageErrorString("CYUSRQRY003E", err))
	}

	if Avalbytes != nil {
		return shim.Error(GetMessageErrorString("CYUSRTDNE011E", err))
	}

	user.Status = 1
	// update the User object
	UserBytes, _ := ObjecttoJSON(user)
	err = UpdateObject(stub, USER, keys, UserBytes)
	if err != nil {
		// logger.Errorf("RecordUser() : Error inserting USER object into LedgerState %s", err)
		return shim.Error(GetMessageErrorString("CYUSRUPD007E", err))
	}

	return shim.Success(GetSuccessResponse("CYUSRREC013S", UserBytes)) //CYUSRREC013S

}

//////////////////////////////////////////////////////////////
//Query User Info
//////////////////////////////////////////////////////////////

func QueryUser(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	var Avalbytes []byte

	// In future , it should be > 1 and ,= mo_of_keys for object
	if len(args) != 2 {
		return shim.Error(GetMessageErrorString("CYUSRPARM001E", err))
	}

	Avalbytes, err = QueryObject(stub, USER, args)

	me := &User{}
	_ = JSONtoObject(Avalbytes, me)
	// logger.Debug("QueryUser() : **** User ****", me)

	if err != nil {
		return shim.Error(GetMessageErrorString("CYUSRQRY003E", err))
	}
	if Avalbytes == nil {
		return shim.Error(GetMessageErrorString("CYUSRDNE004E", err))
	}

	return shim.Success(GetSuccessResponse("CYUSRQRY014S", Avalbytes)) //CYUSRQRY014S

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//update User
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func UpdateUserInfo(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	var Avalbytes []byte
	// Convert the arg to a RecordUser object
	// logger.Debug("UpdateUserInfo() : Arguments for Query : ", args[0])
	user := &User{}
	err = JSONtoObject([]byte(args[0]), user)
	if err != nil {
		return shim.Error(GetMessageErrorString("CYUSRCONV002E", err))
	}

	// Query and Retrieve the Full User
	keys := []string{user.Org, user.EnrollmentID}
	// logger.Debug("Keys for UpdateUserInfo : ", keys)

	Avalbytes, err = QueryObject(stub, USER, keys)
	if err != nil {
		return shim.Error(GetMessageErrorString("CYUSRQRY003E", err))
	}

	if Avalbytes == nil {
		return shim.Error(GetMessageErrorString("CYUSRDNE004E", err))
	}

	existingUserObj := &User{}
	err = JSONtoObject(Avalbytes, existingUserObj)

	existingUserObj.IsAgreedForPrivacy = user.IsAgreedForPrivacy
	existingUserObj.PrivacyDocHash = user.PrivacyDocHash
	existingUserObj.PrivacyDocVersion = user.PrivacyDocVersion
	existingUserObj.TimeStamp = user.TimeStamp

	// update the User object
	UserBytes, _ := ObjecttoJSON(existingUserObj)
	err = UpdateObject(stub, USER, keys, UserBytes)
	if err != nil {
		// logger.Errorf("RecordUser() : Error inserting USER object into LedgerState %s", err)
		return shim.Error(GetMessageErrorString("CYUSRUPD007E", err))
	}

	return shim.Success(GetSuccessResponse("CYUSRUPD015S", UserBytes)) //CYUSRUPD015S

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//update User
////////////////////////////////////////////////////////////////////////////////////////////////////////////
func UpdateUserStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	var Avalbytes []byte
	// Convert the arg to a RecordUser object
	// logger.Debug("UpdateUserStatus() : Arguments for Query : ", args[0])
	user := &User{}
	err = JSONtoObject([]byte(args[0]), user)
	if err != nil {
		return shim.Error(GetMessageErrorString("CYUSRCONV002E", err))
	}

	// Query and Retrieve the Full User
	keys := []string{user.Org, user.EnrollmentID}
	// logger.Debug("Keys for UpdateUser Status : ", keys)

	Avalbytes, err = QueryObject(stub, USER, keys)
	if err != nil {
		return shim.Error(GetMessageErrorString("CYUSRQRY003E", err))
	}

	if Avalbytes == nil {
		return shim.Error(GetMessageErrorString("CYUSRDNE004E", err))
	}

	existingUserObj := &User{}
	err = JSONtoObject(Avalbytes, existingUserObj)

	existingUserObj.Status = user.Status
	existingUserObj.ApprovedBy = user.ApprovedBy
	existingUserObj.ApprovalTimeStamp = user.ApprovalTimeStamp

	// update the User object
	UserBytes, _ := ObjecttoJSON(existingUserObj)
	err = UpdateObject(stub, USER, keys, UserBytes)
	if err != nil {
		// logger.Errorf("UpdateUserStatus() : Error inserting USER object into LedgerState %s", err)
		return shim.Error(GetMessageErrorString("CYUSRUPD007E", err))
	}

	return shim.Success(GetSuccessResponse("CYUSRUPD015S", UserBytes)) //CYUSRUPD015S

}

func RecordRoleActions(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error

	// Convert the arg to a RecordRoleAction object
	// logger.Debug("RecordRoleAction() : Arguments for Query: ROLEACTIONS: ", args[0])
	ra := &RoleActions{}
	err = JSONtoObject([]byte(args[0]), ra)
	if err != nil {
		return shim.Error(GetMessageErrorString("CYUSRCONV016E", err))
	}

	// Query and Retrieve the Full RecordRoleAction
	keys := []string{ROLEACTIONS}
	// logger.Debug("Keys for ROLEACTIONS : ", keys)

	// update the RolesActions
	Avalbytes, _ := ObjecttoJSON(ra)
	err = UpdateObject(stub, ROLEACTIONS, keys, Avalbytes)
	if err != nil {
		// logger.Errorf("RecordRoleAction() : Error inserting ROLEACTIONS object into LedgerState %s", err)
		return shim.Error(GetMessageErrorString("CYUSRUPD017E", err))
	}

	return shim.Success(GetSuccessResponse("CYUSRRRA018S", Avalbytes)) //CYUSRRRA018S

}

//////////////////////////////////////////////////////////////
//Query User RoleAction
//////////////////////////////////////////////////////////////

func QueryRoleActions(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	var Avalbytes []byte
	keys := []string{ROLEACTIONS}
	Avalbytes, err = QueryObject(stub, ROLEACTIONS, keys)
	me := &AccessControl{}
	err = JSONtoObject(Avalbytes, me)
	// logger.Debug("QueryRoleActions() : **** ROLEACTIONS ****", me)

	if err != nil {
		return shim.Error(GetMessageErrorString("CYUSRQRY019E", err))
	}

	if Avalbytes == nil {
		return shim.Error(GetMessageErrorString("CYUSRDNE020E", err))
	}

	// logger.Debug("QueryRoleActions: Returning ROLEACTIONS results")
	// logger.Debug(me)

	return shim.Success(GetSuccessResponse("CYUSRQRY021S", Avalbytes))

}

func QueryUsersByRole(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	persona := args[0]
	// logger.Debug("QueryUsersByRole() : Arguments for  ", persona)
	user := User{}
	user.Role = strings.ToLower(persona)
	user.Status = 1
	queryString := prepareUserQuery(user, nil)

	queryResults, err := GetQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(GetMessageErrorString("CYUSRQRY024E", err))
	}

	// logger.Debug("QueryUsersByRole records : Arguments for  ", queryResults)

	return shim.Success(GetSuccessResponse("CYUSRQRY014S", queryResults))
}

//
func GetUserFromJson(stub shim.ChaincodeStubInterface, str string) (User, error) {
	usr := &User{}
	err := JSONtoObject([]byte(str), usr)
	if err != nil {
		return *usr, err
	}
	if strings.ToLower(usr.EnrollmentID) == strings.ToLower(ADMIN) {
		return *usr, nil
	}
	user, err := GetUser(stub, *usr)
	if err != nil {
		return user, err
	}
	return user, nil
}

func QueryUsersByFiter(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	// Convert the arg to a RecordUser object
	// logger.Debug("UpdateUserInfo() : Arguments for Query : ", args[0])
	user := &User{}
	err = JSONtoObject([]byte(args[0]), user)
	if err != nil {
		return shim.Error(GetMessageErrorString("CYUSRCONV002E", err))
	}

	queryString := prepareUserQuery(*user, nil)

	queryResults, err := GetQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(GetMessageErrorString("CYUSRQRY024E", err))
	}

	// logger.Debug("QueryUsersBy filter records : Arguments for  ", queryResults)

	return shim.Success(GetSuccessResponse("CYUSRQRY014S", queryResults))
}

func prepareUserQuery(user User, filter []string) string {

	// query object
	queryMap := map[string]interface{}{}

	// selector object
	selector := map[string]interface{}{
		"doctype": USER,
	}
	if user.EnrollmentID != "" {
		selector["enrollmentid"] = user.EnrollmentID
	}

	if user.Email != "" {
		selector["email"] = user.Email
	}
	if user.Org != "" {
		selector["org"] = user.Org
	}
	if user.Status > -1 {
		selector["status"] = user.Status
	}

	if user.Role != "" {
		role := map[string]interface{}{}
		role["$regex"] = fmt.Sprintf("%s(,)|(,)%s|%s$", user.Role, user.Role, user.Role)
		selector["role"] = role
	}

	queryMap["selector"] = selector
	if filter != nil && len(filter) > 0 {
		queryMap["fields"] = filter
	}
	jsonString, err := ObjecttoJSON(queryMap)
	if err != nil {
		fmt.Sprintf("Error isnt working", err)
	}
	// logger.Debug(err)
	queryString := fmt.Sprintf(string(jsonString[:]))

	// logger.Debug(queryString)

	return queryString

}
