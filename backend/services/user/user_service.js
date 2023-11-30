const Address = require("../../models/address");
const userModel = require("../../models/userModel");

class UserService {

  async  getUserById(userId){
        return await userModel.findOne({_id:userId},'_id name username email isVerified profile address role gender');
    }
    async getUserAddressByUserId(userId){
        return await Address.find({userId:userId})
    }
async addAddress({userId,address}){
    return await Address({
        default:false,
        userId:userId,
        billing:address,
        delivery:address
    }).save()
}

}



const UserS = new UserService();
module.exports = UserS;