import { strings } from "./strings";

const { rows, types, tables } = strings;

const tableDefinitions = {
  [tables.visits]: [
    {
      name: rows.visitID,
      type: types.number,
    },
    {
      name: rows.patientID,
      type: types.number,
    },
    {
      name: rows.dateOfVisit,
      type: types.date,
    },
    {
      name: rows.reportsURL,
      type: types.string,
    },
    {
      name: rows.advice,
      type: types.textArea,
    },
  ],
  [tables.medicines]: [
    {
      name: rows.medicineID,
      type: types.number,
    },
    {
      name: rows.name,
      type: types.string,
    },
    {
      name: rows.manufacturerID,
      type: types.number,
    },
    {
      name: rows.saltName1,
      type: types.string,
    },
    {
      name: rows.saltName2,
      type: types.string,
    },
  ],
  [tables.patients]: [
    {
      name: rows.patientID,
      type: types.number,
    },
    {
      name: rows.name,
      type: types.string,
    },
    {
      name: rows.phoneNumber,
      type: types.number,
    },
    {
      name: rows.dateOfBirth,
      type: types.date,
    },
    {
      name: rows.sex,
      type: types.string,
    },
  ],
};

export { tableDefinitions };
