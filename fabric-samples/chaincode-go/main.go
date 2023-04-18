package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"

	"/home/alex/Licenta/fabric-samples/chaincode-go/Patient.go"
	"/home/alex/Licenta/fabric-samples/chaincode-go/Doctor.go"
)


// EHRContract implements the smart contract for managing electronic health records
type EHRContract struct {
	contractapi.Contract
}

// EHR represents an electronic health record
type EHR struct {
	ID           string    `json:"id"`
	PatientID    string    `json:"patientID"`
	DoctorID     string    `json:"doctorID"`
	Description  string    `json:"description"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}


// Init of the chaincode
// This function is called only one when the chaincode is instantiated.
// So the goal is to prepare the ledger to handle future requests.
func (t *EHRContract) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("########### EHRContract  Init ###########")

	// Get the function and arguments from the request
	function, _ := stub.GetFunctionAndParameters()

	// Check if the request is the init function
	if function != "init" {
		return shim.Error("Unknown function call")
	}

	// Return a successful message
	return shim.Success(nil)
}

// Invoke of the chaincode
/// Invoke processes the requests
func (t *EHRContract) Invoke(ctx contractapi.TransactionContextInterface) (interface{}, error) {
	fmt.Println("########### EHRContract Invoke ###########")

	function, args := ctx.GetStub().GetFunctionAndParameters()

	switch function {
	case "createEHR":
		return t.createEHR(ctx, args)
	case "getEHR":
		return t.getEHR(ctx, args)
	case "updateEHR":
		return t.updateEHR(ctx, args)
	case "query":
		return t.query(ctx, args)
	default:
		return nil, errors.New("unknown function call")
	}
}


		// Create a new EHR
func (t *EHRContract) createEHR(stub shim.ChaincodeStubInterface, args []string) pb.Response {
    if len(args) != 5 {
        return shim.Error("Incorrect number of arguments. Expecting 5")
    }

	id := args[0]
	patientID := args[1]
	doctorID := args[2]
	description := args[3]

		// Create a new EHR
	ehr := EHR{
		ID:          args[0],
		PatientID:   args[1],
		DoctorID:    args[2],
		Description: args[3],
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Convert EHR to bytes
	ehrBytes, err := json.Marshal(ehr)
	if err != nil {
		return shim.Error("Failed to marshal EHR to JSON")
	}

	// Save EHR in the ledger
	err = stub.PutState(args[0], ehrBytes)
	if err != nil {
		return shim.Error("Failed to save EHR in the ledger")
	}

	return shim.Success(nil)
}


// ==========================================================================================
// updateEHR 
// ==========================================================================================
func updateEHR(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 5 {
	return shim.Error("Incorrect number of arguments. Expecting 5")
	}
ehrBytes, err := stub.GetState(args[0])
if err != nil {
	return shim.Error("Failed to retrieve EHR from the ledger")
}
if ehrBytes == nil {
	return shim.Error("EHR not found in the ledger")
}

// Convert EHR bytes to EHR struct
var ehr EHR
err = json.Unmarshal(ehrBytes, &ehr)
if err != nil {
	return shim.Error("Failed to unmarshal EHR bytes to EHR struct")
}

// Update EHR struct
ehr.PatientID = args[1]
ehr.DoctorID = args[2]
ehr.Description = args[3]
ehr.UpdatedAt = time.Now()

// Convert EHR to bytes
ehrBytes, err = json.Marshal(ehr)
if err != nil {
	return shim.Error("Failed to marshal EHR to JSON")
}

// Save updated EHR in the ledger
err = stub.PutState(args[0], ehrBytes)
if err != nil {
	return shim.Error("Failed to save updated EHR in the ledger")
}

return shim.Success(nil)
}


// ==========================================================================================
// getEHR : get the EHR object by ID - Auxiliary function
// ==========================================================================================
func getEHR(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
	return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	ehrBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to retrieve EHR from the ledger")
	}
	if ehrBytes == nil {
		return shim.Error("EHR not found in the ledger")
	}

	// Convert EHR bytes to EHR struct
	var ehr EHR
	err = json.Unmarshal(ehrBytes, &ehr)
	if err != nil {
		return shim.Error("Failed to unmarshal EHR bytes to EHR struct")
	}

	// Convert EHR struct to JSON bytes
	ehrJSON, err := json.Marshal(ehr)
	if err != nil {
		return shim.Error("Failed to marshal EHR struct to JSON bytes")
	}

	return shim.Success(ehrJSON)
	}


	// query
	// Every readonly functions in the ledger will be here
	func (t *EHRContract) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {
		fmt.Println("########### EHRContract query ###########")
	
		// Check whether the number of arguments is sufficient
		if len(args) < 2 {
			return shim.Error("The number of arguments is insufficient.")
		}
	
		// Like the Invoke function, we manage multiple type of query requests with the second argument.
		// We also have only one possible argument: hello
		if args[1] == "hello" {
	
			// Get the state of the value matching the key hello in the ledger
			state, err := stub.GetState("hello")
			if err != nil {
				return shim.Error("Failed to get state of hello")
			}
	
			// Return this value in response
			return shim.Success(state)
		}
	
		// If the arguments given don’t match any function, we return an error
		return shim.Error("Unknown query action, check the second argument.")
	}
	

func main() {
	// Start the chaincode and make it ready for futures requests
	err := shim.Start(new(EHRContract))
	if err != nil {
		fmt.Printf("Error starting EHRContract chaincode: %s", err)
	}
}