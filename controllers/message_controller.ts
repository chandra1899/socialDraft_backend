const Messages = require("../models/message");

export const getMessages = async (req:any,res:any) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg:{sender:string,message:{text:string}}) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    return res.status(200).json({projectedMessages})
  } catch (error) {
    return res.status(500).json({error:error})
  }
};

export const addMessage = async (req:any,res:any) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    let msg={
      fromSelf: data.sender.toString() === from,
      message: data.message.text,
    };
    if (data) return res.status(200).json({ msg });
    else return res.status(500).json({ msg: "Failed to add message to the database" });
  } catch (error) {
    return res.status(500).json({error:error})
  }
};
