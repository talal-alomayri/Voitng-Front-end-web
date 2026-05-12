import { Layout, Flex } from "antd";
import { useTranslation } from "react-i18next";

const { Footer } = Layout;

export default function AppFooter() {
  const { t } = useTranslation();
  return (
    <Footer>
      <Flex justify="center" align="center">
        <span>{t("footerText")}</span>
      </Flex>
    </Footer>
  );
}
