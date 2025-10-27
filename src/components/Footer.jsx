import { Layout, Space } from 'antd';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';

const Footer = () => (
  <Layout.Footer className="border-t border-slate-200/60 bg-white/80 backdrop-blur">
    <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 text-sm text-slate-500 sm:flex-row sm:items-center">
      <Space size="middle">
        <span className="font-semibold text-slate-700">EduPath Next</span>
        <span>Dong hanh dinh huong hoc sinh Viet</span>
      </Space>
      <Space size="large">
        <span className="flex items-center gap-2"><MailOutlined /> support@edupath.vn</span>
        <span className="flex items-center gap-2"><PhoneOutlined /> 1900 1234</span>
      </Space>
    </div>
  </Layout.Footer>
);

export default Footer;
