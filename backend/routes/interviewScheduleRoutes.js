const express = require('express');
const router = express.Router();
const {
    getCompanyInterviewSchedules,
    saveInterviewSchedule,
    updateInterviewSchedule,
    deleteInterviewSchedule
} = require('../controllers/interviewScheduleController');
const { protectCompany } = require('../middleware/C_authMiddleware');

router.get('/company', protectCompany, getCompanyInterviewSchedules);
router.post('/', protectCompany, saveInterviewSchedule);
router.put('/:id', protectCompany, updateInterviewSchedule);
router.delete('/:id', protectCompany, deleteInterviewSchedule);

module.exports = router;