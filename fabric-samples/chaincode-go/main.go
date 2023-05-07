package main

import (
    "encoding/json"
    "fmt"
    "strconv"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
  

)

type RecordContract struct {
    contractapi.Contract
}

type Record struct {
    PatientId                  string   `json:"PatientId"`
    Address                    string   `json:"Address"`
    Telephone                  string   `json:"Telephone"`
    HealthRecordId             string   `json:"HealthRecordId"`
    Diagnosis                  string   `json:"Diagnosis"`
    Medication                 string   `json:"Medication"`
    DoctorAuthorizationList    []string `json:"DoctorAuthorizationList"`
    OrganisationAuthorizationList []string `json:"OrganisationAuthorizationList"`
}

func (rc *RecordContract) InitPatientLedger(ctx contractapi.TransactionContextInterface) error {
    records := []Record{
        {
            PatientId: "Patient1",
            Address: "A1",
            Telephone: "071234",
            HealthRecordId: "EHR1",
            Diagnosis: "D1",
            Medication: "M1",
            DoctorAuthorizationList: []string{"Doc1"},
            OrganisationAuthorizationList: []string{"Hospital1"},
        },
        {
            PatientId: "Patient2",
            Address: "A1",
            Telephone: "0712345",
            HealthRecordId: "EHR2",
            Diagnosis: "D2",
            Medication: "M2",
            DoctorAuthorizationList: []string{"Doc2"},
            OrganisationAuthorizationList: []string{"Hospital2"},
        },
        {
            PatientId: "Patient3",
            Address: "A3",
            Telephone: "07123456",
            HealthRecordId: "EHR3",
            Diagnosis: "D3",
            Medication: "M3",
            DoctorAuthorizationList: []string{"Doc1","Doc2"},
            OrganisationAuthorizationList: []string{"Hospital1","Hospital2"},
        },
    }

    for _, record := range records {
        recordJSON, err := json.Marshal(record)
        if err != nil {
            return err
        }

        err = ctx.GetStub().PutState(record.PatientId, recordJSON)
        if err != nil {
            return err
        }

        fmt.Printf("Record %s initialized\n", record.PatientId)
    }

    return nil
}

func (rc *RecordContract) CreateRecord(ctx contractapi.TransactionContextInterface, userObjJSON string) (*Record, error) {
    userObj := struct {
        PatientId string `json:"patientId"`
        Address string `json:"address"`
        Telephone string `json:"telephone"`
        Diagnosis string `json:"diagnosis"`
        Medication string `json:"medication"`
        DoctorId string `json:"doctorId"`
    }{}

    err := json.Unmarshal([]byte(userObjJSON), &userObj)
    if err != nil {
        return nil, err
    }

    exists, err := rc.RecordExists(ctx, userObj.PatientId)
    if err != nil {
        return nil, err
    }

    if exists {
        return nil, fmt.Errorf("The record %s already exists", userObj.PatientId)
    }

	record := Record{
        PatientId: userObj.PatientId,
        Address: userObj.Address,
        Telephone: userObj.Telephone,
		Diagnosis: userObj.Diagnosis,
		Medication: userObj.Medication,
		DoctorAuthorizationList: []string{userObj.DoctorId},
        OrganisationAuthorizationList: []string{},
	}

	recordJSON, err := json.Marshal(record)
	if err != nil {
		return nil, err
	}
	
	err = ctx.GetStub().PutState(record.PatientId, recordJSON)
	if err != nil {
		return nil, err
	}
	
	return &record, nil
}

func (rc *RecordContract) UpdateRecord(ctx contractapi.TransactionContextInterface, userObjJSON string) (*Record, error) {
	userObj := struct {
		PatientId string `json:"patientId"`
        Address string `json:"address"`
        Telephone string `json:"telephone"`
        Diagnosis string `json:"diagnosis"`
        Medication string `json:"medication"`
        DoctorId string `json:"doctorId"`
	}{}

	err := json.Unmarshal([]byte(userObjJSON), &userObj)
	if err != nil {
		return nil, err
	}
	
	exists, err := rc.RecordExists(ctx, userObj.PatientId)
	if err != nil {
		return nil, err
	}
	
	if !exists {
		return nil, fmt.Errorf("The record %s does not exist", userObj.PatientId)
	}
	
	
	
	record := Record{
		PatientId: userObj.PatientId,
		Address: userObj.Address,
		Telephone: userObj.Telephone,
		Diagnosis: userObj.Diagnosis,
		Medication: userObj.Medication,
		DoctorAuthorizationList: []string{userObj.DoctorId},
	}
	
	recordJSON, err := json.Marshal(record)
	if err != nil {
		return nil, err
	}
	
	err = ctx.GetStub().PutState(record.PatientId, recordJSON)
	if err != nil {
		return nil, err
	}
	
	return &record, nil
}


