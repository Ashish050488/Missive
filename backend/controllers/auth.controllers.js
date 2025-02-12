import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import generateTokenAndSetCookie from '../utils/generateToken.js';

// signup
export const  signupUser = async (req,res)=>{
    try {
        const {fullName, username,password,confirmPassword,gender } = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({
                error:'Passwords do not match'
            })
        }

            const user = await User.findOne({username});
            if (user) {
                return res.status(400).json({
                    error:'user already exist',
            })
            }

            //  Hashing
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)

            
            // profile
            const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
            const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`


            const newUser = new User({
                fullName,
                username,
                password:hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            });

            if(newUser){
                // Generate Jwt token
                generateTokenAndSetCookie(newUser._id,res);
                await newUser.save();


            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                profilePic:newUser.profilePic
            })
            }else{
                return res.status(400).json({error:'Invalid User'})
            }


    } catch (error) {
        console.error('Error during user signup:', error); // Log the error for debugging
        return res.status(500).json({
            error: "cannot signup the user",
            message: error.message, // Optional: Include error details in the response
        });
    }

}


//login
export const loginUser =async (req,res)=>{
    try {

        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

        // if user  ka data galat hai
        if(!user || !isPasswordCorrect ){
            return res.status(400).json({
                error:'Invalid Credentials'
            })
        };

        // data sahi hai
        generateTokenAndSetCookie(user._id,res);
        return res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            profilePic:user.profilePic
        });


    } catch (error) {
        console.error('Error during user signup:', error); // Log the error for debugging
        return res.status(500).json({
            error: "cannot signup the user",
            message: error.message, // Optional: Include error details in the response
        });
    }
    
    
}



// logout
export const logoutUser = (req,res)=>{
    try {
        res.cookie('jwt',"",{maxAge:0});
        res.status(200).json({message:"Logget out successfully"})
    } catch (error) {
        console.error('Error during user signup:', error); 
        return res.status(500).json({
            error: "cannot signup the user",
            message: error.message, 
        });
    }

 
    
}
