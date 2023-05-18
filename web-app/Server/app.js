const { Gateway, Wallets } = require('fabric-network')
const FabricCAServices = require('fabric-ca-client')
const path = require('path')
const { buildCCPHospital, buildWallet, prettyJSONString, registerAndEnrollUser, buildCAClient } = require('./utils.js')
const orgConst = require('./organizationConstant.json')

const channelName = 'mychannel'
const chaincodeName = 'basic'

const walletPath = path.join(__dirname, 'wallet')


async function registerUser(userObj) {
  try {
    const orgDetail = orgConst[userObj.orgId]

    const ccp = buildCCPHospital(userObj.orgId)
    const caClient = buildCAClient(FabricCAServices, ccp, orgDetail.ca)
    const wallet = await buildWallet(Wallets, walletPath)
    await registerAndEnrollUser(caClient, wallet, orgDetail.msp, userObj, orgDetail.department)
  } catch (error) {
    console.error(`\nregisterUser() --> Failed to register user ${userObj.id}: ${error}`)
    throw new Error(`Failed to register user ${userObj.id}: ${error}`)
  }
}


async function connectNetwork(userObj) {
  try {
    const ccp = buildCCPHospital(userObj.orgId)
    const wallet = await buildWallet(Wallets, walletPath)
    const gateway = new Gateway()
    await gateway.connect(ccp, {
      wallet,
      identity: userObj.id,
      discovery: { enabled: true, asLocalhost: true }
    })
    const network = await gateway.getNetwork(channelName)
    return network
  } catch (error) {
    console.error(`connectNetwork() --> Failed to connect to the fabric network: ${error}`)
    throw new Error(`Failed to connect to the fabric network: ${error}`)
  }
}


function disconnectNetowrk(userObj) {
  userObj.gateway.disconnect()
}

async function submitTransaction(funcName, obj) {
  try {
    const network = await connectNetwork(obj)
    const contract = network.getContract(chaincodeName)
    const stringObject = JSON.stringify(obj)
    console.log(`\n submitTransaction()--> ${funcName}`)
    const result = await contract.submitTransaction(funcName, stringObject)
    console.log(`\n submitTransaction()--> Result: committed: ${funcName}`)
    return result
  } catch (error) {
    throw new Error(`Failed to submit transaction ${funcName}`)
  }
}

async function evaluateTransaction(funcName, obj) {
  try {
    const network = await connectNetwork(obj)
    const contract = network.getContract(chaincodeName)
    console.log(`\n *********contract********** ${contract}`)
    const stringObject = JSON.stringify(obj)
    console.log(`\n evaluateTransaction()--> ${funcName}`)
    const result = await contract.evaluateTransaction(funcName, stringObject)
    console.log(`\n evaluateTransaction()--> Result: committed: ${funcName}`)
    try {
      const parsedResult = JSON.parse(result.toString())
      return parsedResult
    } catch (error) {
      console.error(`evaluateTransaction() --> Failed to parse result: ${error}`)
      throw new Error(`Failed to parse result: ${error}`)
    }
  } catch (error) {
    throw new Error(`Failed to evaluate transaction ${funcName}`)
  }
}


async function registerDoctor(doctorObj) {
  try {
    registerUser(doctorObj)
    return 'Doctor: ' + doctorObj.id + ', successfully registered'
  } catch (error) {
    console.error(`\nregisterDoctor() --> Failed to register doctor ${doctorObj.id}: ${error}`)
    throw new Error(`Failed to register doctor ${doctorObj.id}: ${error}`)
  }
}


async function registerPatient(patientObj) {
  try {
    await registerUser(patientObj)
    const result = await submitTransaction('CreateRecord', patientObj)
    return result
  } catch (error) {
    console.error(`\nregisterPatient() --> Failed to register patient ${patientObj.id}: ${error}`)
    throw new Error(`Failed to register patient ${patientObj.id}: ${error}`)
  }
}

async function updatePatientInfo(userObj) {
  try {
    const result = await submitTransaction('UpdatePatientInfo', userObj)
    return result
  } catch (error) {
    console.error(`\n updatePatientData() --> Failed to update the record: ${error}`)
    throw new Error(`Failed to update the record: ${error}`)
  }
}




