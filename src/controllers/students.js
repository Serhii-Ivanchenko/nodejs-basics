import {
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
} from '../services/students.js';
import { createStudent } from '../services/students.js';

import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getStudentsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const students = await getAllStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

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
    throw createHttpError(404, 'Student not found!');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found student with id ${studentId}`,
    data: student,
  });
};

export const createStudentController = async (req, res) => {
  const newStudent = await createStudent(req.body);

  res.status(201).json({
    status: 201,
    message: 'Student successfully created!',
    data: newStudent,
  });
};

export const deleteStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const studentToDelete = await deleteStudent(studentId);

  if (!studentToDelete) {
    next(createHttpError(404, `Student with ${studentId}not found`));
  }

  res.status(204).send();
};

export const upsertStudentController = async (req, res, next) => {
  const { studentId } = req.params;

  const result = await updateStudent(studentId, req.body, { upsert: true });

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status: status,
    message: 'Successfully upserted a student!',
    data: result.student,
  });
};

export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const result = await updateStudent(studentId, req.body);

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successufully patched a student!',
    data: result.student,
  });
};
