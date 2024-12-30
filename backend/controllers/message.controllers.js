import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'


export const sendMessage = async(req,res)=>{

    try {
        const {message} =req.body;
        const {id:reciverId}=req.params;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            participiants:{$all:[senderId,reciverId]},
        });
        if(!conversation){
            conversation = await Conversation.create({
                participiants:{$all:[senderId,reciverId]},
            })
        };
        const newMessage = await Message.create({
            senderId,
            reciverId,
            message,
        })
        if(newMessage){
            conversation.messages.push(newMessage._id);
        };
        // await conversation.save(); // this saving process will take more time as it save one by one by first conversation then newMessage
        // await newMessage.save();

        // this will run both save in parallel
        await Promise.all([conversation.save(),newMessage.save()])

        res.status(201).json(newMessage)

    } catch (error) {
        console.log('error in send message',error.message);
        res.status(500).json({error:'internal server error'});
    }
    
}