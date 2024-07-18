const express = require('express')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const PunchInModel = require('./models/punchIn');
const EmpModel = require('./models/emp');
const orgModel = require('./models/org');
const stopModel = require('./models/stop');
const routeModel = require('./models/route');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
    origin: true,  // Allow all origins
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
}));

const port = 8000;

mongoose.connect("mongodb+srv://anantk15:root@cluster0.972saxu.mongodb.net/empatt?retryWrites=true&w=majority")
    .then(() => {
        console.log("MongoDB connection successful");
    })
    .catch(error => {
        console.error("MongoDB connection error:", error);
    });

app.get('/', (req, res) => {
    res.send("Hello");
});
app.get('/emps', (req, res) => {
    EmpModel.find()
        .then(data => res.json(data))
        .catch(err => res.json(err))
})
app.get('/org', (req, res) => {
    orgModel.find()
        .then(data => res.json(data))
        .catch(err => res.json(err))
})
app.get('/routes/:id', (req, res) => {
    const { id } = req.params;
    // console.log(id)
    routeModel.findOne({ org: id })
        .then(find => {
            if (!find) {
                return res.status(404).json({ message: 'Route not found' });
            }
            res.json(find);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/stops', (req, res) => {
    stopModel.find()
        .then(data => res.json(data))
        .catch(err => res.json(err))
})
app.get('/PunchDetails', (req, res) => {
    PunchInModel.find()
        .then(data => res.json(data))
        .catch(err => res.json(err))
})

app.get('/orgNew', async (req, res) => {
    try {
        const { _id } = req.query; // Extract email from query parameters

        // Find the user by email
        const user = await orgModel.findOne({ _id: _id });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
            console.log("hi")
        }

        res.status(200).json(user); // Send user data as response
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/employeeNew', async (req, res) => {
    try {
        const { _id } = req.query; // Extract email from query parameters

        // Find the user by email
        const user = await EmpModel.findOne({ _id: _id });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
            console.log("hi")
        }

        res.status(200).json(user); // Send user data as response
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})



app.post('/org-login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await orgModel.findOne({ email: email });

        if (user) {
            // Check if the password matches
            if (user.password === password) {

                // Respond with JSON data containing user's information
                res.json({ auth: true, user: user });
            } else {
                // If the password doesn't match, respond with JSON indicating incorrect password
                res.json("incorrect");
            }
        } else {
            // If no user found with the provided email, respond with JSON indicating user does not exist
            res.json("notexist");
        }
    } catch (error) {
        // If an error occurs, respond with JSON indicating server error
        console.error(error);
        res.status(500).json("server error");
    }
});
app.post('/org-signup', async (req, res) => {
    const { name, email, password, contact } = req.body

    const data = {
        email: email,
        password: password,
        name: name,
        contact: contact,

    }

    try {
        const check = await orgModel.findOne({ email: email })
        if (check) {
            res.json("exist")
        } else {
            res.json("notexist")
            await orgModel.insertMany([data])
        }
    } catch (error) {
        console.log(error);
        res.json("invalid")
    }

})

app.post('/emp-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await EmpModel.findOne({ email: email });

        if (user) {
            // Check if the password matches
            if (user.password === password) {

                // Respond with JSON data containing user's information
                res.json({ auth: true, user: user });
            } else {
                // If the password doesn't match, respond with JSON indicating incorrect password
                res.json("incorrect");
            }
        } else {
            // If no user found with the provided email, respond with JSON indicating user does not exist
            res.json("notexist");
        }
    } catch (error) {
        // If an error occurs, respond with JSON indicating server error
        console.error(error);
        res.status(500).json("server error");
    }
});

app.post('/punchIn', async (req, res) => {

    const { lat, long, empId, empOrgId, punchedInAt, punchedInAtDate } = req.body


    const data = {
        lat: lat,
        long: long,
        empId: empId,
        empOrgId: empOrgId,
        punchedInAt: punchedInAt,
        punchedInAtDate: punchedInAtDate
    };
    try {
        // const check = await PunchInModel.findOne({ owner: owner });
        // const check2 = await PunchInModel.findOne({ tripCode: tripCode });
        console.log(data)


        await PunchInModel.create(data);
        // console.log("Data inserted:", data);
        return res.json({ message: "added", punchedInAt: punchedInAt });

    } catch (error) {
        console.error("Error Punching In :", error);
        return res.status(500).json({ message: "nadded" });
    }
});

app.post('/add-emp', async (req, res) => {
    const { email, name, password, empOrgId, contact } = req.body;

    if (!name || !password || !email || !empOrgId || !contact) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = {
        email: email,
        password: password,
        name: name,
        empOrgId: empOrgId,
        contact: contact,

    };

    try {
        await EmpModel.insertMany([data]); // Assuming EmployeeModel is a Mongoose model
        res.status(201).json({ message: 'Employee added successfully' });
    } catch (error) {
        console.error('Error adding Employee :', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/add-route/:id', async (req, res) => {
    const { id } = req.params
    const { name, org, stop, vehicleNo } = req.body;
    const ifAreadyRoute = await routeModel.findOne({ org: id })
    if (ifAreadyRoute) {
        res.status(201).json({ message: 'Found' });
    } else {
        // Check for required fields
        if (!name || !org) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const data = {
            name,
            org,
            stop,
            vehicleNo
        };

        try {
            await routeModel.insertMany([data]);
            res.status(201).json({ message: 'Route added successfully' });
        } catch (error) {
            console.error('Error adding route:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


});

// app.put('/update-PunchIn/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;
//         console.log(updates)

//         // Remove empty fields from the updates object
//         Object.keys(updates).forEach(key => {
//             if (updates[key] === '') {
//                 delete updates[key];
//             }
//         });

//         const updateTrip = await PunchInModel.findOneAndUpdate({ empId: id }, updates, { new: true });

//         if (!updateTrip) {
//             return res.status(404).send({ error: 'PunchIn not found' });
//         }

//         res.status(201).json({ message: 'PunchOut updated successfully' });
//     } catch (error) {
//         res.status(500).send({ error: 'Error updating Trip' });
//     }
// });


app.put('/update-PunchIn/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { punchedOutAt } = req.body;

        // Find the most recent punchIn entry for the user
        const punchInEntry = await PunchInModel.findOne({ empId: id }).sort({ punchedInAt: -1 }).exec();

        if (!punchInEntry) {
            return res.status(404).send({ error: 'PunchIn not found' });
        }

        // Update the punchOutAt field
        punchInEntry.punchedOutAt = punchedOutAt;
        await punchInEntry.save();

        res.status(201).json({ message: 'PunchOut updated successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error updating Trip' });
    }
});
app.post('/add-stop', async (req, res) => {
    const { name, org, lat, long, radius } = req.body;

    // Check for required fields
    if (!name || !org || !lat || !long) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = {
        name,
        org,
        lat,
        long,
        radius
    };

    try {
        await stopModel.insertMany([data]);
        res.status(201).json({ message: 'Stop added successfully' });
    } catch (error) {
        console.error('Error adding stop:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/delete-route/:id', async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const deletedRoom = await routeModel.findOneAndDelete({ org: id });
        if (deletedRoom) {
            res.status(200).json({ message: `Room with room code ${id} deleted successfully` });
        } else {
            res.status(404).json({ message: `Room with room code ${id} not found` });
        }
    } catch (err) {
        console.error('Error deleting room:', err);
        res.status(500).json({ message: 'Internal server error' });
    }

})


app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
