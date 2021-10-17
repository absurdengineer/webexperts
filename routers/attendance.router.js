const router = require("express").Router();
const AttendanceController = require("../controllers/attendance.controller");

router.get("/report", AttendanceController.getReport);
router.post("/", AttendanceController.markAttendance);

module.exports = router;
