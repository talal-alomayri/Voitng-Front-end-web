import { Table, Typography, Button, message, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CopyOutlined, BarChartOutlined } from "@ant-design/icons";
import { listPolls, type Poll } from "../api/PollApi"; // تأكد من مسار الاستيراد
import type { ColumnsType } from "antd/es/table";

const { Link } = Typography;

function PollList() {
  // استخدام دالة الترجمة
  const { t } = useTranslation();
  const navigate = useNavigate();
  // حالة لحفظ قائمة الاستطلاعات
  const [polls, setPolls] = useState<Poll[]>([]);
  // حالة التحميل
  const [loading, setLoading] = useState(false);

  // جلب الاستطلاعات عند تحميل المكون
  useEffect(() => {
    fetchPolls();
  }, []);

  // دالة لجلب قائمة الاستطلاعات من الخادم
  const fetchPolls = async () => {
    setLoading(true);
    try {
      const data = await listPolls();
      setPolls(data);
    } catch (error) {
      console.error("Error fetching polls:", error);
      message.error(t("message.load_failed"));
    } finally {
      setLoading(false);
    }
  };

  // دالة لنسخ رابط الاستطلاع إلى الحافظة
  const copyVotingLink = (pollId: string) => {
    const url = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(url)
      .then(() => message.success(t("message.link_copied")))
      .catch(() => message.error(t("message.copy_failed")));
  };

  // إعداد أعمدة الجدول لعرض بيانات الاستطلاعات
  const columns: ColumnsType<Poll> = [
    {
      title: t("table.question"), // عنوان العمود (السؤال)
      dataIndex: "question",
      key: "question",
      // تخصيص عرض خلية السؤال لتكون رابطاً قابلاً للضغط
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
      title: t("table.totalVotes"), // عنوان العمود (إجمالي الأصوات)
      dataIndex: "totalVotes",
      key: "totalVotes",
      align: "center", // محاذاة النص في المنتصف
      render: (total: number) => total || 0, // عرض 0 إذا كانت البيانات فارغة
    },
    {
      title: t("table.createdAt"), // عنوان العمود (تاريخ الإنشاء)
      dataIndex: "createdAt",
      key: "createdAt",
      // تحويل تاريخ الـ API (نص) إلى صيغة محلية سهلة القراءة
      render: (date: string) => date ? new Date(date).toLocaleString() : "-",
    },
    {
      title: t("table.actions"), // عنوان العمود (الإجراءات)
      key: "actions",
      // تخصيص الأزرار التي تظهر في كل صف
      render: (_, record: Poll) => (
        <Space>
          {/* زر نسخ رابط الاستطلاع لمشاركته مع الآخرين */}
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copyVotingLink(record.id)}
            title={t("button.copyLink")}
          />
          {/* زر عرض النتائج للانتقال لصفحة تفاصيل الاستطلاع */}
          <Button
            type="primary"
            ghost
            size="small"
            icon={<BarChartOutlined />}
            onClick={() => navigate(`/poll/${record.id}`)}
          >
            {t("button.viewResults")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ margin: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        {/* عنوان الصفحة */}
        <Typography.Title level={4}>
          {t("pollsList")}
        </Typography.Title>
        {/* زر لإنشاء استطلاع جديد */}
        <Button type="primary" onClick={() => navigate("/create")}>
          {t("button.createNewPoll")}
        </Button>
      </div>

      {/* جدول عرض البيانات */}
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
