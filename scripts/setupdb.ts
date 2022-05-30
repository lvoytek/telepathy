import { exit } from "process";
import { db } from "../src/db";

const channelTableQuery = "CREATE TABLE channels ( \
    channelid VARCHAR(24) PRIMARY KEY \
);";

const userTableQuery = "CREATE TABLE users ( \
   userid VARCHAR(24) PRIMARY KEY, \
   spectator BOOLEAN \
);";

const connectionTableQuery = "CREATE TABLE connections ( \
    user1 VARCHAR(24), \
    user2 VARCHAR(24), \
    channel VARCHAR(24), \
    directed BOOLEAN, \
    FOREIGN KEY (user1) REFERENCES users(userid), \
    FOREIGN KEY (user1) REFERENCES users(userid), \
    FOREIGN KEY (channel) REFERENCES channels(channelid), \
    PRIMARY KEY (user1, user2, channel) \
    );"

db.query(channelTableQuery, (error) => {
    if(error)
        console.log("Error: unable to create Channels table");
    else
        console.log("Created Channels table");
});

db.query(userTableQuery, (error) => {
    if(error)
        console.log("Error: unable to create Users table");
    else
        console.log("Created Users table");
});

db.query(connectionTableQuery, (error) => {
    if(error)
        console.log("Error: unable to create Connections table");
    else
        console.log("Created Connections table");
});
