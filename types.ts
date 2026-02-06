
export type ScreenState = 'intro' | 'question' | 'yes';

export interface Config {
  introLines: string[];
  questionTitle: string;
  subtext: string;
  yesMessageTitle: string;
  yesMessageBody: string;
  signature: string;
  audioSrc: string;
  audioLoop: {
    start: number;
    end: number;
  };
  emailMode: 'emailjs' | 'none';
  emailjs: {
    publicKey: string;
    serviceId: string;
    templateId: string;
  };
}
