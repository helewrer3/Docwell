import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Row, Col, Typography, Divider } from "antd";

import { strings, prettify } from "../utils/helper/strings";
import { saveToStorage } from "../utils/helper/localStorage";
import { path } from "../utils/routers/routes";
import { getRequest, postRequest } from "../utils/helper/http";

const { Title } = Typography;
const { Item } = Form;
const { rows } = strings;

const onFinish = async ({ values, navigate, isLogin }) => {
  try {
    if (isLogin) {
      const authPayload = await getRequest({
          url: `auth`,
          params: { ...values },
        }),
        dbPayload = await getRequest({ url: `data/meta` });
      saveToStorage({ name: "name", data: authPayload.name });
      saveToStorage({ name: "token", data: authPayload.token });
      saveToStorage({ name: "database", data: dbPayload });
    } else {
      const _ = await postRequest({ url: `auth`, body: { ...values } });
    }
    navigate(path.entry);
  } catch (error) {
    console.log(error);
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
