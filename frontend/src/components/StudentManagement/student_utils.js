import axios from 'axios';

const STUDENT_API_URL = 'http://localhost:5000/api/students';
const STUDENT_SESSION_KEY = 'stepin_student_session';

export const loginStudent = async (email, password) => {
  const response = await axios.post(`${STUDENT_API_URL}/login`, { email, password });
  const student = response.data?.student || response.data?.data || response.data;
  const session = {
    token: response.data?.token || '',
    student,
  };

  localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(session));
  return session;
};

export const getStudentSession = () => {
  const session = localStorage.getItem(STUDENT_SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

export const isStudentLoggedIn = () => Boolean(getStudentSession()?.token);

export const logoutStudent = () => {
  localStorage.removeItem(STUDENT_SESSION_KEY);
};
