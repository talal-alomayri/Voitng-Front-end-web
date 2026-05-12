import { Card, Col, Row, Radio, Button, message, Progress, Space, Typography, Divider } from "antd";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getPoll, submitVote, sendPollResults, type Poll } from "../api/ticketApi"; // افترض وجود هذه الدوال

const { Title, Text } = Typography;

function PollDetails() {
  const pollId = useParams().id;
  const { t } = useTranslation();
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(false);
  
  // حالات جديدة لإدارة التصويت
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  
  // حالة لمعرفة هل المستخدم قام بالتصويت ليتم عرض النتائج بدلاً من نموذج التصويت
  const [hasVoted, setHasVoted] = useState(false);
  
  // حالة لزر الـ Integration
  const [sendingResults, setSendingResults] = useState(false);

  useEffect(() => {
    if (pollId) {
      fetchPoll();
      
      // يمكنك هنا التحقق من localStorage إذا كان المستخدم قد صوت مسبقاً في هذا الاستطلاع
      const userVoted = localStorage.getItem(`voted_${pollId}`);
      if (userVoted) setHasVoted(true);
    }
  }, [pollId]);

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

  const handleVoteSubmit = async () => {
    if (!pollId || !selectedOption) return;
    
    setIsVoting(true);
    try {
      // إرسال التصويت للـ Backend
      const updatedPoll = await submitVote(pollId, selectedOption);
      setPoll(updatedPoll); // تحديث بيانات الاستطلاع بالنتائج الجديدة
      setHasVoted(true);
      localStorage.setItem(`voted_${pollId}`, "true"); // حفظ حالة التصويت محلياً لمنع التكرار (اختياري)
      message.success(t("message.vote_success"));
    } catch (error) {
      console.error("Error submitting vote:", error);
      message.error(t("message.vote_failed"));
    } finally {
      setIsVoting(false);
    }
  };

  const handleSendIntegration = async () => {
    if (!pollId) return;
    
    setSendingResults(true);
    try {
      // استدعاء دالة الـ Lambda الخاصة بالـ Integration
      await sendPollResults(pollId);
      message.success(t("message.integration_success"));
    } catch (error) {
      console.error("Error sending results:", error);
      message.error(t("message.integration_failed"));
    } finally {
      setSendingResults(false);
    }
  };

  if (loading) {
    return (
      <Row justify="center" style={{ padding: "14px" }}>
        <Col xs={24} md={16}>
          <Card loading={loading} />
        </Col>
      </Row>
    );
  }

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
          <Title level={3}>{poll.question}</Title>
          <Divider />

          {!hasVoted ? (
            /* حالة التصويت: عرض الخيارات للمستخدم */
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
            /* حالة النتائج: عرض نسبة التصويت لكل خيار */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Text strong style={{ fontSize: "16px" }}>
                {t("totalVotes")}: {poll.totalVotes}
              </Text>
              
              {poll.options.map((option) => {
                const percent = poll.totalVotes === 0 
                  ? 0 
                  : Math.round((option.votesCount / poll.totalVotes) * 100);
                  
                return (
                  <div key={option.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <Text>{option.text}</Text>
                      <Text type="secondary">{option.votesCount} {t("votes")}</Text>
                    </div>
                    <Progress percent={percent} status="active" strokeColor="#15514F" />
                  </div>
                );
              })}

              <Divider />
              
              {/* زر الـ Integration المطلوب في التاسك */}
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
