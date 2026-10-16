/* eslint-disable */
import { db, getServerTimestamp, validateFirebaseIdToken } from "../firebase/helpers";
const cookieParser = require("cookie-parser")();
const express = require("express");
const cors = require("cors");

const logMachineUsage = express();

logMachineUsage.use(cors({ origin: true }));
logMachineUsage.use(cookieParser);
logMachineUsage.use(validateFirebaseIdToken);

logMachineUsage.post("/", async (req: any, res: any) => {
    try {
        if (req.method !== "POST") {
            res.status(405).send('Method Not Allowed');
            return;
        }

        const userId = req.user.uid;
        const { machineName } = req.body;

        if (!machineName) {
            res.status(400).send("Error: machineName is required.");
            return;
        }

        // Use current server timestamp
        const timestamp = getServerTimestamp();

        // prepare data
        const data = { [machineName]: timestamp }

        // save the data in Firestore
        await db.collection('users').doc(userId).set({
            machineLogs: data
        }, { merge: true })
            .then(() => {
                res.status(200).send("Machine usage has been logged successfully");
            })
            .catch(() => {
                console.error("Error writing document.");
                res.status(500).send("Error writing document.");
            });
    } catch {
        return res.status(401).send({ error: "Couldn't update machineLog" });
    }
});

export { logMachineUsage };
