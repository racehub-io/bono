import functions = require("firebase-functions/v1");

import { uploadApp } from "./apps/uploadApp";
import { fileCheckApp } from "./apps/fileCheckApp";
import { logMachineUsage } from "./apps/logMachineUsage";

exports.upload = functions.https.onRequest(uploadApp);
exports.exists = functions.https.onRequest(fileCheckApp);
exports.logMachineUsage = functions.https.onRequest(logMachineUsage);
