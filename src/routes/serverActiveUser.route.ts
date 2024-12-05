import { Router } from "express";
import {
    getActiveServerUsers
} from "../controller/serverActiveUser.controller";

const router = Router();

// get all active user in server
router.get('/all', getActiveServerUsers);

export default router;