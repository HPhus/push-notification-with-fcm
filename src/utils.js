import admin from 'firebase-admin';
import {Client,Databases} from 'node-appwrite';

throwIfMissing(process.env, [
  'FCM_PROJECT_ID',
  'FCM_PRIVATE_KEY',
  'FCM_CLIENT_EMAIL',
  'FCM_DATABASE_URL',
]);

// initailze firebase app
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FCM_PROJECT_ID,
    clientEmail: process.env.FCM_CLIENT_EMAIL,
    privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.FCM_DATABASE_URL,
});

const client = new Client()
  .setEndpoint(process.env.APPWRITE_FUNCTION_PROJECT_ID)
  .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);
const databases = new Databases(client);

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

export async function readAndSendNoti() {
  setInterval(async () => {
    try {
      const buildingDatabaseID = process.env.BUILDING_DATABASE_ID;
      const sensorCollectionID = process.env.SENSOR_COLLECTION_ID;
      const userCollectionID = process.env.USERS_COLLECTION_ID;
      const users = await databases.listDocuments(
        buildingDatabaseID,
        userCollectionID,
        [sdk.Query.limit(100000), sdk.Query.offset(0)]
      );
      const deviceTokens = users.documents.map((document) => document.token);

      const promise = await databases.listDocuments(
        buildingDatabaseID,
        sensorCollectionID,
        [sdk.Query.limit(100000), sdk.Query.offset(0)]
      );

      promise.documents.forEach(async (item) => {
        if (item.value > 1000) {
          log('Sensor:' + item);
          await sendPushNotification({
            data: {
              title: 'Cảnh báo cháy',
              body:
                'Thiết bị ' + item.name + ' đang ở mức độ cảnh báo cháy (1000)',
              sensorId: item.$id,
            },
            tokens: deviceTokens,
          });
        }
      });
    } catch (e) {
      log('Read sensor error:' + e);
    }
  }, 300000);
}
