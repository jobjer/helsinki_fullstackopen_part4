# helsinki_fullstackopen_part4

Exercise 4.1:
run these npm install commands to generate package.json: 
npm install express
npm install --save-dev nodemon
npm install cors
npm install mongoose

npm install eslint --save-dev
npx eslint --init (do this in cmd, not in vs code terminal, because of issue on this pc)

maybe?
npm install axios
npm install dotenv

"scripts": {
"start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
},

npm run dev

const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

