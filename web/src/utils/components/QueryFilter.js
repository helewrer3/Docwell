import React from "react";
import { Form, Input, Row, Col, DatePicker, Button, InputNumber } from "antd";

import { prettify } from "../helper/strings";
import { getFromStorage } from "../helper/localStorage";

const { Item } = Form;

const QueryFilter = ({ callback = null, tableName = "" }) => {
  const onFinish = (values) => {
    callback(values);
  };

  const rows = getFromStorage({ name: "database" })[tableName];

  return (
    <Form name="data-filter" onFinish={onFinish}>
      <Row justify="space-around">
        {rows.map((column) => (
          <Col xs={24} md={12} lg={8} xl={4}>
            <Item
              label={prettify[column.COLUMN_NAME]}
              name={column.COLUMN_NAME}
            >
              {
                {
                  varchar: <Input allowClear={true} />,
                  date: <DatePicker allowClear={true} />,
                  bigint: <InputNumber allowClear={true} />,
                  smallint: <InputNumber allowClear={true} />,
                }[column.DATA_TYPE]
              }
            </Item>
          </Col>
        ))}
        <Col>
          <Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Item>
        </Col>
      </Row>
    </Form>
  );
};

export default QueryFilter;
