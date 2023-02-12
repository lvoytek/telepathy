# Telepathy
A Discord application for messaging subsets of people in a server

## Background
If for some reason you find yourself wanting to communicate with others on Discord via a dynamic network topography rather than a standard channel, then this is the app for you. Telepathy provides a backend that allows users to build out custom groups through individual connections.

## Add to your server
There is no public live version of this application. However, if you want to use telepathy on your server you can [create your own](#create-your-own-telepathy-app) using the code from this repository.
## How to use
Once the Telepathy application is added to the server, create a new network with the /setuptelepathy command. A channel with a name based on the one provided in the command will be created for each user. The new network starts off with no connections, so when visualizing it looks something like this:

![Default Graph](img/default-graph.png)

To create a connection with another person, use the /bond command. For example, if Alice runs `/bond Bob` in her channel, the graph will look like this:

![Alice and Bob connected](img/graph-1-connection.png)

Now when Alice sends messages in her channel they will show up in Bob's channel and vice versa. Next, if Alice adds Charlie, Charlie adds Bob, Bob adds Dave, and Dave adds Eve the graph will become:

![Multiple Connections](img/graph-multiple-connections.png)

Now when Alice sends a message in her channel it goes to Bob and Charlie. When Bob sends a message it goes to Alice, Charlie, and Dave, and so on.

To see who is currently connected to you, run the listbonds command. When Dave runs `/listbonds` the bot returns:

    Bonds: @Bob, @Eve

To remove a connection, run the unbond command. If Charlie runs `/unbond Alice` then `/listbonds` the bot will reply with:

    Bonds: @Bob

When another user is bonded to you, you can also direct message them via the telepathy channel. Since Charlie is connected to Bob, they can talk to him directly by either mentioning him at the beginning of a message or by using the `dm` command. For example, to say "Hello," they can either type `@Bob Hello` or `/dm @Bob Hello`.

## Bot commands
### setuptelepathy
usage: /setuptelepathy [network name]

Set up private channels for each user to send telepathy messages through, along with a spectator role for the network. The network name is used to differentiate the channels and role for the created telepathy structure.

### bond
usage: /bond [user]

Add another user to your telepathy group. With the user connected, whenever you send a message in your channel they will see it in theirs. This command must be run in a telepathy channel for the connection to work.

### unbond
usage: /unbond [user]

Remove a user from your telepathy group. Removed users will no longer see messages you send in your telepathy channel. This command must be run in a telepathy channel to work.

### listbonds
usage: /listbonds

Show a list of people who are in your telepathy group. This command must be run in a telepathy channel to work.

### dm
usage: /dm [user] [message]

To send a message only to a specific contact, you can start a message in your channel with @<userid>. However, since this is often inconvenient on discord due to users outside the channel not showing up, you can also send a direct message with the dm command. Specify the user to send the message to in the user section, and add the message to the message section. This command must be run in a telepathy channel to work.

## Create your own Telepathy app
### Create the discord app
In a web browser log in to discord and access the [developer portal](https://discord.com/developers/applications).

Select `New Application` and give it a name.

In the `General Information` tab you can give your application a name, a description, and a profile picture.

In the `Bot` tab, select `Add bot`. You can then add a profile picture and name for the bot.

In the `token` section for the bot, select `Reset Token` then `Copy`. Paste the token in  a secure location and do not share it.

![Reset Token](img/reset-token.png)
![Copy Token](img/copy-token.png)

Next, select at least `SERVER MEMBERS INTENT` and `MESSAGE CONTENT INTENT`:

![Bot tab selections](img/bottab.png)

Now select `OAuth2 > URL Generator` to create the URL for your application.

In the `scopes` section select `bot` and `applications.commands`. Then in the following `Bot Permissions` section select `Manage Roles`, `Manage Channels`, `Manage Webhooks`, `Send Messages`, `Embed Links`, and `Attach Files`.

![Bot Permissions](img/bot-permissions.png)

Now copy the link at the bottom of the page. This can be used to add your bot to a Discord server.

### Backend Setup
To run Telepathy, you will need a system that will always be online when needed that can run MySQL and nodejs.

Start by installing MySQL, either from the [website](https://www.mysql.com/downloads/) or via a package manager.

Next, install NodeJS with version >= 16.9.0. [nvm](https://github.com/nvm-sh/nvm) makes this easier to do. Then install yarn through npm

    npm install -g yarn

Finally, install git on your system.

Clone the repository with the following command:

    git clone https://github.com/lvoytek/telepathy.git

Enter the repository and install npm packages.

    cd telepathy
    yarn install

Now set up the .env file for the app. There is an example file to base it off of in the repository called [.env.example](.env.example).

In the token section, paste your token from the discord app page. Then choose a custom password for the password section.

If you are using a MySQL server on the same system, leave localhost as is, otherwise set MYSQL_HOST to the remote ip or site name. The MySQL user and db name can be whatever you want, just make sure to set them accordingly when building the database.

Next, build the database. Enter the mysql console then type the following commands:

    mysql
    > CREATE USER 'discordbot'@'localhost' IDENTIFIED BY 'password';
    > CREATE DATABASE telepathy;
    > GRANT ALL PRIVILEGES ON `telepathy` . * TO 'discordbot'@'localhost';

To create the tables, run the setupdb script in the repository.

    npm run setupdb

Now the app can be started with:

    yarn start

## Migrate to a new server

If you would like to move your telepathy backend to a new server, there are some additional scripts in this repository that can be used to do so.

### Export data from original server

Access your original server, and in the telepathy directory run:

    npm run exportdb

This will create the file `db.json` containing all relevant data from the mysql database. Copy this file to the telepathy directory of the new server.

### Import data to the new server

Initialize the new server normally through the [Backend Setup](#backend-setup) section, and add your token and credentials to the .env file. Then, with `db.json` in the directory, run:

    npm run importdb

The new server should now be ready to run the existing telepathy channels again.
