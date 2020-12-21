const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const {
    PerformanceObserver,
    performance
} = require('perf_hooks');

// Connection URL
const url = 'mongodb://root:example@localhost:27017';

// Database Name
const dbName = 'Test_SinvherMongoDB';
const fs = require('fs');
const sizeof = require('object-sizeof');
let UserData = JSON.parse(fs.readFileSync('./UserMockData_DE.json'));

var db = null;


function createConnection() {
    return new Promise((resolve, reject) => {
        MongoClient.connect('mongodb://root:example@localhost:27017', function (err, client) {
            if (err) {
                console.error(err)
            }
            db = client.db('Test_SinvherMongoDB');
            // console.log(db);
            resolve(client);
            //client.close();// once connected, assign the connection to the global variable
        });
        // let con =  MongoClient.connect('mongodb://root:example@localhost:27017',{useUnifiedTopology: true}); 
        // console.log("con started");
        // resolve({con,db});
    })

}

function endConnection(con) {
    return new Promise((resolve, reject) => {
        con.close();
        //console.log("con ended");
        resolve();
    })
}
// Use connect method to connect to the server

function deleteDocuments(db) {
    const collection = db.collection('User');
    collection.deleteMany(({
        a: 24
    }));
}

async function emptyDatabase(collection) {
    collection.remove();
}


function createUser(insertObj, collection) {
    return new Promise((resolve, reject) => {
        let t0 = performance.now();
        collection.insertOne(insertObj, function (error, response) {
            let resSize = sizeof(response);
            let reqSize = sizeof(insertObj);
            let t1 = performance.now();
            let time = t1 - t0;
            resolve({
                time,
                resSize,
                reqSize
            });
        })
    })
}

async function benchmarkCreateNewUser(runs, userAmount) {
    let benchmarkTimeDataPerObject = [];
    let benchmarkTimeDataInWhole = [];
    let benchmarkSizeOfObjectAv = [];
    let benchmarkSizeOfReqAv = [];

    for (var i = 0; i < runs; i++) {
        let con = await createConnection();
        db = con.db('Test_SinvherMongoDB');
        const collection = db.collection('User');
        await emptyDatabase(collection);
        await endConnection(con);

        let s0 = performance.now();
        for (var j = 0; j < userAmount; j++) {
            let con = await createConnection();
            db = con.db('Test_SinvherMongoDB');
            const collection = db.collection('User');
            var stusername = "" + UserData[j].username;
            username = stusername.replace(/ /g, '');
            let insertObj = {
                id: j,
                username: username,
                userpasswort: UserData[j].userpasswort,
                thema: UserData[j].thema,
                kreiert: UserData[j].kreiert,
                letzerlogin: UserData[j].letzterlogin,
                sprache: UserData[j].sprache,
                barrieremodus: UserData[j].barriereModus
            };
            let obj = await createUser(insertObj, collection);
            await endConnection(con);
            benchmarkTimeDataPerObject.push(obj.time);
            benchmarkSizeOfObjectAv.push(obj.resSize);
            benchmarkSizeOfReqAv.push(obj.reqSize);
        }
        let s1 = performance.now();
        benchmarkTimeDataInWhole.push(s1 - s0);

    }

    let averageTimePerObject = benchmarkTimeDataPerObject.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkTimeDataPerObject.length;

    console.log("avObj " + averageTimePerObject);

    let averageTimeInWhole = benchmarkTimeDataInWhole.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkTimeDataInWhole.length;
    console.log("avwhole: " + averageTimeInWhole);

    let averageSizeOfObject = benchmarkSizeOfObjectAv.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkSizeOfObjectAv.length;
    console.log("svRessize: " + averageSizeOfObject);

    let averageTimeReq = benchmarkSizeOfReqAv.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkSizeOfReqAv.length;
    console.log("avReqsize: " + averageTimeReq);




}

function getUser(collection) {
    return new Promise((resolve, reject) => {
        let t0 = performance.now();
        collection.find().toArray(function (err, result) {
            let resSize = sizeof(result);
            let reqSize = sizeof({});
            let t1 = performance.now();
            let time = t1 - t0;
            resolve({
                time,
                resSize,
                reqSize
            });
        });


    })
}

async function benchmarkGetUser() {
    let benchmarkTimeDataPerObject = [];
    let benchmarkSizeOfObjectAv = [];
    let benchmarkSizeOfReqAv = [];


    let con = await createConnection();
    db = con.db('Test_SinvherMongoDB');
    const collection = db.collection('User');
    let obj = await getUser(collection);
    await endConnection(con);

    benchmarkTimeDataPerObject.push(obj.time);
    benchmarkSizeOfObjectAv.push(obj.resSize);
    benchmarkSizeOfReqAv.push(obj.reqSize);


    let averageTimePerObject = benchmarkTimeDataPerObject.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkTimeDataPerObject.length;

    console.log("avObj " + averageTimePerObject);

    let averageSizeOfObject = benchmarkSizeOfObjectAv.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkSizeOfObjectAv.length;
    console.log("size: " + averageSizeOfObject);

    let averageSizeOfReq = benchmarkSizeOfReqAv.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkSizeOfReqAv.length;
    console.log("sizeReq: " + averageSizeOfReq);
}

