package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Doctor represents a doctor's information
type Doctor struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Specialty string    `json:"specialty"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// DoctorContract implements the smart contract for managing doctors
type DoctorContract struct {
	contractapi.Contract
}

// CreateDoctor creates a new doctor
func (dc *DoctorContract) CreateDoctor(ctx contractapi.TransactionContextInterface, doctorID string, name string, specialty string) error {
	exists, err := dc.DoctorExists(ctx, doctorID)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if exists {
		return fmt.Errorf("the doctor %s already exists", doctorID)
	}

	doctor := Doctor{
		ID:        doctorID,
		Name:      name,
		Specialty: specialty,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	doctorJSON, err := json.Marshal(doctor)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(doctorID, doctorJSON)
}

// GetDoctor returns the doctor by ID
func (dc *DoctorContract) GetDoctor(ctx contractapi.TransactionContextInterface, doctorID string) (*Doctor, error) {
	doctorJSON, err := ctx.GetStub().GetState(doctorID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if doctorJSON == nil {
		return nil, fmt.Errorf("the doctor %s does not exist", doctorID)
	}

	var doctor Doctor
	err = json.Unmarshal(doctorJSON, &doctor)
	if err != nil {
		return nil, err
	}

	return &doctor, nil
}

// DoctorExists returns true if the doctor exists in world state
func (dc *DoctorContract) DoctorExists(ctx contractapi.TransactionContextInterface, doctorID string) (bool, error) {
	doctorJSON, err := ctx.GetStub().GetState(doctorID)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}
	return doctorJSON != nil, nil
}
