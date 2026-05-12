import { useState } from "react";
import { Button, Card, Col, Form, Input, message, Row, Typography } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/es/form/Form";
import { QRCodeSVG } from "qrcode.react";
// افترض أنك قمت بتعديل api.ts ليحتوي على هذه الدالة والنوع
import { createPoll, type CreatePollDto } from "../api/PollApi";

const { Title, Text } = Typography;

function CreatePoll() {
  // استخدام دالة الترجمة
  const { t } = useTranslation();
  // لاستخدام رسائل التنبيه
  const [messageApi, contextHolder] = message.useMessage();
  // لإدارة النموذج
  const [form] = useForm();

  // حالة لحفظ المعرف بعد نجاح الإنشاء لعرض الـ QR Code
  const [createdPollId, setCreatedPollId] = useState<string | null>(null);

  // دالة تُنفذ عند إرسال النموذج
  const onFinish = (values: { question: string; options: string[] }) => {
    // تجهيز البيانات
    const pollData: CreatePollDto = {
      question: values.question,
      options: values.options.filter(opt => opt && opt.trim() !== ""),
    };

    // إنشاء الاستطلاع عبر الـ API
    createPoll(pollData)
      .then((newPoll) => {
        messageApi.success(t("message.create_poll_success"));
        setCreatedPollId(newPoll.id);
      })
      .catch((error) => {
        console.error("Error creating poll:", error);
        messageApi.error(t("message.create_poll_failed"));
      });
  };

  // رابط التصويت المولد
  const votingUrl = createdPollId ? `${window.location.origin}/poll/${createdPollId}` : "";

  return (
    <Row justify="center" style={{ padding: "14px" }}>
      {contextHolder}
      <Col xs={24} md={14} lg={12}>
        <Card title={t("creatingNewPoll")}>

          {/* واجهة النجاح وعرض الـ QR Code */}
          {createdPollId ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Title level={4}>{t("pollCreated")}</Title>
              <div style={{ background: "white", padding: "16px", display: "inline-block", borderRadius: "8px", marginBottom: "16px" }}>
                <QRCodeSVG value={votingUrl} size={200} />
              </div>
              <div>
                <Text>{t("scanToVote")}</Text>
                <br />
                <a href={votingUrl} target="_blank" rel="noreferrer">
                  {votingUrl}
                </a>
              </div>
              <Button
                type="primary"
                style={{ marginTop: "24px" }}
                onClick={() => {
                  setCreatedPollId(null);
                  form.resetFields();
                }}
              >
                {t("createNew")}
              </Button>
            </div>
          ) : (

            /* واجهة إدخال بيانات الاستطلاع الجديد */
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              initialValues={{ options: ["", ""] }} // خيارين افتراضيين عند البداية
            >
              {/* حقل السؤال */}
              <Form.Item
                name="question"
                label={t("form.question")}
                rules={[{ required: true, message: t("message.required") }]}
              >
                <Input placeholder={t("form.placeholder_question")} />
              </Form.Item>

              {/* القائمة الديناميكية لإضافة أو حذف خيارات الاستطلاع */}
              <Form.List
                name="options"
                rules={[
                  {
                    validator: async (_, options) => {
                      if (!options || options.length < 2) {
                        return Promise.reject(new Error(t("message.min_options")));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    <div style={{ marginBottom: "8px" }}>
                      {/* عنوان قسم الخيارات */}
                      <Text>{t("form.options")}</Text>
                    </div>
                    {/* حلقة تكرار لعرض كل خيار تم إضافته */}
                    {fields.map((field, index) => (
                      <Form.Item required={false} key={field.key} style={{ marginBottom: "12px" }}>
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: t("message.required_option"),
                            },
                          ]}
                          noStyle
                        >
                          {/* حقل إدخال نص الخيار مع رقم الخيار */}
                          <Input placeholder={`${t("form.placeholder_option")} ${index + 1}`} style={{ width: '90%' }} />
                        </Form.Item>
                        {/* زر حذف الخيار - يظهر فقط إذا كان هناك أكثر من خيارين */}
                        {fields.length > 2 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            style={{ margin: '0 8px', color: '#ff4d4f' }}
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Form.Item>
                    ))}
                    {/* زر إضافة خيار جديد إلى القائمة */}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{ width: '90%' }}
                        icon={<PlusOutlined />}
                      >
                        {t("button.add_option")}
                      </Button>
                      {/* عرض أخطاء التحقق من الصحة الخاصة بقائمة الخيارات */}
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>

              {/* زر إرسال النموذج لإنشاء الاستطلاع */}
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  {t("button.create_poll")}
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </Col>
    </Row>
  );
}

export default CreatePoll;

