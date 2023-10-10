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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const nodemailer=require('../config/nodemailer');
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
module.exports.signUp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let info = yield nodemailer_1.default.transporter.sendMail({
            from: process.env.AUTH_MAILER_EMAIL,
            to: email,
            subject: "Thank You",
            html: `Succesfully register on SocialMedia`
        });
        return;
    }
    catch (error) {
        console.log('error in sendind mail', error);
    }
});
