const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = require('./app.js')
const User = require('./user.js')
const fs = require('fs');


const clientApp = express();
clientApp.use(morgan('combined'));
clientApp.use(bodyParser.json());
clientApp.use(cors());
const jwt = require('jsonwebtoken');
clientApp.use(bodyParser.urlencoded({
  extended: true
}));


const credentials = require('./credentials.json')
clientApp.listen(5001, () => console.log('Backend server running on 5001'));



function fetchCredentials(username,obj){
  const cred = credentials[username]
  var param = obj;
	if(cred){
    if(param=="password"){
      return cred.password; 
    }
    else if(param=="role"){
      return cred.role;
    }
  }
	else {
		return ""
	}
}


const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const password = fetchCredentials(req.body.username, "password");
    jwt.verify(token, password, (err, user) => {
      if (err) {
        console.log(err);
        console.log(password);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

clientApp.get('/patient/dashboard', authenticateJWT, (req, res) => {
  const role = fetchCredentials(req.user.username, "role");
  if (role === "patient") {
    // User role can access this route
    res.json({ message: 'Welcome to the user dashboard!' });
  } else {
    // User role is not authorized for this route
    res.status(403).json({ error: 'Forbidden' });
  }
});

clientApp.get('/admin/dashboard', authenticateJWT, (req, res) => {
  const role = fetchCredentials(req.user.username, "role");
  if (role === "admin") {
    // Admin role can access this route
    res.json({ message: 'Welcome to the admin dashboard!' });
  } else {
    // Admin role is not authorized for this route
    res.status(403).json({ error: 'Forbidden' });
  }
});
clientApp.get('/doctor/dashboard', authenticateJWT, (req, res) => {
  const role = fetchCredentials(req.user.username, "role");
  if (role === "doctor") {
    // Admin role can access this route
    res.json({ message: 'Welcome to the doctor dashboard!' });
  } else {
    // Admin role is not authorized for this route
    res.status(403).json({ error: 'Forbidden' });
  }
});

clientApp.post('/login', (req, res) => {
  try {
    const { username, password, orgId } = req.body;

    // Validate username and password
    const passwd = fetchCredentials(username, "password");
    const isValid = password && password === passwd;

    if (isValid) {
      // Generate an access token
      const role = fetchCredentials(username, "role");
      const accessToken = jwt.sign({ username, role, orgId }, passwd);
      res.json({ accessToken, role, orgId });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred at login" });
  }
});


clientApp.post('/register', (req, res) => {
  try {
    const { username, password, role, orgId } = req.body;

    // Validate input data
    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Username is required and must be a string" });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Password is required and must be a string" });
    }
    if (!role || typeof role !== "string") {
      return res.status(400).json({ error: "Role is required and must be a string" });
    }

    if (!orgId || typeof orgId !== "string") {
      return res.status(400).json({ error: "orgId is required and must be a string" });
    }

    const users = require('./credentials.json');
    const existingUser = Object.keys(users).find((key) => users[key].username === username);

    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    } else {
      const newUser = { username, password, role, orgId };
      users[username] = newUser;
      fs.writeFileSync('credentials.json', JSON.stringify(users));
      return res.status(200).json({ message: "User registered successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});


clientApp.post('/registerDoctor',  async (req, res) => {
  try {
	const doctorObj = new User(req.body)
	const response = await app.registerDoctor(doctorObj);
	if (response.error) {
    res.send(JSON.stringify(response.error));
  } else {
    res.send(JSON.stringify(response));
  }
} catch (error) {
  res.status(500).json({ error: "An error occurred" });
}
});

clientApp.post('/registerPatient', async (req, res) => {
  try {
	const patientObj = new User(req.body)
	const response = await app.registerPatient(patientObj);
	console.log(response);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
} catch (error) {
  res.status(500).json({ error: "An error occurred" });
}
});


clientApp.post('/updatePatientInfo', async (req, res) => {
  try {
	const patientObj = new User(req.body)
	const response = await app.updatePatientInfo(patientObj)
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }

} catch (error) {
  res.status(500).json({ error: "An error occurred" });
}
});




clientApp.post('/readPatientData', async (req, res) => {
  try {
	const patientObj = new User(req.body)
	const response = await app.readPatientData(patientObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
} catch (error) {
  res.status(500).json({ error: "An error occurred" });
}
});


clientApp.post('/readAllPatientData', async (req, res) => {
  try {
	const patientObj = new User(req.body)
	const response = await app.readAllPatientData(patientObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }

} catch (error) {
  res.status(500).json({ error: "An error occurred" });
}
});
clientApp.get('/getAllRecords' ,async (req, res) => {
  try {
  const { id, orgId } = req.query;
  const userObj = new User({ id, orgId });
  const response = await app.getAllRecords(userObj);
  if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
} catch (error) {
  res.status(500).json({ error: "An error occurred" });
}
});

clientApp.get('/getAllCounts', async (req, res) => {
  try {
  const { id,orgId } = req.query;
  const userObj = new User({ id,orgId });
  const counts = await app.getAllCounts(userObj);
  if (counts.error) {
    res.status(500).send(counts.error);
  } else {
    res.send(counts);
  }
} catch (error) {
  res.status(500).json({ error: "An error occurred" });
}
});

// Route to invoke function to get history of a record
clientApp.post('/getRecordHistory', async (req, res) => {
  try {
  console.log('Beginning client API getRecordHistory')
	const patientObj = new User(req.body)
	const response = await app.getRecordHistory(patientObj);  
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
  console.log(response)
  console.log('Ending client API getRecordHistory')

} catch (error) {
  res.status(500).json({ error: "An error occurred" });
}
});

clientApp.post('/initialize', async (req, res) => {
  try {
	const patientObj = new User(req.body)
	const response = await app.initLedger(patientObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }

} catch (error) {
  res.status(500).json({ error: "An error occurred" });
}
});

clientApp.post('/grantAccess', async (req, res) => {
  try {
	const patientObj = new User(req.body)
	const response = await app.grantAccess(patientObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }

} catch (error) {
  res.status(500).json({ error: "An error occurred" });
}
});

clientApp.post('/revokeAccess', async (req, res) => {
  try {
	const patientObj = new User(req.body)
	const response = await app.revokeAccess(patientObj);
	if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
} catch (error) {
  res.status(500).json({ error: "An error occurred" });
}
});

clientApp.post('/transferRecord', async (req, res) => {
  const transferData = new User(req.body)


  try {
    const result = await app.transferRecord(transferData);
    if (result.error) {
      res.send(result.error);
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

clientApp.get('/approveTransfer', async (req, res) => {
  const { patientId, doctorId } = new User(req.query)
  try {
      const result = await approveTransfer(patientId, doctorId);
      res.send(JSON.stringify(result));
  } catch (error) {
      res.status(500).send(JSON.stringify({ error: error.message }));
  }
});