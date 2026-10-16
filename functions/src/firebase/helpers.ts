import { DownloadResponse } from "@google-cloud/storage";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
const functions = require("firebase-functions/v1");
const path = require("path");

initializeApp();

const bucket = getStorage().bucket();

const db = getFirestore();

function getServerTimestamp() {
  return FieldValue.serverTimestamp();
}

function uploadToStorage(
  fileToUpload: Buffer,
  filePath: string,
  fileName: string,
  fileExtension: string
): Promise<void> {
  const joinedPath = path.join(filePath, fileName);
  const file = bucket.file(joinedPath);
  return file.save(fileToUpload, {
    contentType: fileExtension,
    resumable: false,
    private: true,
  });
}

async function downloadFromStorage(
  userId: string,
  fileMD5: string
): Promise<DownloadResponse | undefined> {
  try {
    return await bucket.file(`rhc/${userId}/${fileMD5}.rhc`).download();
  } catch {
    throw new Error("Storage download failed.");
  }
}

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
async function validateFirebaseIdToken(req: any, res: any, next: any) {
  functions.logger.log("Check if request is authorized with Firebase ID token");

  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    functions.logger.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>",
      'or by passing a "__session" cookie.'
    );
    res.status(403).send("Unauthorized");
    return;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    functions.logger.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    functions.logger.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send("Unauthorized");
    return;
  }

  try {
    const decodedIdToken = await getAuth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    functions.logger.error("Firebase ID token verification failed.");
    res.status(403).send("Unauthorized");
    return;
  }
}

export {
  bucket,
  db,
  getServerTimestamp,
  uploadToStorage,
  downloadFromStorage,
  validateFirebaseIdToken,
};
