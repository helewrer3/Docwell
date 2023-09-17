import React, { useEffect, useState } from "react";
import { Select } from "antd";
import axios from "axios";

import { strings } from "../helper/strings";

const IdSelect = ({ tableName, disabled = false, callback = null }) => {
  const getIdOptions = async ({ name = "" }) => {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/data`,
      {
        params: {
          tableName:
            tableName == strings.tables.visits
              ? strings.tables.patients
              : strings.tables.manufacturers,
          filters: { name },
          replaceWithName: false,
        },
      }
    );
    return (response.data || []).map((ele) => {
      return {
        label: ele.name,
        value:
          tableName == strings.tables.visits
            ? ele[strings.rows.patientID]
            : ele[strings.rows.manufacturerID],
      };
    });
  };

  const [idOptions, setIdOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (idOptions.length === 0) {
        const newOptions = await getIdOptions({ name: "" });
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
