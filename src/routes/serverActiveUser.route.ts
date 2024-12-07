import { Router } from "express";
import {
    getActiveServerUsers,
    getAllServersWithActiveUserCount
} from "../controller/serverActiveUser.controller";

const router = Router();

// get all active user in server
router.get('/all', getActiveServerUsers);

// Route to get all servers with active user count
router.get('/servers/active-user-count', getAllServersWithActiveUserCount);

export default router;