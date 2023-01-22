const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const { isValidRequestBody, isValidObjectId, isValid, isValidEmail, isValidPassword, moblieRegex } = require('../utils/utils');




/* +++++++++++++++++++++++++++++++++++++++++++++++++++++ Create User +++++++++++++++++++++++++++++++++++++++++++++++++++ */




const createUser = async (req, res) => {
    try {
        let data = req.body;
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: " Enter data in body" })
        }

        let { name, email, password, phone } = data

        if ( !name || !email || !password || !phone ) {
            return res.status(400).send({ status: false, message: "please fill all field properly" })
        }

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: " name should be in onlyalphabate" })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: " invalid Email" })
        }

        let uniqueEmail = await userModel.findOne({ email: email })
        if (uniqueEmail) {
            return res.status(400).send({ status: false, message: " this email already exist" })
        }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: " password contain atleast one spacial character, Number, Alphabet, length should be 8 to 15 " })
        }

        data.password = bcrypt.hashSync(password, 10)

        if (!isValid(phone)) { return res.status(400).send({ status: false, message: "phone number is required" });
          }
      
          if (!moblieRegex(phone))
            return res.status(400).send({
              status: false,
              message: "Phone number must be a valid Indian number .",
            });
      
          const checkPhoneFromDb = await userModel.findOne({ phone: phone });
      
          if (checkPhoneFromDb) {
            return res.status(400).send({
              status: false,
              message: `${phone} is already in use, Please try a new phone number.`,
            });
          }

        let savedData = await userModel.create(data)
        return res.status(201).send({ status: true, data: savedData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
};




/* +++++++++++++++++++++++++++++++++++++++++++++++++++++ Get User +++++++++++++++++++++++++++++++++++++++++++++++++++ */




const getUser = async (req, res) => {
    try {

        let users = await userModel.find();
        if (users.length == 0) return res.status(404).send({ status: false, message: "There are no users." });

        return res.status(200).send({ status: true, data: users });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};




/* ++++++++++++++++++++++++++++++++++++++++++++++++++++ Update User ++++++++++++++++++++++++++++++++++++++++++++++++++ */




const updateUser = async (req, res) => {
    try {
        let userId = req.params.userId || req.query.userId;
        if (!userId) return res.status(400).send({ status: false, message: 'pls give a userId in params' });
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'pls give a valid userId in params' });
        let user = await userModel.findById({userId});
        if (!user) return res.status(404).send({ status: false, message: 'sorry, No such user exists with this Id' });

        let body = req.body;
        let { name, email, password, phone } = body;
        if (isValidRequestBody(body)) return res.status(400).send({ status: false, message: 'please enter body' });

        if (user && user.isDeleted == false) {
            user.name = name;
            user.email = email;
            user.password = password;
            user.phone = phone;
            
            user.save();
            return res.status(200).send({ status: true, data: user });
        } else {
            return res.status(404).send({ satus: false, message: 'No such user found or it is deleted' });
        }

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};




/* ++++++++++++++++++++++++++++++++++++++++++++++++++++ Delete User ++++++++++++++++++++++++++++++++++++++++++++++++++ */




const deleteUser = async (req, res) => {
    try {

        let userId = req.params.userId;
        //console.log(userId);
        if (!isValid(userId)) return res.status(400).send({ status: false, message: "Give a valid userId" });

        let user = await userModel.findOne({ _id: userId, isDeleted: false });
        if (!user) return res.status(404).send({ status: false, message: "This user doesn't exists." });

        await userModel.findOneAndUpdate({ _id: userId }, { isDeleted: true });

        return res.status(200).send({ status: true, message: "user deleted successfully." });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


module.exports = { createUser, getUser, updateUser, deleteUser };

