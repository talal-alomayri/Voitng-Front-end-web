import { Card, Col, Row, Radio, Button, message, Progress, Space, Typography, Divider } from "antd";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getPoll, submitVote, sendPollResults, type Poll } from "../api/PollApi"; // افترض وجود هذه الدوال

const { Title, Text } = Typography;

function PollDetails() {
  // جلب المعرف الخاص بالاستطلاع من رابط الصفحة
  const pollId = useParams().id;
  // استخدام دالة الترجمة
  const { t } = useTranslation();

  // حالات لتخزين بيانات الاستطلاع وحالة التحميل
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(false);

  // حالات لإدارة خيار التصويت المحدد وحالة الإرسال
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  // حالة لمعرفة ما إذا كان المستخدم قد صوت بالفعل لعرض النتائج
  const [hasVoted, setHasVoted] = useState(false);

  // حالة لزر إرسال النتائج (Integration)
  const [sendingResults, setSendingResults] = useState(false);

  // جلب بيانات الاستطلاع عند تحميل الصفحة أو تغيير المعرف
  useEffect(() => {
    if (pollId) {
      fetchPoll();

      // التحقق من التخزين المحلي لمعرفة ما إذا كان المستخدم قد صوت مسبقاً
      const userVoted = localStorage.getItem(`voted_${pollId}`);
      if (userVoted) setHasVoted(true);
    }
  }, [pollId]);

  // دالة لجلب بيانات الاستطلاع من الخادم
  const fetchPoll = async () => {
    if (!pollId) return;
    setLoading(true);
    try {
      const data = await getPoll(pollId);
      setPoll(data);
    } catch (error) {
      console.error("Error fetching poll:", error);
      message.error(t("message.load_failed"));
    } finally {
      setLoading(false);
    }
  };

  // دالة لإرسال صوت المستخدم
  const handleVoteSubmit = async () => {
    if (!pollId || !selectedOption) return;

    setIsVoting(true);
    try {
      // إرسال التصويت وتحديث البيانات بالنتائج الجديدة
      const updatedPoll = await submitVote(pollId, selectedOption);
      setPoll(updatedPoll);
      setHasVoted(true);
      // حفظ حالة التصويت محلياً
      localStorage.setItem(`voted_${pollId}`, "true");
      message.success(t("message.vote_success"));
    } catch (error) {
      console.error("Error submitting vote:", error);
      message.error(t("message.vote_failed"));
    } finally {
      setIsVoting(false);
    }
  };

  // دالة لإرسال النتائج إلى أنظمة خارجية (مثل البريد أو ClickUp)
  const handleSendIntegration = async () => {
    if (!pollId) return;

    setSendingResults(true);
    try {
      await sendPollResults(pollId);
      message.success(t("message.integration_success"));
    } catch (error) {
      console.error("Error sending results:", error);
      message.error(t("message.integration_failed"));
    } finally {
      setSendingResults(false);
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <Row justify="center" style={{ padding: "14px" }}>
        <Col xs={24} md={16}>
          <Card loading={loading} />
        </Col>
      </Row>
    );
  }

  // عرض رسالة في حال عدم العثور على الاستطلاع
  if (!poll) {
    return (
      <Row justify="center" style={{ padding: "14px" }}>
        <Col xs={24} md={16}>
          <Card>{t("pollNotFound")}</Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" style={{ padding: "14px" }}>
      <Col xs={24} md={16} lg={12}>
        <Card>
          {/* سؤال الاستطلاع */}
          <Title level={3}>{poll.question}</Title>
          <Divider />

          {!hasVoted ? (
            /* واجهة التصويت: تظهر للمستخدم الذي لم يصوت بعد ليختار أحد الخيارات */
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* مجموعة أزرار الاختيار (Radio Group) لعرض الخيارات */}
              <Radio.Group
                onChange={(e) => setSelectedOption(e.target.value)}
                value={selectedOption}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {poll.options.map((option) => (
                    <Radio
                      key={option.id}
                      value={option.id}
                      style={{ fontSize: "16px", padding: "8px 0" }}
                    >
                      {option.text}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>

              {/* زر إرسال التصويت: يتم تعطيله إذا لم يتم اختيار أي خيار */}
              <Button
                type="primary"
                size="large"
                onClick={handleVoteSubmit}
                loading={isVoting}
                disabled={!selectedOption}
                style={{ marginTop: "16px" }}
              >
                {t("button.submitVote")}
              </Button>
            </div>
          ) : (
            /* واجهة النتائج: تظهر للمستخدم بعد إتمام عملية التصويت بنجاح */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* عرض إجمالي عدد الأصوات في الاستطلاع */}
              <Text strong style={{ fontSize: "16px" }}>
                {t("totalVotes")}: {poll.totalVotes}
              </Text>

              {/* حلقة تكرار لعرض كل خيار مع شريط التقدم (Progress Bar) الذي يمثل نسبته */}
              {poll.options.map((option) => {
                // حساب النسبة المئوية لكل خيار
                const percent = poll.totalVotes === 0
                  ? 0
                  : Math.round((option.votesCount / poll.totalVotes) * 100);

                return (
                  <div key={option.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <Text>{option.text}</Text>
                      {/* عرض عدد الأصوات لكل خيار بجانب اسمه */}
                      <Text type="secondary">{option.votesCount} {t("votes")}</Text>
                    </div>
                    {/* شريط التقدم الملون لإظهار النسبة بشكل مرئي */}
                    <Progress percent={percent} status="active" strokeColor="#15514F" />
                  </div>
                );
              })}

              <Divider />

              {/* قسم خاص للمسؤولين أو منشئي الاستطلاع لإرسال النتائج النهائية */}
              <div style={{ textAlign: "center" }}>
                <Text type="secondary" style={{ display: "block", marginBottom: "12px" }}>
                  {t("integrationText")}
                </Text>
                <Button
                  type="dashed"
                  onClick={handleSendIntegration}
                  loading={sendingResults}
                >
                  {t("button.sendResults")}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
}

export default PollDetails;
