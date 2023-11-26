import axios from 'axios';

export const createNoticeSMS = async () => {
  try {
    const response = await axios.post(
      'https://rest.messagebird.com/messages',
      {
        recipients: ["0816422174"],
        originator: '{321321}',
        body: "message",
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'AccessKey {aTyhnlzUGjB58PnPmFv2c7kxY}',
        },
      }
    );

    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};