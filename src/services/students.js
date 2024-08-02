import { StudentsCollection } from '../db/models/student.js';

export const getAllStudents = async () => {
  const students = await StudentsCollection.find();
  return students;
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
