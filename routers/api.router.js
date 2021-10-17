const router = require("express").Router();
const AuthRouter = require("../routers/auth.router");
const AttendanceRouter = require("../routers/attendance.router");
const authMiddleware = require("../middlewares/auth.middleware");

router.use("/auth", AuthRouter);
router.use("/attendances", [authMiddleware, AttendanceRouter]);

module.exports = router;
