# Telepathy
A Discord application for messaging subsets of people in a server

## How to use

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

## Setup
