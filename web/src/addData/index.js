import React, { useState } from "react";
import { Button } from "antd";

import ModalForm from "../utils/components/ModalForm";
import { postRequest } from "../utils/helper/http";

const AddData = ({ tableName = "" }) => {
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState({});

  const showModal = () => setOpen(true);

  const callback = async (data) => {
    setNewData(data);
    try {
      const _ = await postRequest({
        url: `data`,
        body: {
          tableName: tableName,
          dataToInsert: data,
        },
        config: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
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
        key={tableName}
        onCancel={handleCancel}
      />
    </>
  );
};
export default AddData;
