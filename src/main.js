import {
  throwIfMissing,
  sendPushNotification,
  index,
  isMoreThan5MinutesAgo,
} from './utils.js';
import { Client, Databases, Query } from 'node-appwrite';
import admin from 'firebase-admin';

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
  try {
    const buildingDatabaseID = process.env.BUILDING_DATABASE_ID;
    const sensorCollectionID = process.env.SENSOR_COLLECTION_ID;
    const userCollectionID = process.env.USERS_COLLECTION_ID;

    const users = await databases.listDocuments(
      buildingDatabaseID,
      userCollectionID,
      [Query.limit(100000), Query.offset(0)]
    );
    const deviceTokens = users.documents.map((document) => document.deviceToken);
    log(deviceTokens);
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
