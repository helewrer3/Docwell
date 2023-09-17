import React, { useState } from "react";
import { Modal, Form, Input, Row, Col, DatePicker, Button, Select } from "antd";
import moment from "moment";

import { prettify, strings } from "../helper/strings";
import { getFromStorage } from "../helper/localStorage";
import IdSelect from "./IdSelect";
const { Item } = Form;

const ModalForm = ({
  initData = {},
  callback = null,
  tableName,
  open,
  onCancel,
}) => {
  const onFinish = (values) => {
    values[
      tableName == strings.tables.visits
        ? strings.rows.patientID
        : strings.rows.manufacturerID
    ] = selectedId;
    rows.forEach((column) => {
      if (values[column.COLUMN_NAME]) {
        if (column.DATA_TYPE === "date")
          values[column.COLUMN_NAME] = moment(
            values[column.COLUMN_NAME]
          ).format("YYYY-MM-DD");
        else if (column.DATA_TYPE === "varchar")
          values[column.COLUMN_NAME] = values[column.COLUMN_NAME]
            .split(/[\s\-_]+/)
            .map((word) => {
              return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
      }
    });
    callback(values);
  };

  const handleSelect = (value) => {
    setSelectedId(value);
  };

  const rows = getFromStorage({ name: "database" })[tableName];
  const [selectedId, setSelectedId] = useState(0);

  return (
    <Modal
      title={prettify[tableName]}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button form="data-add" type="primary" htmlType="submit">
          Submit
        </Button>,
      ]}
    >
      <Form name="data-add" onFinish={onFinish}>
        <Row justify="space-around">
          {rows.map((column, i) => (
            <Col xs={24}>
              <Item
                label={prettify[column.COLUMN_NAME]}
                name={column.COLUMN_NAME}
                required={true}
              >
                {
                  {
                    varchar:
                      column.COLUMN_NAME != strings.rows.sex ? (
                        <Input
                          allowClear={true}
                          defaultValue={initData[column.COLUMN_NAME]}
                        />
                      ) : (
                        <Select
                          options={[
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                            { label: "Other", value: "other" },
                          ]}
                        />
                      ),
                    date: (
                      <DatePicker
                        allowClear={true}
                        defaultValue={initData[column.COLUMN_NAME]}
                      />
                    ),
                    bigint: (
                      <IdSelect
                        tableName={tableName}
                        disabled={i == 0}
                        callback={handleSelect}
                      />
                    ),
                  }[column.DATA_TYPE]
                }
              </Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalForm;
