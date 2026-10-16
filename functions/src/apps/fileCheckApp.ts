/* eslint-disable */
import { bucket, validateFirebaseIdToken } from "../firebase/helpers";
const cookieParser = require("cookie-parser")();
const express = require("express");
const cors = require("cors");

const fileCheckApp = express();

fileCheckApp.use(cors({ origin: true }));
fileCheckApp.use(cookieParser);
fileCheckApp.use(validateFirebaseIdToken);

fileCheckApp.get("/:userId/:fileName", async (req: any, res: any) => {
  try {
    const userId = req.user.uid;
    const fileName = req.params.fileName;

    const [exists] = await bucket
      .file(`rhc/${userId}/${fileName}.rhc`)
      .exists();

    return res.status(201).send({ exists });
  } catch {
    return res.status(401).send({ error: "Couldn't generate upload URL" });
  }
});

export { fileCheckApp };
