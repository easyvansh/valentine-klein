
export type ScreenState = 'intro' | 'question' | 'yes';

export interface Config {
  introLines: string[];
  questionTitle: string;
  subtext: string;
  yesMessageTitle: string;
  yesMessageBody: string;
  signature: string;
  defaultAudioKey: 'awnw' | 'pp' | 'kmph';
  audioTracks: {
    awnw: {
      src: string;
      start: number;
      end: number | null;
    };
    pp: {
      src: string;
      start: number;
      end: number | null;
    };
    kmph: {
      src: string;
      start: number;
      end: number | null;
    };
  };
  emailMode: 'emailjs' | 'none';
  emailjs: {
    publicKey: string;
    serviceId: string;
    templateId: string;
  };
}
