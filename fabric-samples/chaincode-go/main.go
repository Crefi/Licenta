package main

import (
    "encoding/json"
    "fmt"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
  

)

type RecordContract struct {
    contractapi.Contract
}

type Record struct {
    PatientId                  string   `json:"PatientId"`
    Address                    string   `json:"Address"`
    Telephone                  string   `json:"Telephone"`
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
            Diagnosis: "D1",
            Medication: "M1",
            DoctorAuthorizationList: []string{"Doc1"},
            OrganisationAuthorizationList: []string{"Hospital1"},
        },
        {
            PatientId: "Patient2",
            Address: "A1",
            Telephone: "0712345",
            Diagnosis: "D2",
            Medication: "M2",
            DoctorAuthorizationList: []string{"Doc2"},
            OrganisationAuthorizationList: []string{"Hospital2"},
        },
        {
            PatientId: "Patient3",
            Address: "A3",
            Telephone: "07123456",
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
        OrgId      string `json:"orgId"`
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
        OrganisationAuthorizationList: []string{userObj.OrgId},
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
        OrgId      string `json:"orgId"`

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
        OrganisationAuthorizationList: []string{userObj.OrgId},

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

    // Convert the doctor IDs to a string with proper formatting
    updatedAuthList := make([]string, len(authList))
    for i, id := range authList {
        updatedAuthList[i] = id.(string)
    }
    existingRecord["DoctorAuthorizationList"] = updatedAuthList

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

func (rc *RecordContract) TransferRecord(ctx contractapi.TransactionContextInterface, userObjJSON string) (string, error) {
    var userObj struct {
        PatientId    string `json:"patientId"`
        NewDoctorId  string `json:"newDoctorId"`
    }
    err := json.Unmarshal([]byte(userObjJSON), &userObj)
    if err != nil {
        return "", err
    }

    // Get state from the ledger
    recordJSON, err := ctx.GetStub().GetState(userObj.PatientId)
    if err != nil {
        return "", fmt.Errorf("Failed to read from world state: %v", err)
    }
    if recordJSON == nil {
        return "", fmt.Errorf("The record %s does not exist", userObj.PatientId)
    }

    // Parse recordJSON to get the existing record
    existingRecord := make(map[string]interface{})
    err = json.Unmarshal(recordJSON, &existingRecord)
    if err != nil {
        return "", fmt.Errorf("Failed to unmarshal existing record JSON: %v", err)
    }


    // Update the transfer status to pending approval
    existingRecord["TransferStatus"] = "PendingApproval"

    // Marshal the updated record back to JSON
    updatedRecordJSON, err := json.Marshal(existingRecord)
    if err != nil {
        return "", fmt.Errorf("Failed to marshal updated record JSON: %v", err)
    }

    // Put the updated record back in the ledger
    err = ctx.GetStub().PutState(userObj.PatientId, updatedRecordJSON)
    if err != nil {
        return "", fmt.Errorf("Failed to write to world state: %v", err)
    }

    return string(updatedRecordJSON), nil
}

func (rc *RecordContract) ApproveTransfer(ctx contractapi.TransactionContextInterface, userObjJSON string) (string, error) {
    var userObj struct {
        PatientId    string `json:"patientId"`
        NewDoctorId  string `json:"newDoctorId"`
    }

    err := json.Unmarshal([]byte(userObjJSON), &userObj)
    if err != nil {
        return "", err
    }

    // Get state from the ledger
    recordJSON, err := ctx.GetStub().GetState(userObj.PatientId)
    if err != nil {
        return "", fmt.Errorf("Failed to read from world state: %v", err)
    }
    if recordJSON == nil {
        return "", fmt.Errorf("The record %s does not exist", userObj.PatientId)
    }

    // Parse recordJSON to get the existing record
    existingRecord := make(map[string]interface{})
    err = json.Unmarshal(recordJSON, &existingRecord)
    if err != nil {
        return "", fmt.Errorf("Failed to unmarshal existing record JSON: %v", err)
    }

    // Check if the transfer status is pending approval
    transferStatus := existingRecord["TransferStatus"].(string)
    if transferStatus != "PendingApproval" {
        return "", fmt.Errorf("Cannot approve transfer. Transfer status is not pending approval")
    }

    // Update the doctor authorization list
    authList := existingRecord["DoctorAuthorizationList"].([]interface{})
    updatedAuthList := make([]string, len(authList))
    for i, id := range authList {
        updatedAuthList[i] = id.(string)
    }
    updatedAuthList = append(updatedAuthList, userObj.NewDoctorId)
    existingRecord["DoctorAuthorizationList"] = updatedAuthList

    // Perform additional actions for approving the transfer
    // For example, update the transfer status to approved and notify relevant parties
    existingRecord["TransferStatus"] = "Approved"
    existingRecord["NewDoctorId"] = userObj.NewDoctorId

    // Marshal the updated record back to JSON
    updatedRecordJSON, err := json.Marshal(existingRecord)
    if err != nil {
        return "", fmt.Errorf("Failed to marshal updated record JSON: %v", err)
    }

    // Put the updated record back in the ledger
    err = ctx.GetStub().PutState(userObj.PatientId, updatedRecordJSON)
    if err != nil {
        return "", fmt.Errorf("Failed to write to world state: %v", err)
    }

    return string(updatedRecordJSON), nil
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

func (rc *RecordContract) GetAllCounts(ctx contractapi.TransactionContextInterface, orgID string) (map[string]int, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve records: %w", err)
	}
	defer resultsIterator.Close()

	doctorsCount := 0
	patientsCount := 0
	doctorNameSet := make(map[string]bool)

	for resultsIterator.HasNext() {
		result, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to iterate over records: %w", err)
		}

		record := new(Record)
		err = json.Unmarshal(result.Value, record)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal record JSON: %w", err)
		}

		// Count doctors
		for _, doctorName := range record.DoctorAuthorizationList {
			if _, ok := doctorNameSet[doctorName]; !ok {
				doctorsCount++
				doctorNameSet[doctorName] = true
			}
		}

		// Count patients
		if record.PatientId != "" {
			patientsCount++
		}
	}

	counts := map[string]int{
		"doctors":  doctorsCount,
		"patients": patientsCount,
	}

	return counts, nil
}





