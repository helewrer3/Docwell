import React, { useEffect, useState } from "react";
import { Table, notification } from "antd";
import axios from "axios";
import moment from "moment";

import { prettify, strings } from "../helper/strings";
import { getFromStorage } from "../helper/localStorage";

const columns = ({ tableName }) => {
  const rows = getFromStorage({ name: "database" })[tableName];
  return rows.map((column) => ({
    title: prettify[column.COLUMN_NAME],
    dataIndex: column.COLUMN_NAME,
    key: column.COLUMN_NAME,
  }));
};

// TODO: Fetch data from DB
const getTableMeta = async ({ tableName, filters, setTotalPage }) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/data/meta/${tableName}`,
      {
        params: { filters },
      }
    );
    setTotalPage(res.data.rowCount);
    notification.open({
      message: "Table Initialized",
      description: "Table initialized successfully!",
      type: "success",
    });
  } catch (error) {
    console.log(error);
    notification.open({
      message: "Error",
      description: "Error initializing table, try again later.",
      type: "error",
    });
  }
};

const getTableData = async ({
  tableName,
  filters,
  size = 20,
  page = 1,
  setDataSource,
  setIsLoading,
}) => {
  setIsLoading(true);
  try {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/data`, {
      params: {
        tableName,
        filters,
        page,
        size,
      },
    });
    res.data.forEach((row, i) => {
      res.data[i][strings.rows.dateOfBirth] = moment(
        row[strings.rows.dateOfBirth]
      )
        .utc()
        .format("YYYY-MM-DD");
    });
    setDataSource(res.data);
  } catch (error) {
    console.log(error);
    notification.open({
      message: "Error",
      description: "Error getting the data, try again later.",
      type: "error",
    });
  }
  setIsLoading(false);
};

const FilterTable = ({ filters = {}, tableName = "" }) => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    getTableMeta({ tableName, filters, setTotalPage });
    getTableData({
      tableName,
      filters,
      setDataSource,
      setIsLoading,
    });
  }, [filters, tableName]);

  return (
    <>
      <Table
        dataSource={dataSource}
        loading={isLoading}
        columns={columns({ tableName })}
        onChange={async (pagination) => {
          await getTableData({
            tableName,
            filters,
            setDataSource,
            setIsLoading,
            page: pagination.current,
            size: pagination.pageSize,
          });
        }}
        pagination={{
          total: totalPage,
          defaultPageSize: 20,
        }}
      />
    </>
  );
};

export default FilterTable;
