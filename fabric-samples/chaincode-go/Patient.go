package patient

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// EHRContract implements the smart contract for managing electronic health records
type EHRContract struct {
	contractapi.Contract
}

// Patient represents a patient's information
type Patient struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	DOB       time.Time `json:"dob"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
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

// CreatePatient creates a new patient
func (c *EHRContract) CreatePatient(ctx contractapi.TransactionContextInterface, id string, name string, dob time.Time, createdAt time.Time, updatedAt time.Time) error {
	exists, err := c.PatientExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the patient %s already exists", id)
	}

	patient := Patient{
		ID:        id,
		Name:      name,
		DOB:       dob,
		CreatedAt: createdAt,
		UpdatedAt: updatedAt,
	}

	patientJSON, err := json.Marshal(patient)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, patientJSON)
}

// GetPatient retrieves a patient by its ID
func (c *EHRContract) GetPatient(ctx contractapi.TransactionContextInterface, id string) (*Patient, error) {
	patientJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, err
	}
	if patientJSON == nil {
		return nil, fmt.Errorf("the patient %s does not exist", id)
	}

	var patient Patient
	err = json.Unmarshal(patientJSON, &patient)
	if err != nil {
		return nil, err
	}

	return &patient, nil
}

// PatientExists checks if a patient exists in the world state
func (c *EHRContract) PatientExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	patientJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, err
	}
	return patientJSON != nil, nil
}
