import User from "../models/user.js"
import Message from "../models/message.js";
export const getusersforsidebar=async (req,res)=>{
    try{
        const loggedinuser=req.user._id
        const filterusers= await User.find({_id: {$ne: loggedinuser}}).select("-password");
        res.status(200).json(filterusers)
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: "internal server" });
    }
}

export const getmessages=async(req,res)=>{
    try {
        const {id:usertochatid}= req.params;
        const senderId= req.user._id
        const messages= await Message.find({
            $or:[
                {senderId:senderId, receiverId: usertochatid},
                {senderId:usertochatid, receiverId: senderId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server" });    }
}

export const sendmessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
    });

    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
