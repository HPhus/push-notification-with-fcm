import { throwIfMissing, sendPushNotification, readSensorData } from './utils.js';

throwIfMissing(process.env, [
  'FCM_PROJECT_ID',
  'FCM_PRIVATE_KEY',
  'FCM_CLIENT_EMAIL',
  'FCM_DATABASE_URL',
]);

export default async ({ req, res, log, error }) => {
if (req.method == "GET") { 
  await readAndSendNoti()
  return res.json({message: 'Start testing the realtime read senor value and push notification function' });
}

if(req.method == "POST") {
  try {
    throwIfMissing(req.body, ['deviceToken', 'message']);
    throwIfMissing(req.body.message, ['title', 'body']);
  } catch (err) {
    return res.json({ ok: false, error: err.message }, 400);
  }

  log(`Sending message to device: ${req.body.deviceToken}`);

  try {
    const response = await sendPushNotification({
      data: {
        title: req.body.message.title,
        body: req.body.message.body,
      },
      tokens: req.body.deviceToken,
    });

    log(`Successfully sent message: ${response}`);

    return res.json({ ok: true, messageId: response });
  } catch (e) {
    error(e);
    return res.json({ ok: false, error: 'Failed to send the message' }, 500);
  }
}

};
