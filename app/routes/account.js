const express = require('express')
const bcrypt = require('bcrypt')
const user = require('../controller/userController')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const router = express.Router()