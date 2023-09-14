import React from "react";
import { Button, Layout, Row, Col, notification } from "antd";
import axios from "axios";

import Sidebar from "../utils/components/Sidebar";
import { strings } from "../utils/helper/strings";

const { Content } = Layout;

const handleClick = async () => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/data/backup`,
      {
        tables: [
          strings.tables.users,
          strings.tables.prescriptions,
          strings.tables.patients,
          strings.tables.visits,
        ],
      },
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/zip" }),
      url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "exported_data.zip";
    a.click();

    window.URL.revokeObjectURL(url);

    notification.open({
      type: "success",
      message: "Data Extraced!",
      description: "Please wait while your files download.",
    });
  } catch (error) {
    notification.open({
      type: "error",
      message: "Error extracting data!",
      description: "There was some error in the process, try again later.",
    });
  }
};

const BackupData = ({ sidebarKey }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar selectedKey={sidebarKey} />
      <Content
        style={{
          margin: "1em 1em",
          padding: "1em",
          background: "#ffffff",
        }}
      >
        <Row>
          <Col xs={24}>
            <Button
              type="primary"
              style={{ width: "100%" }}
              onClick={handleClick}
            >
              Backup Data
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default BackupData;
