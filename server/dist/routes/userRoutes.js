import { Router } from "express";
const router = Router();
import { createUser, loginUser, logoutUser, getMe } from "../controllers/userController.js";
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", getMe);
export default router;
//# sourceMappingURL=userRoutes.js.map