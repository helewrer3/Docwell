import React from "react";
import { Button, Layout, Row, Col, notification } from "antd";

import Sidebar from "../utils/components/Sidebar";
import { strings } from "../utils/helper/strings";
import { postRequest } from "../utils/helper/http";

const { Content } = Layout;

const handleClick = async () => {
  try {
    const payload = await postRequest({
      url: `data/backup`,
      body: {
        tables: [
          strings.tables.users,
          strings.tables.prescriptions,
          strings.tables.patients,
          strings.tables.visits,
        ],
      },
      config: {
        responseType: "blob",
      },
    });
    const blob = new Blob([payload], { type: "application/zip" }),
      url = window.URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "exported_data.zip";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Row>
          <Col xs={24}>
            <Button
              type="primary"
              style={{ width: "100%", height: "50px" }}
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