func (rc *RecordContract) RecordExists(ctx contractapi.TransactionContextInterface, patientId string) (bool, error) {
	recordJSON, err := ctx.GetStub().GetState(patientId)
	if err != nil {
		return false, err
		}
		
	return recordJSON != nil, nil

}

func (rc *RecordContract) GetRecord(ctx contractapi.TransactionContextInterface, patientId string) (*Record, error) {
	recordJSON, err := ctx.GetStub().GetState(patientId)
	if err != nil {
	return nil, err
	}
	if recordJSON == nil {
		return nil, fmt.Errorf("The record %s does not exist", patientId)
	}
	
	var record Record
	err = json.Unmarshal(recordJSON, &record)
	if err != nil {
		return nil, err
	}
	
	return &record, nil
}

func (rc *RecordContract) GetAllResults(ctx contractapi.TransactionContextInterface) ([]*Record, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var records []*Record
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var record Record
		err = json.Unmarshal(queryResponse.Value, &record)
		if err != nil {
			return nil, err
		}

		records = append(records, &record)
	}

	return records, nil
}

func (rc *RecordContract) GetRecordHistory(ctx contractapi.TransactionContextInterface, userObjStr string) (string, error) {
    var userObj struct {
        PatientID string `json:"patientId"`
    }

    if err := json.Unmarshal([]byte(userObjStr), &userObj); err != nil {
        return "", err
    }

    resultsIterator, err := ctx.GetStub().GetHistoryForKey(userObj.PatientID)
    if err != nil {
        return "", err
    }
    defer resultsIterator.Close()

    var allResults []*Record
    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return "", err
        }

        var record Record
        err = json.Unmarshal(queryResponse.Value, &record)
        if err != nil {
            return "", err
        }

        allResults = append(allResults, &record)
    }

    jsonResults, err := json.Marshal(allResults)
    if err != nil {
        return "", err
    }

    return string(jsonResults), nil
}
func (rc *RecordContract) GetAllRecords(ctx contractapi.TransactionContextInterface) ([]*Record, error) {
    var records []*Record
    // range query with empty string for startKey and endKey does an open-ended query of all records in the chaincode namespace.
    resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
    if err != nil {
        return nil, fmt.Errorf("failed to read from world state: %v", err)
    }
    defer resultsIterator.Close()

    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return nil, fmt.Errorf("failed to read from iterator: %v", err)
        }

        var record Record
        err = json.Unmarshal(queryResponse.Value, &record)
        if err != nil {
            return nil, fmt.Errorf("failed to unmarshal record: %v", err)
        }
        records = append(records, &record)
    }

    return records, nil
}




func (rc *RecordContract) AddDoctorAuthorization(ctx contractapi.TransactionContextInterface, patientId string, doctorId string) error {
    record, err := rc.GetRecord(ctx, patientId)
    if err != nil {
        return err
    }

    record.DoctorAuthorizationList = append(record.DoctorAuthorizationList, doctorId)

    recordJSON, err := json.Marshal(record)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(patientId, recordJSON)
}

func (rc *RecordContract) TransferRecord(ctx contractapi.TransactionContextInterface, fromDoctorId string, patientId string, toDoctorId string, message string) error {
    record, err := rc.GetRecord(ctx, patientId)
    if err != nil {
        return err
    }

    authorized := false
    for _, doctorId := range record.DoctorAuthorizationList {
        if doctorId == fromDoctorId {
            authorized = true
            break
        }
    }

    if !authorized {
        return fmt.Errorf("The doctor %s is not authorized to transfer this patient's record", fromDoctorId)
    }

    transfer := struct {
        FromDoctorId string `json:"fromDoctorId"`
        ToDoctorId   string `json:"toDoctorId"`
        Message      string `json:"message"`
        Approved     bool   `json:"approved"`
    }{
        FromDoctorId: fromDoctorId,
        ToDoctorId:   toDoctorId,
        Message:      message,
        Approved:     false,
    }

    transferJSON, err := json.Marshal(transfer)
    if err != nil {
        return err
    }

    err = ctx.GetStub().PutState(patientId+"_"+fromDoctorId, transferJSON)
    if err != nil {
        return err
    }

    return nil
}

func (rc *RecordContract) ApproveTransfer(ctx contractapi.TransactionContextInterface, patientId string, fromDoctorId string) error {
    transferJSON, err := ctx.GetStub().GetState(patientId+"_"+fromDoctorId)
    if err != nil {
        return err
    }

    if transferJSON == nil {
        return fmt.Errorf("No transfer request found for patient %s and doctor %s", patientId, fromDoctorId)
    }

    transfer := struct {
        FromDoctorId string `json:"fromDoctorId"`
        ToDoctorId   string `json:"toDoctorId"`
        Message      string `json:"message"`
        Approved     bool   `json:"approved"`
    }{}

    err = json.Unmarshal(transferJSON, &transfer)
    if err != nil {
        return err
    }

    if transfer.Approved {
        return fmt.Errorf("Transfer request for patient %s and doctor %s has already been approved", patientId, fromDoctorId)
	}

	record, err := rc.GetRecord(ctx, patientId)
	if err != nil {
		return err
	}
	
	authorized := false
	for _, doctorId := range record.DoctorAuthorizationList {
		if doctorId == fromDoctorId {
			authorized = true
			break
		}
	}
	
	if !authorized {
		return fmt.Errorf("The doctor %s is not authorized to approve the transfer of this patient's record", fromDoctorId)
	}
	
	transfer.Approved = true
	transferJSON, err = json.Marshal(transfer)
	if err != nil {
		return err
	}
	
	err = ctx.GetStub().PutState(patientId+"_"+fromDoctorId, transferJSON)
	if err != nil {
		return err
	}
	
	// Retrieve the transfer request again to make sure it was updated successfully
	transferJSON, err = ctx.GetStub().GetState(patientId+"_"+fromDoctorId)
	if err != nil {
		return err
	}
	
	err = json.Unmarshal(transferJSON, &transfer)
	if err != nil {
		return err
	}
	
	if !transfer.Approved {
		return fmt.Errorf("Failed to approve transfer request for patient %s and doctor %s", patientId, fromDoctorId)
	}
	
	// Remove the doctor from the authorization list
	for i, doctorId := range record.DoctorAuthorizationList {
		if doctorId == fromDoctorId {
			record.DoctorAuthorizationList = append(record.DoctorAuthorizationList[:i], record.DoctorAuthorizationList[i+1:]...)
			break
		}
	}
	
	// Add the new doctor to the authorization list
	record.DoctorAuthorizationList = append(record.DoctorAuthorizationList, transfer.ToDoctorId)
	
	recordJSON, err := json.Marshal(record)
	if err != nil {
		return err
	}
	
	return ctx.GetStub().PutState(patientId, recordJSON)
}
func (rc *RecordContract) UpdatePatientInfo(ctx contractapi.TransactionContextInterface, userObj string) (string, error) {
    var err error
    var updatedRecordJSON []byte

    // Parse userObj to get patientId, address and telephone
    var user map[string]interface{}
    err = json.Unmarshal([]byte(userObj), &user)
    if err != nil {
        return "", err
    }

    patientId := user["patientId"].(string)
    address := user["address"].(string)
    telephone, err := strconv.Atoi(user["telephone"].(string))
    if err != nil {
        return "", err
    }

    // Get state from the ledger
    recordJSON, err := ctx.GetStub().GetState(patientId)
    if err != nil {
        return "", fmt.Errorf("Failed to read from world state: %v", err)
    }

    if recordJSON == nil {
        return "", fmt.Errorf("The Record %s does not exist", patientId)
    }

    // Parse recordJSON to get the existing record
    var existingRecord map[string]interface{}
    err = json.Unmarshal(recordJSON, &existingRecord)
    if err != nil {
        return "", err
    }

    // Update the existing record
    existingRecord["Address"] = address
    existingRecord["Telephone"] = telephone

    // Put the updated record back in the ledger
    updatedRecordJSON, err = json.Marshal(existingRecord)
    if err != nil {
        return "", err
    }

    err = ctx.GetStub().PutState(patientId, updatedRecordJSON)
    if err != nil {
        return "", fmt.Errorf("Failed to write to world state. %v", err)
    }

    return string(updatedRecordJSON), nil
}


func (rc *RecordContract) GrantAccess(ctx contractapi.TransactionContextInterface, userObj string) (string, error) {
    var err error
    var updatedRecordJSON []byte

    // Parse userObj to get patientId and doctorId
    var user map[string]interface{}
    err = json.Unmarshal([]byte(userObj), &user)
    if err != nil {
        return "", err
    }

    patientId := user["patientId"].(string)
    doctorId := user["doctorId"].(string)

    // Get state from the ledger
    recordJSON, err := ctx.GetStub().GetState(patientId)
    if err != nil {
        return "", fmt.Errorf("Failed to read from world state: %v", err)
    }

    if recordJSON == nil {
        return "", fmt.Errorf("The Record %s does not exist", patientId)
    }

    // Parse recordJSON to get the existing record
    var existingRecord map[string]interface{}
    err = json.Unmarshal(recordJSON, &existingRecord)
    if err != nil {
        return "", err
    }

    // Update the doctor authorization list
    authList := existingRecord["DoctorAuthorizationList"].([]interface{})
    authList = append(authList, doctorId)
    existingRecord["DoctorAuthorizationList"] = authList

    // Put the updated record back in the ledger
    updatedRecordJSON, err = json.Marshal(existingRecord)
    if err != nil {
        return "", err
    }

    err = ctx.GetStub().PutState(patientId, updatedRecordJSON)
    if err != nil {
        return "", fmt.Errorf("Failed to write to world state. %v", err)
    }

    return string(updatedRecordJSON), nil
}

// RevokeAccess removes the authorization of a doctor or organization from accessing a patient's record.
func (rc *RecordContract) RevokeAccess(ctx contractapi.TransactionContextInterface, userObjJSON string) error {
	// Parse the incoming JSON data into a struct that we can use
	userObj := struct {
		PatientId        string `json:"patientId"`
		AuthorizedEntity string `json:"authorizedEntity"`
	}{}

	err := json.Unmarshal([]byte(userObjJSON), &userObj)
	if err != nil {
		return fmt.Errorf("failed to unmarshal user object JSON: %v", err)
	}

	// Check if the record exists before trying to revoke access
	exists, err := rc.RecordExists(ctx, userObj.PatientId)
	if err != nil {
		return fmt.Errorf("failed to check if record exists: %v", err)
	}
	if !exists {
		return fmt.Errorf("the record %s does not exist", userObj.PatientId)
	}

	// Get the record from the world state and parse it into a struct that we can use
	recordBytes, err := ctx.GetStub().GetState(userObj.PatientId)
	if err != nil {
		return fmt.Errorf("failed to read record %s from world state: %v", userObj.PatientId, err)
	}
	var record Record
	err = json.Unmarshal(recordBytes, &record)
	if err != nil {
		return fmt.Errorf("failed to unmarshal record JSON data: %v", err)
	}

	// Check if the authorized entity is a doctor or organization, and remove it from the appropriate list
	isDoctor := false
	for i, doctorId := range record.DoctorAuthorizationList {
		if doctorId == userObj.AuthorizedEntity {
			record.DoctorAuthorizationList = append(record.DoctorAuthorizationList[:i], record.DoctorAuthorizationList[i+1:]...)
			isDoctor = true
			break
		}
	}
	if !isDoctor {
		for i, orgId := range record.OrganisationAuthorizationList {
			if orgId == userObj.AuthorizedEntity {
				record.OrganisationAuthorizationList = append(record.OrganisationAuthorizationList[:i], record.OrganisationAuthorizationList[i+1:]...)
				break
			}
		}
	}

	// Convert the updated record to JSON format and save it to the world state
	recordBytes, err = json.Marshal(record)
	if err != nil {
		return fmt.Errorf("failed to marshal record: %v", err)
	}
	err = ctx.GetStub().PutState(userObj.PatientId, recordBytes)
	if err != nil {
		return fmt.Errorf("failed to put record in the world state: %v", err)
	}

	return nil
}


func (rc *RecordContract) CheckAuthorization(ctx contractapi.TransactionContextInterface, recordJSON []byte, doctorId string) (bool, error) {
    updatedRecord := new(Record)
    err := json.Unmarshal(recordJSON, updatedRecord)
    if err != nil {
        return false, fmt.Errorf("failed to unmarshal record: %v", err)
    }
    authrozationList := updatedRecord.DoctorAuthorizationList
    for _, id := range authrozationList {
        if id == doctorId {
            return true, nil
        }
    }
    return false, nil
}


func main() {
		// Start the chaincode and make it ready for futures requests
	recordContract := new(RecordContract)
	chaincode, err := contractapi.NewChaincode(recordContract)
	if err != nil {
		fmt.Printf("Error creating record chaincode: %s", err.Error())
		return
	}
	
	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting record chaincode: %s", err.Error())
	}
}




