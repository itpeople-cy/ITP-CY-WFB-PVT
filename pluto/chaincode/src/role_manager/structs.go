package main

type RoleConfig struct {
	ObjectType string   `json:"objectType"`
	Role       string   `json:"role"`
	RoleAccess []string `json:"roleAccess"`
}

type AccessReqQueryObj struct {
	Role         string `json:"role"`
	FunctionName string `json:"functionName"`
}