async function readPatientData(userObj) {
  try {
    let result
    if (userObj.role === 'doctor') {
      result = await evaluateTransaction('DoctorReadRecord', userObj)
    } else if (userObj.role === 'patient') {
      result = await evaluateTransaction('PatientReadRecord', userObj)
    }
    return result
  } catch (error) {
    console.error(`readPatientData() --> Failed to read the record: ${error}`)
    throw new Error(`Failed to read the record: ${error}`)
  }
}

async function readAllPatientData(userObj) {
  try {
    const result = await evaluateTransaction('GetAllRecords', userObj)
    return result
  } catch (error) {
    console.error(`readAllPatientData() --> Failed to read all the current record: ${error}`)
    throw new Error(`Failed to read all the current record: ${error}`)
  }
}
async function getAllRecords(userObj) {
  try {
    const result = await evaluateTransaction('GetAllRecords', userObj)
    return result
  } catch (error) {
    console.error(`readAllPatientData() --> Failed to read all the current record: ${error}`)
    throw new Error(`Failed to read all the current record: ${error}`)
  }
}




// function to read the history of a record
async function getRecordHistory(userObj) {
  try {
    console.log('Beginning getRecordHistory')
    console.log('evaluating transaction for GetRecordHistory, patient id: ' + userObj)
    const result = await evaluateTransaction('GetRecordHistory', userObj)
    console.log(result)
    console.log('Ending getRecordHistory')
    return result
  } catch (error) {
    console.error(`getRecordHistory() --> Failed to read history for the record: ${error}`)
    throw new Error(`Failed to read history for the record: ${error}`)
  }
}

async function initLedger(userObj) {
  try {
    const network = await connectNetwork(userObj)
    const contract = network.getContract(chaincodeName)

    console.log('\n--> Submit Transaction: InitPatientLedger, function creates the initial set of assets on the ledger')
    await contract.submitTransaction('InitPatientLedger')
    console.log('*** Result: committed')

    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger')
    const result = await contract.evaluateTransaction('GetAllRecords')
    console.log(`*** Result: ${prettyJSONString(result.toString())}`)
    return result
  } catch (error) {
    console.error(`Failed to retrieve contract: ${error}`)
    process.exit(1)
  }
}

async function grantAccess(userObj) {
  try {
    const result = await submitTransaction('GrantAccess', userObj)
    return result
  } catch (error) {
    console.error(`updatePatientData() --> Failed to update the record: ${error}`)
    throw new Error(`Failed to update the record: ${error}`)
  }
}


async function revokeAccess(userObj) {
  try {
    const result = await submitTransaction('RevokeAccess', userObj)
    return result
  } catch (error) {
    console.error(`updatePatientData() --> Failed to update the record: ${error}`)
    throw new Error(`Failed to update the record: ${error}`)
  }
}


module.exports = {
  registerDoctor,
  registerPatient,
  initLedger,
  connectNetwork,
  disconnectNetowrk,
  readPatientData,
  readAllPatientData,
  getRecordHistory,
  updatePatientInfo,
  grantAccess,
  getAllRecords,
  revokeAccess
}



// registerUser: Registers a user with a given organization and identity using the Fabric CA client and saves the user's credentials to a wallet.
// connectNetwork: Connects to the Fabric network with a given user identity.
// disconnectNetowrk: Disconnects from the Fabric network.
// submitTransaction: Submits a transaction to the Fabric network using the given function name and object data.
// evaluateTransaction: Evaluates a transaction on the Fabric network using the given function name and object data.
// registerDoctor: Registers a new doctor user and returns a success message.
// registerPatient: Registers a new patient user and creates a new record for them on the blockchain, returns a success message.
// updatePatientInfo: Updates a patient's personal information on the blockchain.
// updatePatientHealthRecord: Updates a patient's health record on the blockchain.
// readPatientData: Reads a patient's record from the blockchain, either as a doctor or a patient.
// readAllPatientData: Reads all the patient records from the blockchain.
// getRecordHistory: Reads the transaction history for a given patient record from the blockchain.