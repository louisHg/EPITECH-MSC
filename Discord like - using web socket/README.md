# Javax
Javax is a MERN chat app which use socketIo to worked

## Installation

Use the package manager nodejs with Node Package Manager.
After clone or install this projects and launch in the folder associate :

--> Open 2 terminales to compile the project :
    - One called irc-project 
    - And the second, irc-api

After launch this 2 commands to compile
```bash
npm install 
```

```bash
npm start
```

## Usage

irc-project :

```javascript
"dependencies": {
    "@testing-library/jest-dom": "^5.16.1",
    "@testing-library/react": "^12.1.2",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^0.24.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-router-dom": "^6.2.1",
    "react-scripts": "5.0.0",
    "socket.io": "^4.4.0",
    "socket.io-client": "^4.4.0",
    "web-vitals": "^2.1.2"
  },
  "scripts": {
    "start": "PORT=8080 react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
```

irc-api :

```javascript
"dependencies": {
    "bcryptjs": "^2.4.3",
    "colors": "^1.4.0",
    "cors": "^2.8.5",
    "dotenv": "^14.2.0",
    "express": "^4.17.2",
    "express-async-handler": "^1.2.0",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^6.1.7",
    "nodemon": "^2.0.15",
    "socket.io": "^4.4.1"
  }
```

## Command

For used the command, please written "/help" on the Chat.

## Database

We use NoSQL saved on Atlas

## Contributing
Enjoy test and good luck!

Please make sure to update node as appropriate.

## License
[EpidConnexion]
