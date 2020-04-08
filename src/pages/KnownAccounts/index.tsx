import React from "react";
import { Link } from "react-router-dom";
import { Button, Input, Table, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import BigNumber from "bignumber.js";
import { KnownAccountsContext } from "api/contexts/KnownAccounts";

const { Title } = Typography;

const KnownAccountsPage = () => {
  const { knownAccounts, isLoading } = React.useContext(KnownAccountsContext);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <Title level={3}>{knownAccounts.length} Total Known Accounts</Title>
      <Table
        size="small"
        pagination={false}
        loading={isLoading}
        rowKey={(record) => record.account}
        columns={[
          {
            title: "Balance",
            dataIndex: "balance",
            // @ts-ignore
            defaultSortOrder: "descend",
            // @ts-ignore
            sorter: {
              compare: (a, b) => a.balance - b.balance,
            },
            render: (text: string) => (
              <>{new BigNumber(text).toFormat()} NANO</>
            ),
          },
          {
            title: "Alias",
            dataIndex: "alias",
            filterDropdown: ({
              setSelectedKeys,
              selectedKeys,
              confirm,
              clearFilters,
            }) => (
              <div style={{ padding: 8 }}>
                <Input
                  // @ts-ignore
                  ref={inputRef}
                  placeholder={`Search Alias`}
                  // @ts-ignore
                  value={selectedKeys[0]}
                  onChange={({ target: { value } }) => {
                    setSelectedKeys([value]);
                  }}
                  onPressEnter={confirm}
                  style={{ width: 188, marginBottom: 8, display: "block" }}
                />
                <Button
                  type="primary"
                  onClick={confirm}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90, marginRight: 8 }}
                >
                  Search
                </Button>
                <Button
                  onClick={() => {
                    clearFilters?.();
                    setSelectedKeys([""]);
                  }}
                  size="small"
                  style={{ width: 90 }}
                >
                  Reset
                </Button>
              </div>
            ),
            filterIcon: (filtered) => (
              <SearchOutlined
                style={{ color: filtered ? "#1890ff" : undefined }}
              />
            ),
            onFilter: (value, record) =>
              record["alias"]
                .toString()
                .toLowerCase()
                .includes(String(value).toLowerCase()),
            onFilterDropdownVisibleChange: (visible) => {
              if (visible) {
                setTimeout(() => inputRef?.current?.select());
              }
            },
            // @ts-ignore
            sorter: {
              compare: ({ alias: a }, { alias: b }) => {
                const aLowerCase = a.toLowerCase();
                const bLowerCase = b.toLowerCase();

                if (aLowerCase < bLowerCase) {
                  return -1;
                }
                if (aLowerCase > bLowerCase) {
                  return 1;
                }
                return 0;
              },
            },
            render: (text: string) => (
              <span className="color-important break-word">{text}</span>
            ),
          },
          {
            title: "Account",
            dataIndex: "account",
            render: (text: string) => (
              <>
                <Link
                  to={`/account/${text}`}
                  className="color-normal break-word"
                >
                  {text}
                </Link>
              </>
            ),
          },
        ]}
        dataSource={knownAccounts}
      />
    </>
  );
};

export default KnownAccountsPage;
