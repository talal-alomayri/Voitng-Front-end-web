import { Table, Typography, Button, message, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CopyOutlined, BarChartOutlined } from "@ant-design/icons";
import { listPolls, type Poll } from "../api/ticketApi"; // تأكد من مسار الاستيراد
import type { ColumnsType } from "antd/es/table";

const { Link } = Typography;

function PollList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const data = await listPolls();
      setPolls(data);
    } catch (error) {
      console.error("Error fetching polls:", error);
      message.error(t("message.load_failed", "Failed to load polls"));
    } finally {
      setLoading(false);
    }
  };

  // دالة لنسخ رابط التصويت
  const copyVotingLink = (pollId: string) => {
    const url = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(url)
      .then(() => message.success(t("message.link_copied", "Link copied to clipboard!")))
      .catch(() => message.error(t("message.copy_failed", "Failed to copy link")));
  };

  const columns: ColumnsType<Poll> = [
    {
      title: t("table.question", "Question"),
      dataIndex: "question",
      key: "question",
      render: (question: string, record: Poll) => (
        <Link
          onClick={() => navigate(`/poll/${record.id}`)}
          style={{ cursor: "pointer", fontWeight: 500 }}
        >
          {question}
        </Link>
      ),
    },
    {
      title: t("table.totalVotes", "Total Votes"),
      dataIndex: "totalVotes",
      key: "totalVotes",
      align: "center",
      render: (total: number) => total || 0,
    },
    {
      title: t("table.createdAt", "Created At"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => date ? new Date(date).toLocaleString() : "-",
    },
    {
      title: t("table.actions", "Actions"),
      key: "actions",
      render: (_, record: Poll) => (
        <Space>
          <Button 
            type="text" 
            icon={<CopyOutlined />} 
            onClick={() => copyVotingLink(record.id)}
            title={t("button.copyLink", "Copy Link")}
          />
          <Button 
            type="primary" 
            ghost
            size="small"
            icon={<BarChartOutlined />} 
            onClick={() => navigate(`/poll/${record.id}`)}
          >
            {t("button.viewResults", "Results")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ margin: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <Typography.Title level={4}>
          {t("pollsList", "My Polls")}
        </Typography.Title>
        <Button type="primary" onClick={() => navigate("/create")}>
          {t("button.createNewPoll", "Create New Poll")}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={polls}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
}

export default PollList;
