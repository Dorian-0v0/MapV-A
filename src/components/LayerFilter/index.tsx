import { Button, Card, Divider, Layout, List, Modal, Select, Space, Tabs } from "antd";
import { Content } from "antd/es/layout/layout";

import Sider from "antd/es/layout/Sider";
import { use, useEffect, useState } from "react";
import "./index.less"
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import eventBus from "@/utils/eventBus";

const LayerFilter = ({ map }) => {
    const [layers, setLayers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLayer, setSelectedLayer] = useState(null);
    const [fields, setFields] = useState<any[]>([]);  // 过滤字段
    const [fieldValues, setFieldValues] = useState<any[]>([]); // 过滤字段所有的取值
    // 在组件状态部分添加
    const [filterConnections, setFilterConnections] = useState<string[]>(['AND']);
    const [filterExpression, setFilterExpression] = useState<any[][]>([['', '', null]]); // 过滤表达式
    // 过滤操作符选项
    const filterOperators = [
        { value: '=', label: '等于' },
        { value: '<>', label: '不等于' },
        { value: '>', label: '大于' },
        { value: '>=', label: '大于等于' },
        { value: '<', label: '小于' },
        { value: '<=', label: '小于等于' },
        { value: 'IN', label: '在列表中' },
        { value: 'NOT IN', label: '不在列表中' },
        { value: 'LIKE', label: '包含' },
        { value: 'NOT LIKE', label: '不包含' },

        { value: 'IS NULL', label: '为空' },
        { value: 'IS NOT NULL', label: '不为空' },
    ];

    // 初始化过滤条件1
    const clearAllFilterCondition = () => {
        setFilterExpression([['', '', null]])
        selectedLayer.definitionExpression = null
    };

    // 添加过滤条件1
    const addFilterCondition = () => {
        setFilterExpression([...filterExpression, ['', '=', null]]);
        // 添加默认的连接关系
        setFilterConnections([...filterConnections, 'AND']);
    };

    // 删除过滤条件1
    const removeFilterCondition = (index: number) => {
        if (filterConnections.length > 1) {
            setFilterExpression(filterExpression.splice(index, 1)); // 删除过滤条件
            setFilterConnections(filterConnections.splice(index, 1)); // 删除连接关系
        }
    };

    // 更新过滤条件1
    const updateFilterCondition1 = (index, newvalue, childIndex) => {

        if (childIndex === 3) { // 更新连接符号
            const newFilterConnections = [...filterConnections]; // 复制原数组
            newFilterConnections[index] = newvalue; // 修改副本
            setFilterConnections(newFilterConnections); // 更新状态
            return;
        }

        const newFilterExpression = [...filterExpression];
        newFilterExpression[index] = [...filterExpression[index]]; // 复制子数组
        newFilterExpression[index][childIndex] = newvalue;

        setFilterExpression(newFilterExpression); // 更新状态


    };


    // 获取字段所有值
    const getFieldValues = async (fieldName: string) => {
        console.log("查询字段", fieldName)
        const query = selectedLayer?.createQuery();
        // statisticType 统计类型，此处设置为"count"表示进行计数统计
        // onStatisticField 用于统计的字段名称
        // outStatisticFieldName 输出统计结果的字段名称，此处固定为"count"
        query.outStatistics = [{
            statisticType: "count",
            onStatisticField: fieldName,
            outStatisticFieldName: "count"
        }];
        let values: any[] = [];
        try {
            query.groupByFieldsForStatistics = [fieldName];
            console.log("开始查询");

            selectedLayer?.queryFeatures(query).then(function (result) {
                console.log("查询得到的结果", result);

                values = result.features.map(feature => feature.attributes[fieldName]);
                const thisfieldValues = values.map(value => ({ label: value, value: value }));

                console.log("字段所有值（由于渲染）", thisfieldValues);
                setFieldValues(thisfieldValues);
                console.log('字有唯一值:', values);
            });
        } catch (error) {
            console.error('获取字段值失败:', error);
        }
    };

    // 使用过滤1
    const useFilter = () => {
        console.log("使用过滤", filterExpression);

        const conditions: any = [];

        for (let i = 0; i < filterExpression.length; i++) {
            const [field, operator, value] = filterExpression[i];

            // 跳过无效条件（字段为空或未定义）
            if (!field || field.trim() === '') continue;

            // 处理NULL相关操作符
            if (operator === 'IS NULL' || operator === 'IS NOT NULL') {
                conditions.push(`${field} ${operator}`);
                continue;
            }

            // 跳过无效值（值为null或undefined且操作符不是处理NULL的）
            if (value === null || value === undefined) continue;

            // 处理不同操作符
            let condition;
            switch (operator) {
                case '=':
                case '<>':
                case '>':
                case '>=':
                case '<':
                case '<=':
                    // 处理数字和字符串
                    if (typeof value === 'number') {
                        condition = `${field} ${operator} ${value}`;
                    } else {
                        // 字符串需要加引号并转义单引号
                        const escapedValue = String(value).replace(/'/g, "''");
                        condition = `${field} ${operator} '${escapedValue}'`;
                    }
                    break;

                case 'LIKE':
                case 'NOT LIKE':
                    // LIKE操作需要处理通配符
                    const escapedValue = String(value).replace(/'/g, "''");
                    condition = `${field} ${operator} '%${escapedValue}%'`;
                    break;

                case 'IN':
                case 'NOT IN':
                    // 处理数组值
                    if (Array.isArray(value)) {
                        if (value.length === 0) {
                            // 空数组处理
                            condition = operator === 'IN' ? '1=0' : '1=1';
                        } else {
                            const formattedValues = value.map(v => {
                                if (typeof v === 'number') return v;
                                const escaped = String(v).replace(/'/g, "''");
                                return `'${escaped}'`;
                            }).join(', ');
                            condition = `${field} ${operator} (${formattedValues})`;
                        }
                    } else {
                        // 非数组值当作单元素数组处理
                        const formattedValue = typeof value === 'number' ? value : `'${String(value).replace(/'/g, "''")}'`;
                        condition = `${field} ${operator} (${formattedValue})`;
                    }
                    break;

                default:
                    // 默认处理为相等比较
                    const defaultEscapedValue = String(value).replace(/'/g, "''");
                    condition = `${field} = '${defaultEscapedValue}'`;
            }

            conditions.push(condition);
        }

        // 如果没有条件，返回空字符串
        if (conditions.length === 0) return '';

        // 组合条件
        let whereClause = '';

        for (let i = 0; i < conditions.length; i++) {
            whereClause += conditions[i];

            // 添加连接符（如果有）
            if (i < conditions.length - 1 && filterConnections[i]) {
                whereClause += ` ${filterConnections[i]} `;
            }
        }
        console.log("组合的最终条件", whereClause);

        try {
            selectedLayer.definitionExpression = whereClause;
        } catch (error) {
            console.error('设置过滤条件时出错：', error);
        }
        console.log("最终的过滤结果", selectedLayer);

        // return whereClause;
    }
    useEffect(() => {
        console.log("LayerFilter", map?.layers?.items);
        setLayers(map?.layers?.items || []);
        setSelectedLayer(map?.layers?.items?.[0])
    }, [map?.layers?.items?.length])


    useEffect(() => {
        console.log("Layer0000000", selectedLayer);
        setFilterExpression([['', '', null]])
        if (selectedLayer?.fields) {
            setFields(selectedLayer.fields);
        }
    }, [selectedLayer?.fields])

    useEffect(() => {
        eventBus.on('open-layer-filter', () => {
            setIsModalOpen(true);
        })
        return () => {
            setIsModalOpen(false);
            console.log('ziid');

            eventBus.removeAllListeners();
        }
    }, [])

    return (


        <Modal
            width={900}
            bodyStyle={{
                height: 400,  // 设置弹框内容区域高度
                padding: 0,   // 移除内边距
                display: 'flex' // 使用flex布局
            }}
            title="图层条件过滤"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={() => {
                useFilter()
                // setIsModalOpen(false);
            }}
            onCancel={() => {
                setIsModalOpen(false);
            }}
        >
            <Sider
                style={{
                    height: '100%', // Sider高度填满Modal
                    backgroundColor: '#f5f5f5',
                    overflow: 'auto' // 如果内容超出高度允许滚动
                }}
                width={150}>
                <List

                    size="small"
                    // bordered
                    dataSource={layers}
                    renderItem={(layer) => (
                        <List.Item
                            onClick={() => setSelectedLayer(layer)}
                            className="list-item"
                            style={{
                                cursor: 'pointer',
                                backgroundColor: selectedLayer?.id === layer.id ? '#1677ff' : '#ffffff',
                                border: '1px solid #d9d9d9',
                                height: 40,
                                fontSize: '12px',
                                marginBottom: 4, // 项与项之间的间距
                                paddingLeft: 1,
                                paddingTop: 0,
                                color: selectedLayer?.id === layer.id ? '#ffffff' : '#1c1c1c',
                                transition: 'all 0.3s', // 添加过渡动画效果

                            }}
                        >
                            {layer?.title}
                        </List.Item>
                    )}
                />
            </Sider>
            <Content
                style={{
                    padding: 24,
                    minHeight: 280,
                    background: '#fff',
                    overflowY: 'auto', // 垂直溢出时显示滚动条
                }}>
                {filterExpression.map((condition, index) => (
                    <div key={index} style={{ marginBottom: '16px' }}>
                        {index > 0 ? (
                            <Select
                                style={{ width: 80, marginRight: 8 }}
                                value={filterConnections[index]}
                                onChange={(value) => updateFilterCondition1(index, value, 3)}
                                options={[
                                    { value: 'AND', label: 'AND' },
                                    { value: 'OR', label: 'OR' }
                                ]}
                            />
                        ) : (
                            <span style={{ display: 'inline-block', width: 80, marginRight: 8, textAlign: 'right' }}>where</span>
                        )}
                        <Space>
                            <Select
                                style={{ width: 120 }}
                                placeholder="选择字段"
                                value={condition[0]}
                                showSearch  // 允许搜索，但不允许输入
                                optionFilterProp="label"  // 按 label 搜索
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value) => { // 添加防抖？？
                                    console.log("选择字段：", value);
                                    updateFilterCondition1(index, value, 0);
                                    console.log("输入字段", condition[0]);
                                    setFieldValues([])
                                }}
                                options={
                                    fields.map(field => ({
                                        value: field.name,
                                        label: field.name
                                    }))
                                }
                            />

                            <Select
                                style={{ width: 120 }}
                                value={filterExpression[index][1]}
                                onChange={(value) => {
                                    condition[2] = null;
                                    updateFilterCondition1(index, null, 2)
                                    updateFilterCondition1(index, value, 1)
                                    // 清空右边

                                }}
                                options={filterOperators}
                            />

                            {
                                !['IS NULL', 'IS NOT NULL'].includes(filterExpression[index][1]) && (
                                    condition[1] === 'IN' || condition[1] === 'NOT IN' ? (
                                        <Select
                                            mode="multiple"
                                            placeholder="选择值"
                                            notFoundContent={"搜索中..."}
                                            value={condition[2] ? condition[2] : []}
                                            onFocus={async () => {
                                                await getFieldValues(condition[0]);
                                                console.log('字段值:', fieldValues);
                                                console.log("所有字段的格式", fields.map(field => ({
                                                    value: field.name,
                                                    label: field.name
                                                })));
                                            }}
                                            onChange={(values) => {
                                                console.log("选择的值：", values);
                                                updateFilterCondition1(
                                                    index,
                                                    values,
                                                    2
                                                )

                                            }}

                                            options={fieldValues || []}
                                        />
                                    ) : (
                                        <Select
                                            showSearch
                                            mode="tags"

                                            allowClear
                                            notFoundContent={"搜索中..."}
                                            style={{ width: 180 }}
                                            placeholder="输入或选择值"
                                            value={condition[2]}
                                            onChange={(vals) => {
                                                const value = Array.isArray(vals) ? vals[vals?.length - 1] : vals
                                                console.log("选择的值：", value);
                                                updateFilterCondition1(index, value, 2);
                                            }}
                                            onFocus={async () => {
                                                await getFieldValues(condition[0]);
                                                console.log('字段值:', fieldValues);
                                                console.log("所有字段的格式", fields.map(field => ({
                                                    value: field.name,
                                                    label: field.name
                                                })));
                                            }}
                                            options={fieldValues || []}
                                        />
                                    )
                                )
                            }

                            {
                                filterExpression.length > 1 && (
                                    <Button
                                        icon={<CloseOutlined />}
                                        onClick={() => removeFilterCondition(index)}
                                    />
                                )
                            }
                        </Space>
                    </div>
                ))}
                <div style={{ padding: '16px' }}>
                    <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={addFilterCondition}
                        >
                            添加条件
                        </Button>
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={clearAllFilterCondition}
                        >
                            清空全部
                        </Button>
                    </div>
                </div>
            </Content>



        </Modal>

    )
}

export default LayerFilter;