import React, { useState } from "react";
import { Button } from "antd";
import axios from "axios";

import ModalForm from "../utils/components/ModalForm";

const AddData = ({ tableName = "" }) => {
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState({});

  const showModal = () => setOpen(true);

  const callback = async (data) => {
    setNewData(data);
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/data`,
        {
          tableName: tableName,
          dataToInsert: data,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ width: "100%", marginBottom: "1em" }}
      >
        Add Entry
      </Button>

      <ModalForm
        initData={newData}
        callback={callback}
        tableName={tableName}
        open={open}
        onCancel={handleCancel}
      />
    </>
  );
};
export default AddData;
