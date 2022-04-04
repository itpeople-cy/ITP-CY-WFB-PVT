package itpcutils

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

const NOTIFY_EVENT = "NOTIFICATIONS"

type Notification struct {
	Type      string   `json:"type"`
	Message   Message  `json:"message"`
	Recipient []string `json:"recipient"`
}
type Message struct {
	Message      string            `json:"message"`
	ActionParams map[string]string `json:"actionparams`
}

func Notify(stub shim.ChaincodeStubInterface, notifcation Notification) error {
	notifyByests, err := cycoreutils.cycoreutils.ObjecttoJSON(notifcation)
	if err != nil {
		return err
	}
	if notifyByests == nil {
		return nil

	}
	stub.SetEvent(NOTIFY_EVENT, notifyByests)
	return nil
}
