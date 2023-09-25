import React, { useState } from "react";
import { Layout, Row, Col } from "antd";

import Sidebar from "../utils/components/Sidebar";
import QueryFilter from "../utils/components/QueryFilter";
import FilterTable from "../utils/components/FilterTable";
import AddData from "../addData";
import { getFromStorage } from "../utils/helper/localStorage";

const { Content } = Layout;

const initFilters = (tableName) => {
  const filters = {};
  const rows = getFromStorage({ name: "database" })[tableName];
  rows.forEach((val) => (filters[val.COLUMN_NAME] = ""));
  return filters;
};

const mergeFilters = (prevFilters, val) => {
  const res = { ...prevFilters };
  for (const key in val) {
    if (key in res && val[key] != undefined) {
      res[key] = val[key];
    }
  }
  return res;
};

const FilterPage = ({ tableName = "", sidebarKey = "" }) => {
  const [filters, setFilters] = useState(initFilters(tableName));

  const callback = (val) => {
    setFilters((prevFiltes) => mergeFilters(prevFiltes, val));
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar selectedKey={sidebarKey} />
      <Content
        style={{
          margin: "1em 1em 1em 1em",
          padding: "1em",
          background: "#ffffff",
        }}
      >
        <Row justify="end">
          <Col xs={24} sm={6} md={4} lg={3} xl={2}>
            <AddData tableName={tableName} key={tableName} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <QueryFilter
              key={tableName}
              callback={callback}
              tableName={tableName}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FilterTable
              key={tableName}
              filters={filters}
              tableName={tableName}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default FilterPage;
