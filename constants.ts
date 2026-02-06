
import { Config } from './types';

export const CONFIG: Config = {
  introLines: [
    "Hey you.",
    "Pause… I made something small but real for you.",
    "Ready?"
  ],
  questionTitle: "Will you be my Valentine?",
  subtext: "No pressure. Just one honest 'yes' if your heart says so.",
  yesMessageTitle: "You said yes, I knew it...",
  yesMessageBody: "I'd love to share my Valentine's with you. Thank you for being you.",
  signature: "- Vansh",
  audioSrc: "./assets/mj.mp3", 
  audioLoop: {
  start: 62,   // seconds
  end: 120     // seconds
},
  emailMode: 'none', // Set to 'emailjs' and fill the below if you have an account
  emailjs: {
    publicKey: "YOUR_PUBLIC_KEY",
    serviceId: "YOUR_SERVICE_ID",
    templateId: "YOUR_TEMPLATE_ID"
  }
  
};

export const TEASING_MICROCOPY = [
  "Nice try 😌",
  "Not today.",
  "That button has… survival instincts.",
  "Okay okay, I see you 😂",
  "Only one path today, love."
];
