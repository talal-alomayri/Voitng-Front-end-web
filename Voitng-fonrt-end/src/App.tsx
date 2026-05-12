import { BrowserRouter } from "react-router-dom";
import { AppRoute } from "./Routes";
import { ConfigProvider, Layout, theme } from "antd";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import { I18nextProvider, useTranslation } from "react-i18next";
import { Language, Theme } from "./common/constants";
import { useEffect } from "react";

const { Content } = Layout;

function App() {
  // استخدام useTranslation للتحكم في اللغات
  const { i18n } = useTranslation();
  
  // جلب الوضع الليلي أو العادي من التخزين المحلي
  const themeMode: Theme =
    (localStorage.getItem("theme") as Theme) || Theme.LIGHT;
  
  // استخراج خوارزميات التصميم الخاصة بـ Ant Design
  const { defaultAlgorithm, darkAlgorithm } = theme;

  // تأثير جانبي لضبط اللغة المحفوظة عند تشغيل التطبيق
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || Language.ENGLISH;
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    // توفير سياق الترجمة للتطبيق بالكامل
    <I18nextProvider i18n={i18n}>
      {/* مزود الإعدادات لـ Ant Design للتحكم في الاتجاه (RTL/LTR) والتنسيق */}
      <ConfigProvider
        direction={i18n.language === Language.ARABIC ? "rtl" : "ltr"}
        theme={{
          algorithm:
            themeMode === Theme.DARK ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: "#15514F",
            colorSuccess: "#4ea64e",
            colorWarning: "#c5871f",
            colorError: "#9c3b3b",
            colorLink: "#27918D",
            colorInfo: "#27918D",
            fontSize: 16,
          },
        }}
      >
        <BrowserRouter>
          <Layout style={{ minHeight: "100vh" }}>
            {/* رأس الصفحة */}
            <AppHeader />
            {/* محتوى الصفحة الرئيسي */}
            <Content>
              <AppRoute />
            </Content>
            {/* تذييل الصفحة */}
            <AppFooter />
          </Layout>
        </BrowserRouter>
      </ConfigProvider>
    </I18nextProvider>
  );
}

export default App;
