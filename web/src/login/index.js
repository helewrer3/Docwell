import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Divider,
  notification,
} from "antd";
import axios from "axios";

import { strings, prettify } from "../utils/helper/strings";
import { saveToStorage } from "../utils/helper/localStorage";
import { path } from "../utils/routers/routes";

const { Title } = Typography;
const { Item } = Form;
const { rows } = strings;

const onFinish = async ({ values, navigate, isLogin }) => {
  try {
    let msg = "";
    if (isLogin) {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/`, {
        params: {
          ...values,
        },
      });
      saveToStorage({ name: "token", data: res.data.token });
      saveToStorage({ name: "name", data: res.data.name });

      const resMeta = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/data/meta`
      );
      saveToStorage({ name: "database", data: resMeta.data });
      msg = "User successfully logged in.";
    } else {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/`, {
        ...values,
      });
      msg = "Please wait for the admins to approve your request.";
    }
    navigate(path.entry);
    notification.open({
      type: "success",
      message: "Welcome!",
      description: msg,
    });
  } catch (error) {
    console.log(error);
    notification.open({
      type: "error",
      message: "Error",
      description: "There was an error logging you in, try again later.",
    });
  }
};

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <Row
      typeof="flex"
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", minWidth: "100vw" }}
    >
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Title level={2}>{isLogin ? "Login" : "Register"}</Title>
          <Form
            name="login"
            onFinish={(values) => onFinish({ values, navigate, isLogin })}
          >
            <Item
              label={prettify[rows.name]}
              name={rows.name}
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Item>
            <Item
              label={prettify[rows.password]}
              name={rows.password}
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                () => ({
                  validator(_, value) {
                    if (value.length >= 8) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Password should be atleast 8 characters long.")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Item>
            {isLogin ? (
              ""
            ) : (
              <Item
                name="confirm"
                label="Confirm Password"
                dependencies={[rows.password]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Item>
            )}
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Submit
              </Button>
            </Item>
            <Divider />
            <Item>
              <Button
                type="default"
                onClick={() => setIsLogin(!isLogin)}
                style={{ width: "100%" }}
              >
                {isLogin ? "Register ?" : "Login ?"}
              </Button>
            </Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
