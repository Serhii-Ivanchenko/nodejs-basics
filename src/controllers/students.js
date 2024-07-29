import { getAllStudents, getStudentById } from '../services/students.js';

export const getStudentsController = async (req, res) => {
  const students = await getAllStudents();

  res.status(200).json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
};

export const getStudentByIdController = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);

  if (!student) {
    next(new Error('Student not found!'));
    return;
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found student with id ${studentId}`,
    data: student,
  });
};
