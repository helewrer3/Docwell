import React, { useEffect, useState } from "react";
import { Select } from "antd";

import { strings } from "../helper/strings";
import { getRequest } from "../helper/http";

const getIdOptions = async ({ name = "", tableName }) => {
  try {
    const payload = await getRequest({
      url: `data`,
      params: {
        tableName:
          tableName == strings.tables.visits
            ? strings.tables.patients
            : strings.tables.manufacturers,
        filters: { name },
        replaceWithName: false,
      },
    });

    return (payload || []).map((ele) => {
      return {
        label: ele.name,
        value:
          tableName == strings.tables.visits
            ? ele[strings.rows.patientID]
            : ele[strings.rows.manufacturerID],
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

const IdSelect = ({ tableName, disabled = false, callback = null }) => {
  const [idOptions, setIdOptions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (idOptions.length === 0) {
        const newOptions = await getIdOptions({ name: "", tableName });
        setIdOptions(newOptions);
      }
    };

    fetchData();
  }, []);
  return (
    <Select
      showSearch
      onSelect={(value) => callback(value)}
      disabled={disabled}
      onSearch={async (input) => {
        const newOptions = await getIdOptions({
          name: input,
          tableName,
        });
        setIdOptions(newOptions);
      }}
      placeholder="Enter name of the ID holder"
      filterOption={false}
      options={idOptions}
    />
  );
};

export default IdSelect;
