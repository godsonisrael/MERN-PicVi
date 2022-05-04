import express from "express"
import { signup, login } from "../controllers/user.js"

const router = express.Router();

router.post('/login', login)
router.post('/signup', signup)

export default router