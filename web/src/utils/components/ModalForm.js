import React from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Button,
  InputNumber,
} from "antd";
import moment from "moment";

import { prettify } from "../helper/strings";
import { getFromStorage } from "../helper/localStorage";

const { Item } = Form;

const ModalForm = ({
  initData = {},
  callback = null,
  tableName,
  open,
  onCancel,
}) => {
  const onFinish = (values) => {
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
  const rows = getFromStorage({ name: "database" })[tableName];

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
              >
                {
                  {
                    varchar: (
                      <Input
                        allowClear={true}
                        defaultValue={initData[column.COLUMN_NAME]}
                        required={true}
                      />
                    ),
                    date: (
                      <DatePicker
                        allowClear={true}
                        defaultValue={initData[column.COLUMN_NAME]}
                        required={true}
                      />
                    ),
                    bigint: (
                      <InputNumber
                        allowClear={true}
                        disabled={i === 0}
                        defaultValue={initData[column.COLUMN_NAME]}
                        required={true}
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
