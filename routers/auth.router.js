const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/users/me", [authMiddleware, AuthController.getProfile]);
router.post("/users/me/deactivate", [
  authMiddleware,
  AuthController.deleteProfile,
]);

module.exports = router;
