
import { CONFIG } from '../constants';

/**
 * Sends a notification using EmailJS.
 * You'll need to install emailjs-com if you use this properly:
 * npm install @emailjs/browser
 */
export const sendEmailNotification = async () => {
  if (CONFIG.emailMode !== 'emailjs') return;

  const { publicKey, serviceId, templateId } = CONFIG.emailjs;

  // This is a dynamic import to avoid bundling it if not used
  try {
    const emailjs = await import('@emailjs/browser');
    
    const templateParams = {
      message: "She said YES! 💖",
      timestamp: new Date().toLocaleString(),
      browser: navigator.userAgent
    };

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.debug('Email sent successfully:', response.status, response.text);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
