import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Draggable from 'react-draggable';

interface DraggableModalProps {
  /** 是否显示模态框 */
  visible: boolean;
  /** 控制模态框显示状态的函数 */
  onClose: () => void;
  /** 模态框宽度 */
  maxWidth?: number;
  /** 模态框高度 */
  maxHeight?: number;
  /** 初始位置 */
  defaultPosition?: { x: number; y: number };
  /** 标题内容 */
  title?: React.ReactNode;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 头部样式 */
  headerStyle?: React.CSSProperties;
  /** 内容区域样式 */
  bodyStyle?: React.CSSProperties;
  /** 子内容 */
  children?: React.ReactNode;
  /** 拖拽边界选择器 */
  bounds?: string;
  handleSelector?: string;
}

const DraggableModal: React.FC<DraggableModalProps> = ({
  visible,
  onClose,
  maxWidth = 1000,
  maxHeight = 800,
  defaultPosition = { x: 250, y: 300 },
  title = '',
  style,
  headerStyle,
  bodyStyle,
  children,
  bounds = '#root',
  handleSelector = '.drag-handle'
}) => {
  if (!visible) return null;

  return (
    <Draggable
      defaultPosition={defaultPosition}
      bounds={bounds}
      handle={handleSelector}
    >
      <div
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          borderRadius: 8,
          overflow: 'hidden',
          border: '2px solid #c6c4c4ff',
          ...style
        }}
      >
        {/* 头部拖拽区域 */}
        <div
          className="drag-handle"
          style={{
            backgroundColor: '#f0f0f0',
            cursor: 'move',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            borderBottom: '1px solid #e8e8e8',
            ...headerStyle
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {title}
          </span>
          <Button
            onClick={onClose}
            icon={<CloseOutlined />}
            type="text"
            size="small"
            style={{ marginLeft: 8 }}
          />
        </div>

        {/* 内容区域 */}
        <div
          style={{
            maxHeight,
            maxWidth,
            padding: 10,
            overflow: 'auto',
            ...bodyStyle
          }}
        >
          {children}
        </div>
         <div
          className="drag-handle"
          style={{
            backgroundColor: '#f0f0f0',
            cursor: 'move',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            borderBottom: '1px solid #e8e8e8',
          }}
        >
        </div>
      </div>
    </Draggable>
  );
};

export default DraggableModal;