// DeletePatientRecord deletes a patient record from the ledger
func (rc *RecordContract) DeletePatientRecord(ctx contractapi.TransactionContextInterface, userObjJSON string) error {
	// Parse the userObjJSON into a struct
	userObj := struct {
		PatientId string `json:"patientId"`
	}{}
	err := json.Unmarshal([]byte(userObjJSON), &userObj)
	if err != nil {
		return fmt.Errorf("Failed to parse userObjJSON: %v", err)
	}

	// Check if the patient record exists
	recordJSON, err := ctx.GetStub().GetState(userObj.PatientId)
	if err != nil {
		return fmt.Errorf("Failed to read from world state: %v", err)
	}
	if recordJSON == nil {
		return fmt.Errorf("The Record %s does not exist", userObj.PatientId)
	}

	// Delete the patient record
	err = ctx.GetStub().DelState(userObj.PatientId)
	if err != nil {
		return fmt.Errorf("Failed to delete from world state: %v", err)
	}

	return nil
}
// RevokeAccess removes the authorization of a doctor from accessing a patient's record.
func (rc *RecordContract) RevokeAccess(ctx contractapi.TransactionContextInterface, userObjJSON string) error {
	// Parse the incoming JSON data into a struct that we can use
	userObj := struct {
		PatientId        string `json:"patientId"`
		DoctorId         string `json:"doctorId"`
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

	// Remove the doctor from the authorization list
	for i, doctorId := range record.DoctorAuthorizationList {
		if doctorId == userObj.DoctorId {
			record.DoctorAuthorizationList = append(record.DoctorAuthorizationList[:i], record.DoctorAuthorizationList[i+1:]...)
			break
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
func (rc *RecordContract) PatientReadRecord(ctx contractapi.TransactionContextInterface, userObj string) (string, error) {
    var user struct {
        PatientID string `json:"patientId"`
    }
    var recordJSON []byte
    err := json.Unmarshal([]byte(userObj), &user)
    if err != nil {
        return "", fmt.Errorf("failed to unmarshal userObj: %v", err)
    }

    patientID := user.PatientID
    recordJSON, err = ctx.GetStub().GetState(patientID)
    if err != nil {
        return "", fmt.Errorf("failed to read record: %v", err)
    }

    if recordJSON == nil || len(recordJSON) == 0 {
        return "", fmt.Errorf("the Record %s does not exist", patientID)
    }

    return string(recordJSON), nil
}




func (rc *RecordContract) DoctorReadRecord(ctx contractapi.TransactionContextInterface, userObjJSON string) ([]byte, error) {
    userObj := struct {
        PatientId string `json:"patientId"`
        DoctorId  string `json:"doctorId"`
    }{}
    err := json.Unmarshal([]byte(userObjJSON), &userObj)
    if err != nil {
        return nil, fmt.Errorf("failed to unmarshal user JSON: %w", err)
    }

    patientId := userObj.PatientId
    doctorId := userObj.DoctorId

    recordJSON, err := ctx.GetStub().GetState(patientId)
    if err != nil {
        return nil, fmt.Errorf("failed to read record from the ledger: %w", err)
    }
    if recordJSON == nil {
        return nil, fmt.Errorf("the record %s does not exist", patientId)
    }

    auth, err := rc.CheckAuthorization(ctx, recordJSON, doctorId)
    if err != nil {
        return nil, fmt.Errorf("failed to check authorization: %w", err)
    }
    if !auth {
        return []byte("Access Denied"), nil
    }

    return recordJSON, nil
}

func (rc *RecordContract) CheckAuthorization(ctx contractapi.TransactionContextInterface, recordJSON []byte, doctorId string) (bool, error) {
    updatedRecord := new(Record)
    err := json.Unmarshal(recordJSON, updatedRecord)
    if err != nil {
        return false, fmt.Errorf("failed to unmarshal record: %v", err)
    }
    authorizationList := updatedRecord.DoctorAuthorizationList
    for _, id := range authorizationList {
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




