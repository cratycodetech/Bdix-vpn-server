import { Router } from "express";
import {
    getAllGuestUser,
    createGuestUser, 
} from "../controller/guestUser.controller";

const router = Router();

// get all Guest User
router.get('/all', getAllGuestUser);

// create new Guest User
router.post("/create", createGuestUser);


export default router;
