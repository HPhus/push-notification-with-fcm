import admin from 'firebase-admin';
import { Client } from "appwrite";

throwIfMissing(process.env, [
  'FCM_PROJECT_ID',
  'FCM_PRIVATE_KEY',
  'FCM_CLIENT_EMAIL',
  'FCM_DATABASE_URL',
]);

export async function index(){
  const app = admin.initializeApp({
      credential: admin.credential.cert({
          projectId: process.env.FCM_PROJECT_ID,
          clientEmail: process.env.FCM_CLIENT_EMAIL,
          privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.FCM_DATABASE_URL,
  });

  const client = new Client()
      .setEndpoint(process.env.APPWRITE_URL)
      .setProject(process.env.APPWRITE_PROJECT_ID);

  const channel =
      "databases." +
      process.env.APPWRITE_URL +
      ".collections." +
      process.env.SENSOR_COLLECTION_ID +
      ".documents.*";
  const realtime = client.subscribe(channel, (response) => {
      // Callback will be executed on all account events.
      console.log(response);
  });
};

/**
 * Throws an error if any of the keys are missing from the object
 * @param {*} obj
 * @param {string[]} keys
 * @throws {Error}
 */
export function throwIfMissing(obj, keys) {
  const missing = [];
  for (let key of keys) {
    if (!(key in obj) || !obj[key]) {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

/**
 * @param {admin.messaging.Message} payload
 * @returns {Promise<string>}
 */
export async function sendPushNotification(payload) {
  try {
    return await admin.messaging().sendMulticast(payload);
  } catch (e) {
    throw 'error on messaging ';
  }
}

