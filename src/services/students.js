import { SORT_ORDER } from '../constants/index.js';
import { StudentsCollection } from '../db/models/student.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllStudents = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();
  const studentsCount = await StudentsCollection.find()
    .merge(studentsQuery)
    .countDocuments();

  const students = await studentsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(studentsCount, perPage, page);
  return {
    data: students,
    ...paginationData,
  };
};

export const getStudentById = async (studentId) => {
  const student = await StudentsCollection.findById(studentId);
  return student;
};

export const createStudent = async (payload) => {
  const newStudent = await StudentsCollection.create(payload);
  return newStudent;
};

export const deleteStudent = async (studentId) => {
  const studentToDelete = await StudentsCollection.findOneAndDelete({
    _id: studentId,
  });
  return studentToDelete;
};

export const updateStudent = async (studentId, payload, options = {}) => {
  const studentToUpdate = await StudentsCollection.findOneAndUpdate(
    {
      _id: studentId,
    },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!studentToUpdate || !studentToUpdate.value) {
    return null;
  }

  return {
    student: studentToUpdate.value,
    isNew: Boolean(studentToUpdate?.lastErrorObject?.upserted),
  };
};
