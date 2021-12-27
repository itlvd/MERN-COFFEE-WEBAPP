const userService = require('./userService');

const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const {check, validationResult} = require('express-validator');
const User = require('../../models/userModel');

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
  });

exports.getProfile = (req, res) => {
    res.render('profile', {
        title: "Profile",
        mess: "",
    })
}

exports.updateImage = async (req, res) => {
    const id = req.params.id;
    
    const user = await userService.findById(id);
    //console.log("user find by id:\n\n" + JSON.stringify(user));
    
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {        
        if (files.image.originalFilename) {
            if (user) {
                
                // cloudinary.uploader.upload(files.image.filepath, { public_id: `mern/users/${user._id}/${user.username}`,overwrite: true, width: 192, height: 192, crop: "scale", fetch_format: "jpg"})
                
                // const newLink = "https://res.cloudinary.com/mernteam/image/upload/mern/users/" + user._id + "/" + user.username + ".jpg";
                
                // userService.updateImage(newLink, id);
                
                // res.redirect('/me');

                let newLink;
                await cloudinary.uploader.upload(files.image.filepath, { public_id: `mern/users/${user._id}/${files.image.newFilename}`,overwrite: true, width: 192, height: 192, crop: "scale", fetch_format: "jpg"}, function(error, result) {
                    //await productService.updateImage(result.url, newPromo._id);
                newLink = result.url;            
                });            
                await userService.updateImage(newLink, id);            
                res.redirect('/me');
            } 
        } else {
            res.redirect('/me');
        }      
    })
};


exports.saveUpdate = async (req, res) => {
    const id = req.user._id;

    const name = await req.body.name;
    const email = await req.body.email;
    const phone = await req.body.phone;
    const username = await req.body.username;
    const password = await req.body.password;
    const password2 = await req.body.password2;
    const address = await req.body.address;
    
    const isRightPass = await userService.validPassword(password, req.user);
   
    if (isRightPass==true) {
       
        try {
            await userService.updateUser(id, name, email, phone, address, username, password);
            res.redirect('/me');
        } catch (Exception) {
          
            res.redirect('/');
        }
    } else {
        res.render('profile', {
            user: req.user,
            title: "Profile",
            mess: "Wrong password",
        })
    }
}