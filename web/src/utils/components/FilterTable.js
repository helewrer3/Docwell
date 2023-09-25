import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import moment from "moment";

import { prettify, strings } from "../helper/strings";
import { getFromStorage } from "../helper/localStorage";
import { getRequest } from "../helper/http";

const columns = ({ tableName, callback = null }) => {
  const rows = getFromStorage({ name: "database" })[tableName];
  let tableColumns = rows.map((column) =>
    prettify[column.COLUMN_NAME] == undefined
      ? {}
      : {
          title: prettify[column.COLUMN_NAME],
          dataIndex: column.COLUMN_NAME,
          key: column.COLUMN_NAME,
        }
  );
  if (callback != null)
    tableColumns.push({
      render: (_, record) => (
        <>
          {callback.forEach((fn, i) => (
            <Button type="primary" onClick={() => fn({ record })}>
              {i ? <p>Approve</p> : <p>Decline</p>}
            </Button>
          ))}
        </>
      ),
    });
  return tableColumns;
};

const getTableMeta = async ({ tableName, filters, setTotalPage }) => {
  try {
    const payload = getRequest({
      url: `data/meta/${tableName}`,
      params: { filters },
    });
    setTotalPage(payload.rowCount);
  } catch (error) {
    console.log(error);
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
    const payload = await getRequest({
      url: `data`,
      params: {
        tableName,
        filters,
        page,
        size,
      },
    });
    payload.forEach((row, i) => {
      payload[i][strings.rows.dateOfBirth] = moment(
        row[strings.rows.dateOfBirth]
      )
        .utc()
        .format("YYYY-MM-DD");
      payload[i][strings.rows.dateOfVisit] = moment(
        row[strings.rows.dateOfVisit]
      )
        .utc()
        .format("YYYY-MM-DD");
    });
    setDataSource(payload);
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

const FilterTable = ({ filters = {}, tableName = "", callback = null }) => {
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
        columns={columns({ tableName, callback })}
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
        style={{
          "text-overflow": "ellipsis",
          overflow: "hidden",
          "white-space": "nowrap",
        }}
      />
    </>
  );
};

export default FilterTable;
