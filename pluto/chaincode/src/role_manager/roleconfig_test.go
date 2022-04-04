/*
Copyright IBM Corp. 2016 All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package main

import (
	"fmt"
	"testing"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

var pkcc = new(ProjectKickerChaincode)

func TestRecordRoleConfig(t *testing.T) {
	stub := shim.NewMockStub("projectkicker_role", pkcc)
	if stub == nil {
		t.Fatalf("MockStub creation failed")
	}
	roleConfig := "{\"role\":\"buyer\",\"roleAccess\":[\"recordRoutingGuide\"],\"ObjectType\":\"RoleConfig\"}"
	fmt.Println("==================> RecordRoleConfig <====================")
	result := stub.MockInvoke("recordRoleConfig", [][]byte{[]byte("recordRoleConfig"), []byte(roleConfig)})
	if result.Status != shim.OK {
		t.Fatalf("Expected unauthorized user error to be returned")
	}
	fmt.Println(result.String())
}

func TestQueryFunctionAccessCheck(t *testing.T) {
	fmt.Println("==================> QueryFunctionAccessCheck <====================")
	stub := shim.NewMockStub("projectkicker_role", pkcc)
	if stub == nil {
		t.Fatalf("MockStub creation failed")
	}
	stub.MockInit("invoke", [][]byte{[]byte("invoke")})
	roleConfig := "{\"role\":\"buyer\",\"roleAccess\":[\"recordRoutingGuide\"],\"ObjectType\":\"RoleConfig\"}"
	stub.MockInvoke("recordRoleConfig", [][]byte{[]byte("recordRoleConfig"), []byte(roleConfig)})
	args := "{\"Role\":\"buyer\",\"FunctionName\":\"recordRoutingGuide\"}"
	result := stub.MockInvoke("queryFunctionAccessCheck", [][]byte{[]byte("queryFunctionAccessCheck"), []byte(args)})
	if result.Status != shim.OK {
		t.Fatalf("Expected unauthorized user error to be returned")
	}
	fmt.Println(result.String())
}

func TestQueryFunctionAccessCheckDiffRole(t *testing.T) {
	fmt.Println("==================> QueryFunctionAccessCheckWithDiffRole <====================")
	stub := shim.NewMockStub("projectkicker_role", pkcc)
	if stub == nil {
		t.Fatalf("MockStub creation failed")
	}
	stub.MockInit("invoke", [][]byte{[]byte("invoke")})
	roleConfig := "{\"role\":\"buyer\",\"roleAccess\":[\"recordRoutingGuide\"],\"ObjectType\":\"RoleConfig\"}"
	stub.MockInvoke("recordRoleConfig", [][]byte{[]byte("recordRoleConfig"), []byte(roleConfig)})
	args := "{\"Role\":\"supplier\",\"FunctionName\":\"recordRoutingGuide\"}"
	result := stub.MockInvoke("queryFunctionAccessCheck", [][]byte{[]byte("queryFunctionAccessCheck"), []byte(args)})
	if result.Status != shim.ERROR {
		t.Fatalf("Expected unauthorized user error to be returned")
	}
	fmt.Println(result.String())
}