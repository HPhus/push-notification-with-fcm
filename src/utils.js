import admin from 'firebase-admin';

throwIfMissing(process.env, [
  'FCM_PROJECT_ID',
  'FCM_PRIVATE_KEY',
  'FCM_CLIENT_EMAIL',
  'FCM_DATABASE_URL',
]);

// initailze firebase app
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "fas-test-8c92a",
    clientEmail: "firebase-adminsdk-zz4hm@fas-test-8c92a.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLjc8Ztd6dWh90\nWhd0HFoDQk/gCHDYMP2elnXnOYkfCA2eODhilL+W6gS+HGOejItJlCHzm7soEzqc\nAG6YKTD+sXrskmUX5sMPeYmRhRM6QpIY9xcjv894InZBi0qMfMhi1WQPMjYmwtV+\nSUqk78RJMHzIuJ65n8F0CTftFKk6DuhfOTa4Xab4EZ6+Hhaaj4uqBGA2w60MmG4V\nV2VRL+Ch8pNOueo0/WRN/tQkJyutNzcS/4GvgvpSqlcroGmdZ+TY9dvc0JBBgjKZ\nic5mQvPzFaRh127qjeLXds9u5eWHkukqQVGNaVaRhrt9Wv2IuInniy1dcN2e2YJO\nNS40VNOpAgMBAAECggEAANhwO9DlcYV0WWh+jdxdyS3DSkC4DkUoJ9qDt2/bMyer\n3c8UOIrvX544d5KDh+muckIVINocsoTfmBJeOI/S53s/fFV7KcNLEV4C/XmeO95X\nABdLpMR+epG4aHCJNluWKKdD/4D+WFYev/k9iqvrxpWMLnhqLAbJuAnfQ3hJNSe6\nNvqRPPOjZF5ITd1A5qtdf0fnxZOCMD7Eomz4spI1NIDXNLg9hEjkVv00SXuegByz\nkLWH4iZY2bPdebPy7Uujbndfz2/POZJJqPQbm8sU1BmV3U+ZDpQI8Q2TOd/QPQs+\nXef5+VS3OjHdMpBGeoL7vzD3+JSHn5HbRVAf9iWtsQKBgQDu6tsOkA1/JMQC0F3C\nOGwjmVigGAlGbWQvf1To6gCBof6ad8NfeSURG8ioNKq5RFJAJEl26hAoTgzzk9+p\ncnyEmM0d1H+A7XYu4R3qkKmuxoSRksQDZdcPM+gSGz+qGrFo6dlTCZYbk0Usk6i4\nBvrgfR5OGuJje8nb7u2PwL2Y+QKBgQDaG6kSZDoLhvZMSHN42/2Nn9RWI99Cw3PW\no9w0Brh1BQEPKHECij5TYurLApRToJ9cWcsnj0Xp1dwJSL9V3LjFDiUcud8w56XB\n5YvstHcGYocnXH4/MMU6dS9ponQqFSk3YdJ+/W+Q0MsLZTw0YxgiLa5G8EQRauhM\n/KtSzW3sMQKBgQDipJRtuiWziVMQQE3RIuki1COIq4SQ9NDnZelMkj8sulnmetox\nxaBuHGc7ecrCuZc1FbdDQUNWmMQchRjVi6+nsbRTKfRSf/FvA0r364esLtIvroSX\nnJJo75qlIohAe9X0anIpHZzyR8CFSwXwnV58evS2rzY3nYSeSIe/qN2zMQKBgEgg\nx5vea1eujTsS5qT8U3CHf6fw+v9QNbmwvLyz0EJaokwJ+r11TEE1QCJcuwKg5rKa\nu1VcyykWYUrstOHHOY9pKxrB2S6KHMXvjIN99rK02K9KpjFthnvbjw9m+vWDw/qd\nrgfy9fc1JUCifPNyJeP/qVeqU0hTS3lSQbIDX6uxAoGAdKcDjXiuEOXU3yIouzIi\nb7vmfKd2gZKs9/njepVxydS6R9/D0+e8lFQl54syQ2RfPckIx7ETD27Sv/VasDll\n2ikfmLS0hzJ1H1WFAcFhNxJt+js2yVJXr13pYEqqgx1GnXDjLs/8rnT4YsgEzPef\njLhCLs1G3akOosX+GnmRFcc=\n-----END PRIVATE KEY-----\n"
  }),
  databaseURL: "https://fas-test-8c92a-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

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
    throw "error on messaging ";
  }
}
