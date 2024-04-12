const User = require('../models/User');
const bcrypt = require('bcrypt');
const fs = require('fs');

exports.createUser = async (req, res) => {
    const { username, email, password } = req.fields;
    const {photo_user} = req.files;

    try {
        // Check if the user already exists with the provided email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password : hashedPassword,
            photo_user,
        });
        if (photo_user) {
            // If a photo is provided, read the photo file and set its data and content type to the product object
            newUser.photo_user.data = fs.readFileSync(photo_user.path);
            newUser.photo_user.contentType = photo_user.type;
        }

        // Save the new user to the database
        await newUser.save();

        res.status(201).json(newUser); // Return the newly created user
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getAllUser = (req, res)=> {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            console.error("Error fetching users", error);
            res.status(500).json({message: "Internal server error"})
        });
}

exports.delete = async (req , res)=>{
    try {
        const id = req.params.id;
        const result = await User.findByIdAndDelete({_id: id});
        res.status(200).json({ message: "User deleted successfully", result });
    } catch (error) {
        console.error("Error deleting User:", error);
        res.status(500).json({ message: "Internal server error" });
   
    }
};

exports.getoneuser = async (req , res) =>{

    try {
        const result = await User.findOne({_id : req.params.id});

        res.status(200).json({ result });
    }catch(error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




exports.updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.fields;
    const {photo_user} = req.files;

    const updateData = {
       username,
       email,
       password,
        photo_user,
    };

    if (photo_user) {
        updateData.photo_user = {
            data: fs.readFileSync(photo_user.path),
            contentType: photo_user.type
        };
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id, updateData , 
      { new: true } // Return the updated user
    )

    if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
} catch (error) {
    console.error("Error while updating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
}
};


exports.userPhoto = async (req , res) =>{
    try {
        const user = await User.findById(req.params.id).select("photo_user");

        if (!user) {
            return res.status(404).send({success : false , message: "user not found"});
        }

        if (user.photo_user && user.photo_user.data) {
            res.set("Content-Type", user.photo_user.contentType);
            return res.status(200).send(user.photo_user.data);
        } else {
            return res.status(404).send({ success: false, message: "Photo not found for this user" });
        }
    }catch(error){
        console.error("Error while getting user photo:", error);
        res.status(500).send({ success: false, message: "Internal server error" });
    }

};