const UserS = require("../services/user/user_service");
const address_validator = require("../validation/address_validator");

class UserController {

    async  getUser(req,res) {
        const {userId} = req.user;
       try {
            let user = await UserS.getUserById(userId);
            const address = await UserS.getUserAddressByUserId(userId);
            user = {...user._doc,address};
            return res.status(200).json({status:true,user})
           
       } catch (error) {
      
            return res.status(500).json({status:false,error:error.message})
       }
    }
    async addAddress(req,res){
        try {
            const {userId} = req.user;
            const validatedAddress = address_validator.validate(req.body)
            const result = await UserS.addAddress({userId,address:validatedAddress});
            return res.status(200).json({status:true,address:result})
       } catch (error) {
       
            return res.status(500).json({status:false,error:error.message})
       }
    }


}

const UserC =new  UserController();
module.exports = UserC;