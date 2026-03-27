const express = require('express');
const {
  createCompany,
  createInternship,
  createPayment,
  createStudent,
  deleteCompany,
  deleteInternship,
  deletePayment,
  deleteStudent,
  getCompanies,
  getInternships,
  getPayments,
  getStudents,
  updateCompany,
  updateInternship,
  updatePayment,
  updateStudent,
} = require('../controllers/adminResourceController');
const { allowAdminRoles, protectAdmin } = require('../middleware/adminAuthMiddleware');

const router = express.Router();

router.route('/companies')
  .get(protectAdmin, allowAdminRoles('Super Admin', 'Company Manager'), getCompanies)
  .post(protectAdmin, allowAdminRoles('Super Admin', 'Company Manager'), createCompany);

router.route('/companies/:id')
  .put(protectAdmin, allowAdminRoles('Super Admin', 'Company Manager'), updateCompany)
  .delete(protectAdmin, allowAdminRoles('Super Admin', 'Company Manager'), deleteCompany);

router.route('/students')
  .get(protectAdmin, allowAdminRoles('Super Admin', 'Student Manager'), getStudents)
  .post(protectAdmin, allowAdminRoles('Super Admin', 'Student Manager'), createStudent);

router.route('/students/:id')
  .put(protectAdmin, allowAdminRoles('Super Admin', 'Student Manager'), updateStudent)
  .delete(protectAdmin, allowAdminRoles('Super Admin', 'Student Manager'), deleteStudent);

router.route('/internships')
  .get(protectAdmin, allowAdminRoles('Super Admin', 'Internship Manager'), getInternships)
  .post(protectAdmin, allowAdminRoles('Super Admin', 'Internship Manager'), createInternship);

router.route('/internships/:id')
  .put(protectAdmin, allowAdminRoles('Super Admin', 'Internship Manager'), updateInternship)
  .delete(protectAdmin, allowAdminRoles('Super Admin', 'Internship Manager'), deleteInternship);

router.route('/payments')
  .get(protectAdmin, allowAdminRoles('Super Admin', 'Payment Manager'), getPayments)
  .post(protectAdmin, allowAdminRoles('Super Admin', 'Payment Manager'), createPayment);

router.route('/payments/:id')
  .put(protectAdmin, allowAdminRoles('Super Admin', 'Payment Manager'), updatePayment)
  .delete(protectAdmin, allowAdminRoles('Super Admin', 'Payment Manager'), deletePayment);

module.exports = router;
