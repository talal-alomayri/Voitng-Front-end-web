import { Layout, Button, Space, Typography, Flex, Switch, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { Language, Theme } from "../common/constants";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Header } = Layout;
const { Text } = Typography;

export default function AppHeader() {
  const navigate = useNavigate();
  // استخدام دالة الترجمة
  const { t } = useTranslation();

  // جلب اللغة والثيم الحالي من التخزين المحلي
  const currentLanguage =
    (localStorage.getItem("language") as Language) || Language.ENGLISH;
  const currentTheme = (localStorage.getItem("theme") as Theme) || Theme.LIGHT;

  // دالة لتبديل اللغة (عربي / إنجليزي)
  const handleLanguageToggle = (checked: boolean) => {
    const newLanguage = checked ? Language.ARABIC : Language.ENGLISH;
    localStorage.setItem("language", newLanguage);
    // إعادة تحميل الصفحة لتطبيق التغييرات في الاتجاه والنصوص
    window.location.reload();
  };

  // دالة لتبديل الوضع (ليلي / عادي)
  const handleThemeToggle = (checked: boolean) => {
    const newTheme = checked ? Theme.DARK : Theme.LIGHT;
    localStorage.setItem("theme", newTheme);
    window.location.reload();
  };

  // استخدام توكن الألوان الخاص بـ Ant Design
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header style={{ background: colorBgContainer }}>
      <Flex justify="space-between" align="center">
        <Space size="large">
          {/* عنوان التطبيق */}
          <Text style={{ fontSize: "25px" }}>{t("title")}</Text>
          <Space>
            {/* روابط التنقل في الموقع */}
            <Button type="link" onClick={() => navigate("/create")}>
              {t("createPoll")}
            </Button>
            <Button type="link" onClick={() => navigate("/list")}>
              {t("listPolls")}
            </Button>
          </Space>
        </Space>
        <Space>
          {/* مفتاح تبديل الوضع الليلي */}
          <Switch
            checked={currentTheme === Theme.DARK}
            onChange={handleThemeToggle}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
          {/* مفتاح تبديل اللغة */}
          <Switch
            checked={currentLanguage === Language.ARABIC}
            onChange={handleLanguageToggle}
            checkedChildren="AR"
            unCheckedChildren="EN"
          />
        </Space>
      </Flex>
    </Header>
  );
}
