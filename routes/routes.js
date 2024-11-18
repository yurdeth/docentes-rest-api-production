import Router from "express";
import {
    getAllUsers,
    getUserById,
    verifyUser,
    init,
    enableUser,
    getUserByMail, verifyEmail, getAllEmails, disableUser
} from "../controllers/UsersController.js";
import {apiKeyMiddleware} from "../middleware/apiKeyMiddleware.js";

const router = Router();

router.get("/users", apiKeyMiddleware, getAllUsers);
router.get("/getMails", apiKeyMiddleware, getAllEmails);
router.get("/users/:id", apiKeyMiddleware, getUserById);
router.get("/findByMail", apiKeyMiddleware, getUserByMail);
router.get("/verifyUser", apiKeyMiddleware, verifyUser);
router.get("/verifyEmail", apiKeyMiddleware, verifyEmail);
router.put("/enableUser/:id", apiKeyMiddleware, enableUser);
router.put("/disableUser/:id", apiKeyMiddleware, disableUser);
router.get("/init", init);

export default router;
