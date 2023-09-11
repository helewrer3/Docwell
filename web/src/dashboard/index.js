import React, { useEffect, useState } from "react";
import { Button, Card, Col, Layout, Row, Spin, Statistic, Avatar } from "antd";
import axios from "axios";
import moment from "moment";

import Sidebar from "../utils/components/Sidebar";
import { strings } from "../utils/helper/strings";
import { deleteFromStorage } from "../utils/helper/localStorage";
import { useNavigate } from "react-router-dom";
import { path } from "../utils/routers/routes";

const { Content } = Layout;

const getStats = async ({ setVisitsWeek, setIsLoading }) => {
  let visCount = 0;
  setIsLoading(true);
  try {
    const currentDate = new Date();
    for (let i = 0; i < 7; i++) {
      const curDate = new Date(currentDate);
      curDate.setDate(currentDate.getDate() - i);
      const visit = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/data/meta/${strings.tables.visits}`,
        {
          params: {
            filters: {
              [strings.rows.dateOfVisit]: moment(curDate).format("YYYY-MM-DD"),
            },
          },
        }
      );
      visCount += visit.data.rowCount;
    }
  } catch (error) {
    console.log(error);
  }
  setVisitsWeek(visCount);
  setIsLoading(false);
};

const Dashboard = () => {
  const [visitsWeek, setVisitsWeek] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getStats({ setVisitsWeek, setIsLoading });
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar selectedKey="1" />
      <Content
        style={{
          margin: "1em 1em",
          padding: "1em",
          background: "#ffffff",
        }}
      >
        <Row>
          <Col xs={24} sm={6}>
            <Card>
              <Row justify="center">
                <Avatar
                  src={
                    <img
                      src="https://www.svgrepo.com/show/530600/medicine-bottle.svg"
                      alt="avatar"
                    />
                  }
                />
              </Row>
              <Row justify="center">
                <Button
                  type="primary"
                  onClick={() => {
                    deleteFromStorage({ name: "token" });
                    deleteFromStorage({ name: "database" });
                    navigate(path.login);
                  }}
                >
                  Logout
                </Button>
              </Row>
            </Card>
          </Col>
          <Col xs={24} sm={18}>
            <Card>
              {isLoading ? (
                <Spin />
              ) : (
                <>
                  <Statistic
                    title="No. of visits this week"
                    value={visitsWeek}
                  />
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
