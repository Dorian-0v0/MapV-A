import React, { Component } from 'react';
import AntdModal, { ModalProps } from 'antd/lib/modal';


export default class AntDraggableModal extends Component<ModalProps> {
  private simpleClass: string;
  private header: HTMLElement | null = null;
  private contain: HTMLElement | null = null;
  private modalContent: HTMLElement | null = null;

  private mouseDownX: number = 0;
  private mouseDownY: number = 0;
  private deltaX: number = 0;
  private deltaY: number = 0;
  private sumX: number = 0;
  private sumY: number = 0;

  constructor(props: ModalProps) {
    super(props);
    this.simpleClass = `draggable-modal-${Math.random().toString(36).substring(2)}`;
  }

  handleMove = (event: MouseEvent) => {
    if (!this.modalContent) return;
    
    const deltaX = event.pageX - this.mouseDownX;
    const deltaY = event.pageY - this.mouseDownY;

    this.deltaX = deltaX;
    this.deltaY = deltaY;

    this.modalContent.style.transform = `translate(${deltaX + this.sumX}px, ${deltaY + this.sumY}px)`;
  };

  handleHeaderMouseDown = (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    this.mouseDownX = event.pageX;
    this.mouseDownY = event.pageY;
    
    // 防止文本选择
    document.body.style.userSelect = 'none';
    
    window.addEventListener('mousemove', this.handleMove, false);
  };

  removeMove = () => {
    window.removeEventListener('mousemove', this.handleMove, false);
  };

  removeUp = () => {
    // 恢复文本选择
    document.body.style.userSelect = '';
    
    this.sumX += this.deltaX;
    this.sumY += this.deltaY;
    
    this.deltaX = 0;
    this.deltaY = 0;
    
    this.removeMove();
  };

  initialEvent = (visible: boolean) => {
    const { title } = this.props;
    
    // 清理现有事件监听器
    window.removeEventListener('mouseup', this.removeUp, false);
    this.removeMove();
    
    if (title && visible) {
      setTimeout(() => {
        this.contain = document.querySelector(`.${this.simpleClass}`);
        if (!this.contain) return;
        
        this.header = this.contain.querySelector('.ant-modal-header');
        this.modalContent = this.contain.querySelector('.ant-modal-content');
        
        if (this.header && this.modalContent) {
          this.header.style.cursor = 'move';
          
          // 移除旧的事件监听器（如果存在）
          this.header.onmousedown = null;
          
          // 添加新的事件监听器
          this.header.addEventListener('mousedown', this.handleHeaderMouseDown as EventListener);
          
          // 添加鼠标释放事件监听器
          window.addEventListener('mouseup', this.removeUp, false);
        }
      }, 0);
    }
  };

  componentDidMount() {
    const { visible = false } = this.props;
    this.initialEvent(visible);
  }

  componentDidUpdate(prevProps: ModalProps) {
    // 当visible属性变化时重新初始化事件
    if (prevProps.visible !== this.props.visible) {
      this.initialEvent(this.props.visible || false);
      
      // 如果模态框关闭，重置位置
      if (!this.props.visible) {
        this.sumX = 0;
        this.sumY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
      }
    }
  }

  componentWillUnmount() {
    // 清理所有事件监听器
    if (this.header) {
      this.header.removeEventListener('mousedown', this.handleHeaderMouseDown as EventListener);
    }
    this.removeMove();
    window.removeEventListener('mouseup', this.removeUp, false);
    
    // 恢复文本选择
    document.body.style.userSelect = '';
  }

  render() {
    const { children, wrapClassName, ...other } = this.props;
    const wrapModalClassName = wrapClassName ? `${wrapClassName} ${this.simpleClass}` : this.simpleClass;
    
    return (
      <AntdModal {...other} wrapClassName={wrapModalClassName}>
        {children}
      </AntdModal>
    );
  }
}