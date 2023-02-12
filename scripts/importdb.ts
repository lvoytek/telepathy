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

const addUsers = () => {
  for(const user of dbJson.users) {
    console.log("Adding user " + user.userid);
    userQuery.create(user, (error: QueryError) => {
      if(error) {
        console.log("Error [" + error.code + "]: unable to import user");
        process.exit(1);
      }

      --usersAdded;
      console.log("Added user, " + usersAdded + " users left.");
    });
  }
}

const addNetworks = () => {
  if(usersAdded > 0) {
    setTimeout(addNetworks, 1000);
    return;
  }

  for(const network of dbJson.networks) {
    console.log("Adding network " + network.networkid);
    networkQuery.create(network, (error: QueryError) => {
      if(error) {
        console.log("Error [" + error.code + "]: unable to import network");
        process.exit(1);
      }

      --networksAdded;
      console.log("Added network, " + networksAdded + " networks left.");
    });
  }
}

const addChannels = () => {
  if(networksAdded > 0) {
    setTimeout(addChannels, 1000);
    return;
  }

  for(const channelData of dbJson.channels) {
    const network = {networkid: channelData.network};
    const user = {userid: channelData.user};
    const channel = {network, user, channelid: channelData.channelid, spectator: channelData.spectator};
    console.log("Adding channel " + channel.channelid);

    channelQuery.create(channel, (error: QueryError) => {
      if(error) {
        console.log("Error [" + error.code + "]: unable to import channel");
        process.exit(1);
      }
      --channelsAdded;
      console.log("Added channel, " + channelsAdded + " channels left.");
    });
  }
}


const addBonds = () => {
  if(channelsAdded > 0) {
    setTimeout(addBonds, 1000);
    return;
  }

  for(const bondData of dbJson.bonds) {
    const user1 = {userid: bondData.user1};
    const user2 = {userid: bondData.user2};
    const network = {networkid: bondData.network};
    const bond = {user1, user2, network};
    console.log("Adding bond between " + bond.user1 + " and " + bond.user2);
    
    bondQuery.create(bond, (error: QueryError) => {
      if(error) {
        console.log("Error [" + error.code + "]: unable to import bond");
        process.exit(1);
      }
      --bondsAdded;
      console.log("Added bond, " + bondsAdded + " bonds left.");
    });
  }
}

addUsers();
addNetworks();
addChannels();
addBonds();
