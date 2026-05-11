import { useState } from "react";
import { Button, Card, Col, Form, Input, message, Row, Typography } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/es/form/Form";
import { QRCodeSVG } from "qrcode.react";
// افترض أنك قمت بتعديل api.ts ليحتوي على هذه الدالة والنوع
import { createPoll, type CreatePollDto } from "../api/ticketApi"; 

const { Title, Text } = Typography;

function CreatePoll() {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();
  
  // حالة لحفظ الـ ID بعد نجاح الإنشاء وعرض الـ QR Code
  const [createdPollId, setCreatedPollId] = useState<string | null>(null);

  const onFinish = (values: { question: string; options: string[] }) => {
    // تنسيق البيانات لتتطابق مع الـ DTO المتوقع
    const pollData: CreatePollDto = {
      question: values.question,
      options: values.options.filter(opt => opt && opt.trim() !== ""), // تنظيف الخيارات الفارغة
    };

    createPoll(pollData)
      .then((newPoll) => {
        messageApi.success(t("message.create_poll_success", "Poll created successfully!"));
        setCreatedPollId(newPoll.id); // هذا سيغير الواجهة لعرض الـ QR
      })
      .catch((error) => {
        console.error("Error creating poll:", error);
        messageApi.error(t("message.create_poll_failed", "Failed to create poll"));
      });
  };

  const votingUrl = createdPollId ? `${window.location.origin}/poll/${createdPollId}` : "";

  return (
    <Row justify="center" style={{ padding: "14px" }}>
      {contextHolder}
      <Col xs={24} md={14} lg={12}>
        <Card title={t("creatingNewPoll", "Create a New Poll")}>
          
          {/* إذا تم الإنشاء بنجاح، نعرض الـ QR Code */}
          {createdPollId ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Title level={4}>{t("pollCreated", "Poll Created Successfully!")}</Title>
              <div style={{ background: "white", padding: "16px", display: "inline-block", borderRadius: "8px", marginBottom: "16px" }}>
                <QRCodeSVG value={votingUrl} size={200} />
              </div>
              <div>
                <Text>{t("scanToVote", "Scan to vote, or share this link:")}</Text>
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
                {t("createNew", "Create Another Poll")}
              </Button>
            </div>
          ) : (
            
            /* نموذج إنشاء الاستطلاع */
            <Form 
              form={form} 
              onFinish={onFinish} 
              layout="vertical"
              initialValues={{ options: ["", ""] }} // نبدأ بخيارين فارغين افتراضياً
            >
              <Form.Item
                name="question"
                label={t("form.question", "Poll Question")}
                rules={[{ required: true, message: t("message.required", "Please enter the question") }]}
              >
                <Input placeholder="e.g. What is your favorite programming language?" />
              </Form.Item>

              {/* القائمة الديناميكية للخيارات */}
              <Form.List 
                name="options"
                rules={[
                  {
                    validator: async (_, options) => {
                      if (!options || options.length < 2) {
                        return Promise.reject(new Error(t("message.min_options", "At least 2 options are required")));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    <div style={{ marginBottom: "8px" }}>
                      <Text>{t("form.options", "Options")}</Text>
                    </div>
                    {fields.map((field, index) => (
                      <Form.Item required={false} key={field.key} style={{ marginBottom: "12px" }}>
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: t("message.required_option", "Please input an option or delete this field."),
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder={`Option ${index + 1}`} style={{ width: '90%' }} />
                        </Form.Item>
                        {fields.length > 2 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            style={{ margin: '0 8px', color: '#ff4d4f' }}
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{ width: '90%' }}
                        icon={<PlusOutlined />}
                      >
                        {t("button.add_option", "Add Option")}
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  {t("button.create_poll", "Create Poll & Generate QR")}
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

