import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Divider, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import './index.less'; // 自定义样式文件
import { LoGoIcon } from '@/assets/icons';

const { TabPane } = Tabs;

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setLoading(true);
    console.log('Received values:', values);
    

    // 模拟API调用
    setTimeout(() => {
      setLoading(false);
      message.success(activeTab === 'login' ? '登录成功!' : '注册成功!');
    }, 1500);
  };

  const onTabChange = (key) => {
    setActiveTab(key);
    form.resetFields();
  };

  return (
    <div className="login-container">
      {/* 背景图片和遮罩层 */}
      <div className="background-image" />
      <div className="background-overlay" />

      {/* 主内容卡片 */}
      <Card className="login-card">

        <div className="logo-container">
          <LoGoIcon></LoGoIcon>
          <h2 className="welcome-text">欢迎使用我们的平台</h2>

        </div>

        <Tabs
          activeKey={activeTab}
          onChange={onTabChange}
          centered
          animated={{ inkBar: true, tabPane: true }}
        >
          <TabPane tab="登录" key="login">
            <Form
              form={form}
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入您的用户名!' }]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入您的密码!' }]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="密码"
                />
              </Form.Item>

              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <a className="login-form-forgot" href="/forgot-password">
                  忘记密码?
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={loading}
                  block
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="注册" key="register">
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              size="large"
              scrollToFirstError
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入您的邮箱!' },
                  { type: 'email', message: '请输入有效的邮箱地址!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="邮箱"
                />
              </Form.Item>

              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入您的用户名!' }]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入您的密码!' },
                  { min: 6, message: '密码至少6个字符!' }
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="密码"
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: '请确认您的密码!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不匹配!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="确认密码"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={loading}
                  block
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

      </Card>
    </div>
  );
};

export default LoginPage;