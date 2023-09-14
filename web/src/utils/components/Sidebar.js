import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  SolutionOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { path } from "../routers/routes";

const { Sider } = Layout;

const menuItems = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: <Link to={path.entry}> Dashboard </Link>,
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: <Link to={path.patient}> Patients </Link>,
  },
  {
    key: "3",
    icon: <SolutionOutlined />,
    label: <Link to={path.visit}> Visits </Link>,
  },
  {
    key: "4",
    icon: <MedicineBoxOutlined />,
    label: <Link to={path.medicine}> Medicines </Link>,
  },
  {
    key: "5",
    icon: <CloudUploadOutlined />,
    label: <Link to={path.upload}> Upload Reports </Link>,
  },
  {
    key: "6",
    icon: <DownloadOutlined />,
    label: <Link to={path.backup}> Backup Data </Link>,
  },
];

const Sidebar = ({ selectedKey = "1" }) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(v) => setCollapsed(v)}
    >
      <Menu theme="dark" defaultSelectedKeys={selectedKey} items={menuItems} />
    </Sider>
  );
};

export default Sidebar;
