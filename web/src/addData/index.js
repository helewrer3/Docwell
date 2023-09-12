import React, { useState } from "react";
import { Button, notification } from "antd";
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
      notification.open({
        type: "success",
        message: "Success",
        description:
          "Data added successfully, please refresh the page to reflect the changes.",
      });
    } catch (error) {
      console.log(error);
      notification.open({
        type: "error",
        message: "Error",
        description: "Couldn't add data into database, try again later.",
      });
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
