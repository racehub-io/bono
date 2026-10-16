/* eslint-disable */
import { bucket, validateFirebaseIdToken } from "../firebase/helpers";
const cookieParser = require("cookie-parser")();
const express = require("express");
const cors = require("cors");

const uploadApp = express();

uploadApp.use(cors({ origin: true }));
uploadApp.use(cookieParser);
uploadApp.use(validateFirebaseIdToken);

uploadApp.get("/:userId/:fileName", async (req: any, res: any) => {
  try {
    const userId = req.user.uid;
    const fileName = req.params.fileName;

    const options = {
      version: "v4",
      action: "write",
      // expires in 10 minutes
      expires: Date.now() + 10 * 60 * 1000,
      contentType: "application/octet-stream",
    };

    const [url] = await bucket
      .file(`telemetry/${userId}/${fileName}`)
      .getSignedUrl(options as any);

    return res.status(201).send({ message: "Success", url });
  } catch {
    return res.status(401).send({ error: "Couldn't generate upload URL" });
  }
});

export { uploadApp };
