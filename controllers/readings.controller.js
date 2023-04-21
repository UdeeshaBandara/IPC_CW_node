const db = require("../config/firebase.init");
const {setDoc, doc, collection, getDocs} = require("firebase/firestore/lite");

exports.pushReading = (req, res) => {
    addToCollection(req.body.deviceId, req.body.driverName, Number(req.body.longitude), Number(req.body.latitude)).then(() => {
        res.status(200).send(JSON.stringify({status: "Success"}));
    }).catch((err) => {
        res.status(500).send(JSON.stringify({status: "Error writing to Firebase"}));
        console.log(err);
    });
}

exports.getReading = (req, res) => {
    const carNo = req.query.deviceId;
    if (carNo){
        getCollection(carNo)
            .then((lastUpdate) => {
                res.status(200).send(JSON.stringify({status: "Success", lastUpdate}));
            })
            .catch((err) => {
                res.status(500).send(JSON.stringify({status: "Error reading from Firebase"}));
                console.log(err);
            });
    } else{
        getAllCollection()
            .then((lastUpdates) => {
                res.status(200).send(JSON.stringify({status: "Success", lastUpdates}));
            })
            .catch((err) => {
                res.status(500).send(JSON.stringify({status: "Error reading from Firebase"}));
                console.log(err);
            });
    }
};

async function getAllCollection() {
    let response = []
    const carListSnapshot = await getDocs(collection(db, `carsList`));
    const carList = carListSnapshot.docs.map((doc) => doc.data());
    for (const element of carList) {
        const carsNo = element["carNo"];
        const driverName = element["driverName"];
        const locationSnapShot = await getDocs(collection(db, `carsList/${carsNo}/locationList`));
        const lastLocation = locationSnapShot.docs.map((doc) => doc.data()).pop();
        response.push({
            carNo: carsNo,
            driverName: driverName,
            lastLocation: lastLocation
        });
    }
    return response
}

async function getCollection(carNo) {
    const carSnapshot = await doc(db, `carsList/${carNo}`);
    const carsNo = carNo;
    const driverName = carSnapshot["driverName"];
    const locationSnapShot = await getDocs(collection(db, `carsList/${carNo}/locationList`));
    const lastLocation = locationSnapShot.docs.map((doc) => doc.data()).pop();
    return {
        carNo: carsNo,
        driverName: driverName,
        lastLocation: lastLocation
    };
}

async function addToCollection(deviceId, driverName, longitude, latitude) {
    const data = {
        carNo: deviceId,
        driverName: driverName
    };

    const locationList = {
        longitude: longitude,
        latitude: latitude,
        timestamp: new Date().getTime()
    };

    const UUID = new Date().getTime();
    await setDoc(doc(db, "carsList", deviceId), data).then(() =>{
        setDoc(doc(db, `carsList/${deviceId}/locationList`, UUID.toString()), locationList)
    });
}