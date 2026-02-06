
import { Config } from './types';

export const CONFIG: Config = {
  introLines: [
    "Hey you,",
    "Pause...",
    "I made something small just for you.",
    "Ready?"
  ],
  questionTitle: "Will you be my Valentine?",
  subtext: "No pressure. Just a soft, real, honest “yes” if your heart says so.",
  yesMessageTitle: "You said yes, I knew it...",
  yesMessageBody: "I’d love to steal a little time with you this Valentine’s. Thank you for being you — it’s dangerously sweet.",
  signature: "- Signmature",
  audioSrc: "./assets/mj.mp3",
  audioLoop: {
    start: 145,   // seconds
    end: 300     // seconds
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