function deleteUser(insertObj, collection) {
    return new Promise((resolve, reject) => {
        let t0 = performance.now();
        collection.deleteOne(insertObj, function (error, response) {
            let resSize = sizeof(response);
            let reqSize = sizeof(insertObj);
            let t1 = performance.now();
            let time = t1 - t0;
            resolve({
                time,
                resSize,
                reqSize
            });
        })
    })
}

async function benchmarkDeleteUser(runs, userAmount) {

    let benchmarkTimeDataPerObject = [];
    let benchmarkTimeDataInWhole = [];
    let benchmarkSizeOfObjectAv = [];
    let benchmarkSizeOfReqAv = [];

    for (var i = 0; i < runs; i++) {
        let s0 = performance.now();
        for (var j = 0; j < userAmount; j++) {
            let con = await createConnection();
            db = con.db('Test_SinvherMongoDB');
            const collection = db.collection('User');
            let insertObj = {
                id: j
            };
            let obj = await deleteUser(insertObj, collection);
            await endConnection(con);
            benchmarkTimeDataPerObject.push(obj.time);
            benchmarkSizeOfObjectAv.push(obj.resSize);
            benchmarkSizeOfReqAv.push(obj.reqSize);
        }
        let s1 = performance.now();
        benchmarkTimeDataInWhole.push(s1 - s0);

    }

    let averageTimePerObject = benchmarkTimeDataPerObject.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkTimeDataPerObject.length;

    console.log("avObj " + averageTimePerObject);

    let averageTimeInWhole = benchmarkTimeDataInWhole.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkTimeDataInWhole.length;
    console.log("avwhole: " + averageTimeInWhole);

    let averageSizeOfObject = benchmarkSizeOfObjectAv.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkSizeOfObjectAv.length;
    console.log("svRessize: " + averageSizeOfObject);

    let averageTimeReq = benchmarkSizeOfReqAv.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkSizeOfReqAv.length;
    console.log("avReqsize: " + averageTimeReq);
}

function updateUser(insertObj, collection,j) {
    return new Promise((resolve, reject) => {
        let t0 = performance.now();
        collection.update({id:j},{$set:insertObj}, function (error, response) {
            let resSize = sizeof(response);
            let reqSize = sizeof(insertObj);
            let t1 = performance.now();
            let time = t1 - t0;
            resolve({
                time,
                resSize,
                reqSize
            });
        })
    })
}

async function benchmarkUpdateUser(startID, endID) {

    let benchmarkTimeDataPerObject = [];
    let benchmarkTimeDataInWhole = [];
    let benchmarkSizeOfObjectAv = [];
    let benchmarkSizeOfReqAv = [];


    let s0 = performance.now();
    for (var j = startID; j < endID; j++) {
        let con = await createConnection();
        db = con.db('Test_SinvherMongoDB');
        const collection = db.collection('User');
        var stusername = "" + UserData[j+1].username;
        username = stusername.replace(/ /g, '');
        let insertObj = {
            id: j,
            username: username,
            userpasswort: UserData[j+1].userpasswort,
            thema: UserData[j+1].thema,
            kreiert: UserData[j+1].kreiert,
            letzerlogin: UserData[j+1].letzterlogin,
            sprache: UserData[j+1].sprache,
            barrieremodus: UserData[j+1].barriereModus
        };
        let obj = await updateUser(insertObj, collection,j);
        await endConnection(con);
        benchmarkTimeDataPerObject.push(obj.time);
        benchmarkSizeOfObjectAv.push(obj.resSize);
        benchmarkSizeOfReqAv.push(obj.reqSize);
    }

    let s1 = performance.now();
    benchmarkTimeDataInWhole.push(s1 - s0);

    let averageTimePerObject = benchmarkTimeDataPerObject.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkTimeDataPerObject.length;

    console.log("avObj " + averageTimePerObject);

    let averageTimeInWhole = benchmarkTimeDataInWhole.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkTimeDataInWhole.length;
    console.log("avwhole: " + averageTimeInWhole);

    let averageSizeOfObject = benchmarkSizeOfObjectAv.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkSizeOfObjectAv.length;
    console.log("svRessize: " + averageSizeOfObject);

    let averageTimeReq = benchmarkSizeOfReqAv.reduce(function (a, b) {
        return a + b
    }, 0) / benchmarkSizeOfReqAv.length;
    console.log("avReqsize: " + averageTimeReq);



}

async function main() {
    //benchmarkCreateNewUser(1,5505);
    //benchmarkGetUser();
    //benchmarkDeleteUser(1,1000);
    benchmarkUpdateUser(4505,5505);
}

main();