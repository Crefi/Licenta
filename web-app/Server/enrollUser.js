const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function enrollUser(username) {
  try {
    // Load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'fabric-samples/pdm-network', 'organizations', 'peerOrganizations', 'hospital1.com', 'connection-hospital1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new CA client for interacting with the CA
    const caInfo = ccp.certificateAuthorities['ca.hospital1'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    // Create a new file system-based wallet for managing identities
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check if the user already exists in the wallet
    const identity = await wallet.get(username);
    if (identity) {
      console.log(`An identity for the user ${username} already exists in the wallet`);
      return;
    }

    // Enroll the user and import the new identity into the wallet
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: 'Hospital1MSP',
      type: 'X.509'
    };
    await wallet.put(username, x509Identity);
    console.log(`Successfully enrolled user ${username} and imported it into the wallet`);
  } catch (error) {
    console.error(`Failed to enroll user ${username}: ${error}`);
    process.exit(1);
  }
}

module.exports = enrollUser;
