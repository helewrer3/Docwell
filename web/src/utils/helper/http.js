import { notification } from "antd";
import axios from "axios";

notification.config({
  placement: "topRight",
  duration: 3,
  maxCount: 5,
});

const getRequest = async ({ url, params = {} }) => {
  notification.open({
    description: "Processing your request, please wait for the response.",
    type: "info",
  });
  try {
    const { message, payload = {} } = (
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/${url}`, {
        params,
      })
    ).data;
    notification.open({
      description: message,
      type: "success",
    });
    return payload;
  } catch (error) {
    notification.open({
      description:
        error.response.data.message || "Error sending request, try again later",
      type: "error",
    });
    throw error;
  }
};

const postRequest = async ({ url, body = {}, config = {} }) => {
  notification.open({
    description: "Processing your request, please wait for the response.",
    type: "info",
  });
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/${url}`,
      body,
      config
    );
    if (response.data === "object") {
      const { message, payload = {} } = response.data;
      notification.open({
        description: message,
        type: "success",
      });
      return payload;
    } else {
      notification.open({
        description: "Data received!",
        type: "success",
      });
      return response.data;
    }
  } catch (error) {
    notification.open({
      description:
        error.response?.data?.message ||
        "Error sending request, try again later",
      type: "error",
    });
    throw error;
  }
};

const putRequest = async ({ url, body = {} }) => {
  notification.open({
    description: "Processing your request, please wait for the response.",
    type: "info",
  });
  try {
    const { message, payload = {} } = (
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/${url}`, body)
    ).data;
    notification.open({
      description: message,
      type: "success",
    });
    return payload;
  } catch (error) {
    notification.open({
      description:
        error.response.data.message || "Error sending request, try again later",
      type: "error",
    });
    throw error;
  }
};

const delRequest = async ({ url, params = {} }) => {
  notification.open({
    description: "Processing your request, please wait for the response.",
    type: "info",
  });
  try {
    const { message, payload = {} } = (
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/${url}`, {
        params,
      })
    ).data;
    notification.open({
      description: message,
      type: "success",
    });
    return payload;
  } catch (error) {
    notification.open({
      description:
        error.response.data.message || "Error sending request, try again later",
      type: "error",
    });
    throw error;
  }
};

export { getRequest, postRequest, putRequest, delRequest };
