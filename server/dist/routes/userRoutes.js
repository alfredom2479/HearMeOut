import { Router } from "express";
const router = Router();
import { checkAndRefresh, protect } from "../middleware/authMiddleware.js";
import { createUser, loginUser, logoutUser, getMe, getNewToken } from "../controllers/userController.js";
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getMe);
router.get("/refresh_token", checkAndRefresh, getNewToken);
export default router;
//# sourceMappingURL=userRoutes.js.map