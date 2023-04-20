const db = require("../config/firebase.init");
const {setDoc, doc, collection, getDocs, updateDoc} = require("firebase/firestore/lite");
const firestore = require("firebase/firestore")

exports.pushReading = (req, res) => {
    addToCollection(req.body.deviceId, req.body.driverName, req.body.longitude, req.body.latitude).then(() => {
        res.status(200).send(JSON.stringify({status: "Success"}));
    }).catch((err) => {
        res.status(500).send(JSON.stringify({status: "Error writing to Firebase"}));
        console.log(err);
    });
}

exports.getReading = (req, res) => {
    const deviceId = req.query.deviceId || 0;
    getCollection(deviceId)
        .then((value) => {
            const resValue = value.pop()
            res.status(200).send(JSON.stringify({status: "Success", resValue}));
        })
        .catch((err) => {
            res.status(500).send(JSON.stringify({status: "Error reading from Firebase"}));
        });
};

async function getCollection(deviceID) {
    const dataCol = collection(db, `carsList/${deviceID}/locationList`)
    const dataSnapshot = await getDocs(dataCol);
    return dataSnapshot.docs.map((doc) => doc.data());
}

async function addToCollection(deviceId, driverName, longitude, latitude) {
    const data = {
        carNo: deviceId,
        driverName: driverName
    };

    const locationList = {
        location: [
            {
                longitude: longitude,
                latitude: latitude
            }
        ],
        timestamp: new Date()
    };

    const UUID = new Date().getTime();
    console.log(locationList.location)
    await setDoc(doc(db, "carsList", deviceId), data).then(() =>{
        setDoc(doc(db, `carsList/${deviceId}/locationList`, UUID.toString()), locationList)
    });
}