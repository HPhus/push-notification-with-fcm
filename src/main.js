import { throwIfMissing, sendPushNotification, index,isMoreThan5MinutesAgo } from './utils.js';
import { Client, Databases ,Query} from 'node-appwrite';

throwIfMissing(process.env, [
  'FCM_PROJECT_ID',
  'FCM_PRIVATE_KEY',
  'FCM_CLIENT_EMAIL',
  'APPWRITE_URL',
  'APPWRITE_FUNCTION_PROJECT_ID',
  'SENSOR_COLLECTION_ID',
  'USERS_COLLECTION_ID',
]);

export default async ({ req, res, log, error }) => {
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
    .setEndpoint(process.env.APPWRITE_URL)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
  const databases = new Databases(client);

  try {
    const buildingDatabaseID = process.env.BUILDING_DATABASE_ID;
    const sensorCollectionID = process.env.SENSOR_COLLECTION_ID;
    const userCollectionID = process.env.USERS_COLLECTION_ID;

    await databases.updateDocument(
      "6682a4940008a5cdf763",
      "6684f3c2000586689f8a",
      "6684fa610035fa60c6d5",
      {
        battery: parseFloat("50"),
      }
    );

    // const users = await databases.listDocuments(
    //   buildingDatabaseID,
    //   userCollectionID,
    //   [Query.limit(100000), Query.offset(0)]
    // );
    // const deviceTokens = users.documents.map((document) => document.deviceToken);

    // const promise = await databases.listDocuments(
    //   buildingDatabaseID,
    //   sensorCollectionID,
    //   [Query.limit(100000), Query.offset(0)]
    // );

    // promise.documents.forEach(async (item) => {
    //   const currentDate = new Date();

    //   if (
    //     item.value > 1000 &&
    //     isMoreThan5MinutesAgo(item.lastNotification, currentDate)
    //   ) {
    //     // context.log('Sensor:' + item);
    //     await sendPushNotification({
    //       data: {
    //         title: 'Cảnh báo cháy',
    //         body:
    //           'Thiết bị ' + item.name + ' đang ở mức độ cảnh báo cháy ('+item.value+")",
    //         sensorId: item.$id,
    //       },
    //       tokens: deviceTokens,
    //     });

    //     await databases.updateDocument(
    //       buildingDatabaseID,
    //       sensorCollectionID,
    //       item.$id,
    //       {
    //         lastNotification: currentDate,
    //       }
    //     );
    //   }
    // });
  } catch (e) {
    log(e);
  }

  return res.json({
    message:
      'Start testing the realtime read senor value and push notification function',
  });
};
