import fs from "fs";
import { QueryError } from "mysql2";
import * as userQuery from "../src/models/user";
import * as networkQuery from "../src/models/network";
import * as channelQuery from "../src/models/channel";
import * as bondQuery from "../src/models/bond";

const dbData = fs.readFileSync('./db.json', 'utf-8');
const dbJson = JSON.parse(dbData);

var usersAdded = (dbJson.users) ? dbJson.users.length : 0;
var networksAdded = (dbJson.networks) ? dbJson.networks.length : 0;
var channelsAdded = (dbJson.channels) ? dbJson.channels.length: 0;
var bondsAdded = (dbJson.bonds) ? dbJson.bonds.length : 0;

for(const user of dbJson.users) {
  userQuery.create(user, (error: QueryError) => {
    if(error) {
      console.log("Error [" + error.code + "]: unable to import user");
      process.exit(1);
    }
    --usersAdded;
  });
}

while(usersAdded > 0) {}

for(const network of dbJson.networks) {
  networkQuery.create(network, (error: QueryError) => {
    if(error) {
      console.log("Error [" + error.code + "]: unable to import network");
      process.exit(1);
    }
    --networksAdded;
  });
}

while(networksAdded > 0) {}

for(const channel of dbJson.channels) {
  channelQuery.create(channel, (error: QueryError) => {
    if(error) {
      console.log("Error [" + error.code + "]: unable to import channel");
      process.exit(1);
    }
    --channelsAdded;
  });
}

while(channelsAdded > 0) {}

for(const bond of dbJson.bonds) {
  bondQuery.create(bond, (error: QueryError) => {
    if(error) {
      console.log("Error [" + error.code + "]: unable to import bond");
      process.exit(1);
    }
    --bondsAdded;
  });
}

while(bondsAdded > 0) {}

console.log("Done");
