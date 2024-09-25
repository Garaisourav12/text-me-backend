const Message = require("../models/msgModel");
const Conversation = require("../models/conversationModel");
const { io, getSocketId } = require("../socket/index");

module.exports.sendMessage = async (req, res) => {
	const senderId = req.userId;
	const receiverId = req.params.id;
	const message = req.body.message;

	if (!message) {
		return res.status(400).json({ error: "You can't send empty message" });
	}

	if (!receiverId) {
		return res.status(400).json({ error: "Receiver id is missing" });
	}

	// As of now I will not allow user to send message to himself
	if (senderId === receiverId) {
		return res
			.status(400)
			.json({ error: "You can't send message to yourself" });
	}

	try {
		let gotConversation = await Conversation.findOne({
			participentsId: {
				$all: [senderId, receiverId],
			},
		});

		if (!gotConversation) {
			gotConversation = new Conversation({
				// create new conversation
				participentsId: [senderId, receiverId],
			});
		}

		// We will not save this message in database directly
		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		await newMessage.save();

		gotConversation.messages.push(newMessage);
		await gotConversation.save();

		// Scocket.io
		const receiverSocketIds = getSocketId(receiverId); // Return array of socketIds of multiple login
		if (receiverSocketIds) {
			receiverSocketIds.forEach((receiverSocketId) => {
				io.to(receiverSocketId).emit("newMessage", newMessage);
			});
		}

		const senderSocketIds = getSocketId(senderId);
		if (senderSocketIds) {
			senderSocketIds.forEach((senderSocketId) => {
				io.to(senderSocketId).emit("sentMessage", newMessage);
			});
		}

		return res.status(200).json({ message: newMessage });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

module.exports.getMessages = async (req, res) => {
	const senderId = req.userId;
	const receiverId = req.params.id;

	try {
		let conversation = await Conversation.findOne({
			participentsId: {
				$all: [senderId, receiverId],
			},
		});

		if (!conversation) {
			return res.status(200).json({ messages: [] });
		}

		const messages = await conversation.populate("messages");

		return res.status(200).json({ messages: messages.messages });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
