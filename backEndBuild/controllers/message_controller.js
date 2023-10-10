"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = exports.getMessages = void 0;
const Messages = require("../models/message");
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to } = req.body;
        const messages = yield Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        return res.status(200).json({ projectedMessages });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.getMessages = getMessages;
const addMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to, message } = req.body;
        const data = yield Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
        let msg = {
            fromSelf: data.sender.toString() === from,
            message: data.message.text,
        };
        if (data)
            return res.status(200).json({ msg });
        else
            return res.status(500).json({ msg: "Failed to add message to the database" });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addMessage = addMessage;
