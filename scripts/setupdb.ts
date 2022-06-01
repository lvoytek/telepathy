import { db } from "../src/db";

const userTableQuery = "CREATE TABLE users ( \
    userid VARCHAR(24) PRIMARY KEY, \
    spectator BOOLEAN \
 );";

const networkTableQuery = "CREATE TABLE networks ( \
    networkid INT AUTO_INCREMENT PRIMARY KEY, \
    name VARCHAR(120) \
);";

const channelTableQuery = "CREATE TABLE channels ( \
    channelid VARCHAR(24) PRIMARY KEY, \
    user VARCHAR(24), \
    network INT, \
    FOREIGN KEY (user) REFERENCES users(userid), \
    FOREIGN KEY (network) REFERENCES networks(networkid) \
);";

const bondTableQuery = "CREATE TABLE bonds ( \
    user1 VARCHAR(24), \
    user2 VARCHAR(24), \
    network INT, \
    FOREIGN KEY (user1) REFERENCES users(userid), \
    FOREIGN KEY (user2) REFERENCES users(userid), \
    FOREIGN KEY (network) REFERENCES networks(networkid), \
    PRIMARY KEY (user1, user2, network) \
    );"

db.query(userTableQuery, (error) => {
    if(error)
        console.log("Error [" + error.code + "]: unable to create Users table");
    else
        console.log("Created Users table");
});

db.query(networkTableQuery, (error) => {
    if(error)
        console.log("Error [" + error.code + "]: unable to create Network table");
    else
        console.log("Created Network table");
});

db.query(channelTableQuery, (error) => {
    if(error)
        console.log("Error [" + error.code + "]: unable to create Channels table");
    else
        console.log("Created Channels table");
});

db.query(bondTableQuery, (error) => {
    if(error)
        console.log("Error [" + error.code + "]: unable to create bonds table");
    else
        console.log("Created bonds table");
});
