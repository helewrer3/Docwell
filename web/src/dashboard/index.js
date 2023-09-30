import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Layout,
  Row,
  Spin,
  Statistic,
  Avatar,
  Typography,
} from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import Sidebar from "../utils/components/Sidebar";
import { strings } from "../utils/helper/strings";
import {
  deleteFromStorage,
  getFromStorage,
} from "../utils/helper/localStorage";
import { path } from "../utils/routers/routes";
import FilterTable from "../utils/components/FilterTable";
import { delRequest, getRequest, putRequest } from "../utils/helper/http";

const { Content } = Layout;
const { Title } = Typography;

const getStats = async ({ setVisitsWeek, setIsLoading }) => {
  let visCount = 0;
  setIsLoading(true);
  try {
    const currentDate = new Date();
    for (let i = 0; i < 7; i++) {
      const curDate = new Date(currentDate);
      curDate.setDate(currentDate.getDate() - i);
      const payload = await getRequest({
        url: `data/meta/${strings.tables.visits}`,
        params: {
          filters: {
            [strings.rows.dateOfVisit]: moment(curDate).format("YYYY-MM-DD"),
          },
        },
      });
      visCount += payload.rowCount;
    }
  } catch (error) {
    console.log(error);
  }
  setVisitsWeek(visCount);
  setIsLoading(false);
};

const verifyUserSignup = async ({ record }) => {
  try {
    const _ = await putRequest({ url: `auth/${record.name}` });
  } catch (error) {
    console.log(error);
  }
};

const delUserSignup = async ({ record }) => {
  try {
    const _ = await delRequest({ url: `auth/${record.name}` });
  } catch (error) {
    console.log(error);
  }
};

const checkIfAdmin = async ({ setIsAdmin }) => {
  try {
    const user = getFromStorage({ name: "name" });
    const payload = await getRequest({ url: `auth/${user}` });
    setIsAdmin(payload.isAdmin == 0 ? false : true);
  } catch (error) {
    console.log(error);
  }
};

const Dashboard = ({ sidebarKey }) => {
  const [visitsWeek, setVisitsWeek] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const doStuff = async () => {
      await getStats({ setVisitsWeek, setIsLoading });
      await checkIfAdmin({ setIsAdmin });
    };
    doStuff();
  }, []);

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
        <Row gutter={16}>
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
        {isAdmin ? (
          <Row gutter={16}>
            <Col xs={24}>
              <Title level={4}>User Requests</Title>
            </Col>
            <Col xs={24}>
              <FilterTable
                key={"user_accounts"}
                filters={{ is_user: 0 }}
                tableName={"user_accounts"}
                callback={[verifyUserSignup, delUserSignup]}
              />
            </Col>
          </Row>
        ) : (
          <></>
        )}
      </Content>
    </Layout>
  );
};

export default Dashboard;
