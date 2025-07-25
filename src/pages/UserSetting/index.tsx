import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Select,
  Modal,
  message,
  Avatar,
  Divider,
  Row,
  Col,
  Radio,
  InputNumber
} from 'antd';
import { UserOutlined, UploadOutlined, LockOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserSetting = () => {
  const [form] = Form.useForm();
  const [workbenchModalVisible, setWorkbenchModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [zoomType, setZoomType] = useState<'zoom' | 'scale'>('zoom');

  // 初始用户数据
  const initialUserData = {
    nickname: 'GIS专家',
    avatar: '',
    gender: 'male',
    email: 'user@example.com'
  };

  const [userData, setUserData] = useState(initialUserData);
  const [workbenchConfig, setWorkbenchConfig] = useState({
    wmtsUrl: 'https://example.com/wmts',
    mapName: '默认地图',
    thumbnail: '',
    center: [116.404, 39.915],
    zoom: 10,
    scale: 100000
  });

  // 头像上传前处理
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  // 处理头像上传
  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      // 这里应该是上传到服务器的逻辑
      const imageUrl = URL.createObjectURL(info.file.originFileObj);
      setUserData({ ...userData, avatar: imageUrl });
      message.success('头像上传成功');
    }
  };

  // 保存用户信息
  const saveUserInfo = (values: any) => {
    setUserData({ ...userData, ...values });
    message.success('用户信息已保存');
  };

  // 保存工作台配置
  const saveWorkbenchConfig = (values: any) => {
    setWorkbenchConfig({ ...workbenchConfig, ...values });
    setWorkbenchModalVisible(false);
    message.success('工作台配置已保存');
  };

  // 修改密码
  const changePassword = (values: any) => {
    console.log('修改密码:', values);
    setPasswordModalVisible(false);
    message.success('密码修改成功');
  };

  return (
    <div style={{ padding: '16px', maxWidth: '100%', overflowX: 'hidden' }}>
      <Row gutter={16}>
        <Col xs={24} md={16}>
          <Card title="个人信息" bordered={false}>
            <Form
              form={form}
              initialValues={userData}
              onFinish={saveUserInfo}
              layout="vertical"
            >
              <Form.Item label="头像">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleAvatarChange}
                >
                  {userData.avatar ? (
                    <Avatar src={userData.avatar} size={100} />
                  ) : (
                    <div>
                      <UserOutlined style={{ fontSize: '32px' }} />
                      <div style={{ marginTop: 8 }}>上传头像</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item
                label="昵称"
                name="nickname"
                rules={[{ required: true, message: '请输入昵称!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="性别" name="gender">
                <Select>
                  <Option value="male">男</Option>
                  <Option value="female">女</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱!' },
                  { type: 'email', message: '请输入有效的邮箱地址!' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存个人信息
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Divider />

          <Card title="账户安全" bordered={false}>
            <Button
              type="primary"
              icon={<LockOutlined />}
              onClick={() => setPasswordModalVisible(true)}
            >
              修改密码
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="地图工作台配置" bordered={false}>
            <div style={{ marginBottom: '16px' }}>
              <p>
                <strong>当前底图:</strong> {workbenchConfig.mapName}
              </p>
              <p>
                <strong>中心点:</strong> {workbenchConfig.center.join(', ')}
              </p>
              <p>
                <strong>{zoomType === 'zoom' ? '缩放级别' : '比例尺'}:</strong>{' '}
                {zoomType === 'zoom' ? workbenchConfig.zoom : workbenchConfig.scale}
              </p>
            </div>

            <Button
              type="primary"
              onClick={() => setWorkbenchModalVisible(true)}
              block
            >
              配置工作台
            </Button>
          </Card>
        </Col>
      </Row>

      {/* 工作台配置模态框 */}
      <Modal
        title="地图工作台配置"
        visible={workbenchModalVisible}
        onCancel={() => setWorkbenchModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          initialValues={workbenchConfig}
          onFinish={saveWorkbenchConfig}
          layout="vertical"
        >
          <Form.Item
            label="WMTS服务地址"
            name="wmtsUrl"
            rules={[{ required: true, message: '请输入WMTS服务地址!' }]}
          >
            <Input placeholder="https://example.com/wmts" />
          </Form.Item>

          <Form.Item
            label="地图名称"
            name="mapName"
            rules={[{ required: true, message: '请输入地图名称!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="地图缩略图">
            <Upload
              name="thumbnail"
              listType="picture-card"
              className="thumbnail-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
            >
              {workbenchConfig.thumbnail ? (
                <img
                  src={workbenchConfig.thumbnail}
                  alt="地图缩略图"
                  style={{ width: '100%' }}
                />
              ) : (
                <div>
                  <UploadOutlined style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: 8 }}>上传缩略图</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="经度"
                name={['center', 0]}
                rules={[{ required: true, message: '请输入经度!' }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="纬度"
                name={['center', 1]}
                rules={[{ required: true, message: '请输入纬度!' }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="缩放设置">
            <Radio.Group
              value={zoomType}
              onChange={(e) => setZoomType(e.target.value)}
              style={{ marginBottom: 16 }}
            >
              <Radio value="zoom">缩放级别</Radio>
              <Radio value="scale">比例尺</Radio>
            </Radio.Group>

            {zoomType === 'zoom' ? (
              <Form.Item
                name="zoom"
                rules={[{ required: true, message: '请输入缩放级别!' }]}
              >
                <InputNumber min={1} max={18} style={{ width: '100%' }} />
              </Form.Item>
            ) : (
              <Form.Item
                name="scale"
                rules={[{ required: true, message: '请输入比例尺!' }]}
              >
                <InputNumber min={1000} style={{ width: '100%' }} />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存配置
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => setWorkbenchModalVisible(false)}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        visible={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form onFinish={changePassword} layout="vertical">
          <Form.Item
            label="当前密码"
            name="currentPassword"
            rules={[{ required: true, message: '请输入当前密码!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码!' },
              { min: 6, message: '密码长度不能少于6位!' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              确认修改
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => setPasswordModalVisible(false)}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserSetting;