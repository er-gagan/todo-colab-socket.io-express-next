// routes/authRoutes.js

const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/get-all-regular-teamlead-users', auth, userController.getAllRegularAndTeamLeadUsers);
router.get('/get-all-regular-users', auth, userController.getAllRegularUsers);
router.post('/assign-regular-users', auth, userController.assignRegularUsersUnderTeamLead);
router.post('/get-all-assigned-users', auth, userController.getAllAssignedUserUnderTeamLeader);
router.get('/get-all-team-leaders-under-regular-user', auth, userController.getAllTeamLeadersUnderRegularUser);
router.get('/get-all-team-leaders-and-regular-member-users-under-regular-user', auth, userController.getAllTeamLeadersAndRegularMemberUsersUnderRegularUser);
router.get('/get-all-regular-users-under-team-leader', auth, userController.getAllRegularUsersUnderTeamLead);
router.get('/', auth, userController.getAllUsers);
router.delete('/:id', auth, userController.deleteUser);
router.get('/:id', auth, userController.getSingleUserDetails);
module.exports = router;
