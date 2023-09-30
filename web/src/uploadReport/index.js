import React from "react";
import { Button, Col, Layout, Row, Upload, Form, InputNumber } from "antd";
import { InboxOutlined } from "@ant-design/icons";

import Sidebar from "../utils/components/Sidebar";
import { prettify, strings } from "../utils/helper/strings";
import { postRequest } from "../utils/helper/http";

const { Content } = Layout;
const { Dragger } = Upload;
const { Item } = Form;

const props = {
  name: "fileUpload",
  multiple: true,
  listType: "picture-card",
  customRequest({ onSuccess }) {
    onSuccess();
  },
};

const onFinish = async (values) => {
  const { upload, visit_id } = values;
  const formData = new FormData();
  for (let index = 0; index < upload.length; index++)
    formData.append("image", upload[index]);
  try {
    const _ = await postRequest({
      url: `azure/storage/${visit_id}`,
      body: formData,
    });
  } catch (error) {
    console.log(error);
  }
};

const UploadReport = ({ sidebarKey }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar selectedKey={sidebarKey} />
      <Content
        style={{
          margin: "1em 1em",
          padding: "1em 1em",
          background: "#ffffff",
        }}
      >
        <Form name="upload-report" onFinish={onFinish}>
          <Row>
            <Col xs={24}>
              <Item
                name="upload"
                getValueFromEvent={({ fileList }) => {
                  const newList = fileList.map((file) => file.originFileObj);
                  return newList;
                }}
                required={true}
              >
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Please select either a .jpg/.png
                  </p>
                </Dragger>
              </Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col xs={24} sm={12}>
              <Item
                label={prettify[strings.rows.visitID]}
                name={strings.rows.visitID}
                required={true}
              >
                <InputNumber
                  allowClear={true}
                  required={true}
                  style={{ width: "100%" }}
                />
              </Item>
            </Col>
            <Col xs={24} sm={12}>
              <Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Submit
                </Button>
              </Item>
            </Col>
          </Row>
        </Form>
      </Content>
    </Layout>
  );
};

export default UploadReport;
