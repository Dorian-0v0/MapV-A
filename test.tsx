
const LayerAttribute = (props: any, propref: any) => {
  const [activeKey, setActiveKey] = useState('1'); // 默认激活第一个标签页
  const [visible, setVisible] = useState(false);
  const [layer, setLayer] = useState<any>({});
  const [spatialRef, setSpatialRef] = useState<any>({});

  const [isFeature, setIsFeature] = useState(false);
  const [dataItem, setDataItem] = useState<any>(null);
  const [ds, setDs] = useState<any>({});
  const [timeFlag, setTimeFlag] = useState('');
  const [sliderValues, setSliderValues] = useState<any>([0, 6]);
  const [showScales, setShowScales] = useState<any>(['--', '--']);

  const { state } = useContext(WorkStationContext);
  const { map, view } = state;

  const [isShowPath, setIsShowPath] = useState(false);
  const { initialState }: any = useModel('@@initialState');
  // 在组件状态部分添加
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
    { value: 'LIKE', label: '包含' },
    { value: 'NOT LIKE', label: '不包含' },
    { value: 'IN', label: '在列表中' },
    { value: 'NOT IN', label: '不在列表中' },
    { value: 'IS NULL', label: '为空' },
    { value: 'IS NOT NULL', label: '不为空' },
  ];





  // 初始化过滤条件1
  const clearAllFilterCondition = () => {
    setFilterExpression([['', '', null]])
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



    // setFilterConditions(filterConditions.map(cond => {
    //   if (cond.id === id) {
    //     return { ...cond, [field]: value };
    //   }
    //   return cond;
    // }));
  };

  // 更新过滤条件
  const updateFilterCondition = (id: number, field: string, value: any) => {
    setFilterConditions(filterConditions.map(cond => {
      if (cond.id === id) {
        return { ...cond, [field]: value };
      }
      return cond;
    }));
  };

  // const updateFilterConnection = (index: number, value: string) => {
  //   const newConnections = [...filterConnections];
  //   newConnections[index] = value;
  //   setFilterConnections(newConnections);
  // };

  // 获取字段所有值
  const getFieldValues = async (fieldName: string) => {
    console.log("查询字段", fieldName)

    const query = layer.createQuery();
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

      layer.queryFeatures(query).then(function (result) {
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
    let whereClause = 'WHERE ';

    for (let i = 0; i < conditions.length; i++) {
      whereClause += conditions[i];

      // 添加连接符（如果有）
      if (i < conditions.length - 1 && filterConnections[i]) {
        whereClause += ` ${filterConnections[i]} `;
      }
    }
    console.log("组合的最终条件", whereClause);

    return whereClause;
  }

  // 应用过滤
  // const applyFilter = () => {
  //   let whereClause = '';
  //   filterConditions.forEach((cond, index) => {
  //     if (cond.field && cond.operator) {
  //       if (index > 0) {
  //         // 添加连接关系
  //         whereClause += ` ${filterConnections[index]} `;
  //       }
  //       if (cond.operator === 'IS NULL' || cond.operator === 'IS NOT NULL') {
  //         whereClause += `${cond.field} ${cond.operator}`;
  //       } else if (cond.value) {
  //         if (cond.operator === 'IN' || cond.operator === 'NOT IN') {
  //           whereClause += `${cond.field} ${cond.operator} (${cond.value})`;
  //         } else {
  //           whereClause += `${cond.field} ${cond.operator} '${cond.value}'`;
  //         }
  //       }
  //     }
  //   });

  //   if (whereClause) {
  //     layer.definitionExpression = whereClause;
  //     layer.refresh();
  //   } else {
  //     layer.definitionExpression = '';
  //     layer.refresh();
  //   }

  //   setVisible(false);
  // };

  useEffect(() => {
    if (layer && layer.spatialReference) {
      if (layer.sourceJSON?.sourceSpatialReference) {
        setSpatialRef(layer.sourceJSON?.sourceSpatialReference);
      } else if (layer.customParameters?.dataItemData) {
        getLayerDetail(layer.customParameters?.dataItemData?.id).then(
          (res: any) => {
            if (res?.sourceSpatialReference) {
              setSpatialRef(res.sourceSpatialReference);
            } else {
              setSpatialRef({});
            }
          },
        );
      } else {
        setSpatialRef({});
      }
      getDs(layer);
      if (layer.customParameters?.isDataItem) {
        let data: any;
        if (layer.customParameters?.dataItemData) {
          data = { ...layer.customParameters.dataItemData };
        }

        if (layer.customParameters?.fileData) {
          data = { ...layer.customParameters.fileData };
        }

        setDataItem({ ...data });
        if (data.startTimeField && data.endTimeField) {
          setTimeFlag('2');
        } else if (data.startTimeField) {
          setTimeFlag('1');
        } else {
          setTimeFlag('');
        }
      } else {
        setDataItem(null);
      }

      const isShowPath = checkPathVisible(
        initialState?.currentUser,
        layer.customParameters?.dataSourceInfo,
      );
      setIsShowPath(isShowPath);

      setSliderValues([0, 6]); // 默认值
      setShowScales(['--', '--']); // 默认值
      if (layer.minScale) {
        handleInputChange(layer.minScale, 0);
      }
      if (layer.maxScale) {
        handleInputChange(layer.maxScale, 1);
      }
    }
    // 在第一个useEffect中添加
    if (layer.fields) {
      setFields(layer.fields);
    }
  }, [layer]);

  useEffect(() => {
    if (map && layer) {
      if (layer.minScale) {
        handleInputChange(layer.minScale, 0);
      }
      if (layer.maxScale) {
        handleInputChange(layer.maxScale, 1);
      }
    }
    return () => {
      // 如果关闭组件，那么触发
      if (visible) {
        console.log('关闭组件');
        setActiveKey('1');
      }


    }

  }, [visible]);

  useEffect(() => {
    if (map) {
      let nlayer = map.allLayers.items.find((i) => i.id == layer.id);
      if (nlayer) {
        setLayer(nlayer);
      }
    }
  }, [map]);

  useEffect(() => {
    if (!timeFlag) {
      setDataItem({ ...dataItem, startTimeField: null, endTimeField: null });
    } else if (timeFlag == '1') {
      setDataItem({ ...dataItem, endTimeField: null });
    }
  }, [timeFlag]);

  const getDs = async (l: any) => {
    if (l.customParameters?.isDataItem) {
      setIsFeature(false);
      if (l.customParameters?.dataSourceInfo) {
        setDs(l.customParameters.dataSourceInfo);
      } else {
        let dataItemData =
          l.customParameters.dataItemData || l.customParameters.fileData;

        let res = await getDatasourceDetail(dataItemData.sourceId);
        if (res.success) {
          setDs(res.data);
        }
      }
    } else {
      setIsFeature(true);
    }
  };

  const getLayerUrl = (l: any) => {
    if (l.hasOwnProperty('layerId')) {
      return `${l.url}/${l.layerId}`;
    } else {
      return l.url;
    }
  };

  const init = (p: any) => {
    setLayer(p);
    setVisible(true);
  };

  const checkType = (type: string, d: any) => {
    if (d?.id) {
      if (d.type == 'localfile') {
        return '文件要素类';
      } else {
        return '数据项要素类';
      }
    }

    switch (type) {
      case 'feature':
        return '要素服务要素类';
      default:
        return '';
    }
  };

  const getDataType = (type: string) => {
    let item = dataTypes.find((i: any) => i.type == type);
    if (item) {
      return item.text;
    } else {
      return '';
    }
  };

  const getPath = () => {
    let path = ds?.path.replaceAll('\\', '/');
    if (!path.endsWith('/')) {
      path += '/';
    }
    path += dataItem.path;
    return path;
  };

  // 根据输入值找到最近的较小比例尺索引
  const findNearestIndex = (value: number) => {
    let nearestIndex = 0;
    for (let i = 0; i < levelScaleMap.length; i++) {
      if (value <= levelScaleMap[i].scale) {
        nearestIndex = i;
      } else {
        break;
      }
    }
    return nearestIndex;
  };

  // 处理滑块变化
  const handleSliderChange = (values: any) => {
    if (values[0] != 0 || showScales[0] != '--') {
      setShowScales((prev: any) => {
        const next = [...prev];
        next[0] = levelScaleMap[values[0]].scale;
        return next;
      });
    }
    if (values[1] != 6 || showScales[1] != '--') {
      setShowScales((prev: any) => {
        const next = [...prev];
        next[1] = levelScaleMap[values[1]].scale;
        return next;
      });
    }
    setSliderValues(values);
  };

  // 生成等间距滑块标记
  const marks = levelScaleMap.reduce((acc: any, cur, index) => {
    acc[index] = {
      label: <div style={{ marginTop: 20 }}>{cur.level}</div>,
    };
    return acc;
  }, {});

  // 处理输入框变化
  const handleInputChange = (value: any, index: number) => {
    if (value === null) return;
    let newIndex;
    if (value == '--' && index == 0) {
      newIndex = 0;
    } else if (value == '--' && index == 1) {
      newIndex = 6;
    } else {
      newIndex = findNearestIndex(value);
    }
    setShowScales((prev: any) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setSliderValues((prev: any) => {
      const next = [...prev];
      next[index] = newIndex;
      return next;
    });
  };

  const getCurrentMapScale = (index: number) => {
    if (index == 1) {
      handleInputChange(Math.floor(view.scale), index); //向下取整
    } else {
      handleInputChange(Math.ceil(view.scale), index); //向上取整
    }
  };

  const onSave = () => {
    layer.minScale = showScales[0];
    layer.maxScale = showScales[1];
    setVisible(false);
  };

  useImperativeHandle(propref, () => ({
    init,
    setVisible,
    switchToTab: (key, ly) => {
      console.log("switchToTab", key, ly);
      setActiveKey(key);
      init(ly);

    }
  }));


  // 解析图层名字
  const getLayerName = (item) => {
    const title = item.title;
    if (title?.[0] === '%') {
      const name = item?.sourceJSON?.name;
      if (name !== undefined && name !== null) return name;

      try {
        return decodeURIComponent(title);
      } catch (e) {
        return title;
      }
    }
    return title;
  };
  layer.title = getLayerName(layer);
  // console.log("layerAttribute", layer);

  return (
    <DragModal
      title={'图层属性：' + layer.title}
      width={700}
      visible={visible}
      maskClosable={false}
      destroyOnClose={true}
      styles={{ mask: { display: 'none' } }}
      // maskStyle={{ display: 'none' }}
      wrapClassName={styles.pointerEventsNone}
      resizeable={true}
      footer={null}
      onCancel={() => setVisible(false)}
    >
      <div className={styles.layerAttribute}>
        <div
          className={styles.infos}
          style={{ width: '100%', maxHeight: '75vh' }}
        >
          <Tabs activeKey={activeKey} style={{ height: '100%' }} onChange={setActiveKey}>
            <Tabs.TabPane tab="数据源信息" key="1" style={{ height: '100%' }}>
              <Collapse bordered={false} defaultActiveKey={['1']}>
                <Panel header="数据源" key="1">
                  <ul className={styles.tables}>
                    <li>
                      <div className={styles.tLabel}>数据类型</div>
                      <div className={styles.tValue}>
                        {checkType(layer.type, dataItem)}
                      </div>
                    </li>
                    {isFeature ? (
                      <>
                        <li>
                          <div className={styles.tLabel}>图层Url</div>
                          <div
                            className={styles.tValue}
                            title={getLayerUrl(layer)}
                          >
                            {getLayerUrl(layer)}
                          </div>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <div className={styles.tLabel}>资源池</div>
                          <div className={styles.tValue} title={ds.name}>
                            {ds.name}
                          </div>
                        </li>
                        {(ds.address || ds.path) &&
                          ds.type != 'localfile' &&
                          ds.type != 'arcgisserver' && (
                            <li>
                              <div className={styles.tLabel}>资源池地址</div>
                              <div
                                className={styles.tValue}
                                title={ds.address || ds.path}
                              >
                                {ds.address || ds.path}
                              </div>
                            </li>
                          )}
                        {ds.type == 'arcgisserver' && (
                          <li>
                            <div className={styles.tLabel}>服务地址</div>
                            <div
                              className={styles.tValue}
                              title={dataItem.path}
                            >
                              {dataItem.path}
                            </div>
                          </li>
                        )}
                        {ds.type == 'localfile' && isShowPath && (
                          <li>
                            <div className={styles.tLabel}>资源地址</div>
                            <div className={styles.tValue} title={getPath()}>
                              {getPath()}
                            </div>
                          </li>
                        )}
                        {ds.port && (
                          <li>
                            <div className={styles.tLabel}>资源池端口</div>
                            <div className={styles.tValue} title={ds.port}>
                              {ds.port}
                            </div>
                          </li>
                        )}
                        {ds.schema && (
                          <li>
                            <div className={styles.tLabel}>资源池实例</div>
                            <div className={styles.tValue} title={ds.schema}>
                              {ds.schema}
                            </div>
                          </li>
                        )}
                        {ds.type && (
                          <li>
                            <div className={styles.tLabel}>资源池类型</div>
                            <div
                              className={styles.tValue}
                              title={getDataType(ds.type)}
                            >
                              {getDataType(ds.type)}
                            </div>
                          </li>
                        )}
                        <li>
                          <div className={styles.tLabel}>资源池用户</div>
                          <div
                            className={styles.tValue}
                            title={ds.userName || ds.createName}
                          >
                            {ds.userName || ds.createName}
                          </div>
                        </li>
                      </>
                    )}

                    <li>
                      <div className={styles.tLabel}>名称</div>
                      <div className={styles.tValue} title={getLayerName(layer)}>
                        {getLayerName(layer)}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>要素类型</div>
                      <div className={styles.tValue} title={layer.type}>
                        {layer.type}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>几何类型</div>
                      <div
                        className={styles.tValue}
                        title={
                          layer?.geometryType ||
                          layer?.customParameters?.dataItemData?.geometryType || layer?.sourceJSON?.layers?.[0]?.geometryType || '无'
                        }
                      >
                        {layer?.geometryType ||
                          layer?.customParameters?.dataItemData?.geometryType ||
                          layer?.sourceJSON?.layers?.[0]?.geometryType || "无"}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>坐标具有Z值</div>
                      <div className={styles.tValue} title={layer.hasZ || '无'}>
                        {layer.hasZ || '无'}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>坐标具有M值</div>
                      <div className={styles.tValue} title={layer.hasM || '无'}>
                        {layer.hasM || '无'}
                      </div>
                    </li>
                  </ul>
                </Panel>
                <Panel header="范围" key="2">
                  <ul className={styles.tables}>
                    <li>
                      <div className={styles.tLabel}>上</div>
                      <div
                        className={styles.tValue}
                        title={layer.fullExtent?.ymax}
                      >
                        {layer.fullExtent?.ymax}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>下</div>
                      <div
                        className={styles.tValue}
                        title={layer.fullExtent?.ymin}
                      >
                        {layer.fullExtent?.ymin}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>左</div>
                      <div
                        className={styles.tValue}
                        title={layer.fullExtent?.xmin}
                      >
                        {layer.fullExtent?.xmin}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>右</div>
                      <div
                        className={styles.tValue}
                        title={layer.fullExtent?.xmax}
                      >
                        {layer.fullExtent?.xmax}
                      </div>
                    </li>
                  </ul>
                </Panel>
                <Panel header="空间参考" key="3">
                  <ul className={styles.tables}>
                    <li>
                      <div className={styles.tLabel}>地理坐标系</div>
                      <div className={styles.tValue} title={spatialRef.name || layer?.fullExtent?.spatialReference?.isGeographic ? 'WGS84' : '无'}>
                        {spatialRef.name || layer?.fullExtent?.spatialReference?.isGeographic ? 'WGS84' : '无'}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>WKID</div>
                      <div className={styles.tValue} title={spatialRef.wkid || layer?.sourceJSON?.spatialReference?.wkid || "无"}>
                        {spatialRef.wkid || layer?.sourceJSON?.spatialReference?.wkid || "无"}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>授权</div>
                      <div
                        className={styles.tValue}
                        title={spatialRef.authority}
                      >
                        {spatialRef.authority}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>线长度单位</div>
                      <div className={styles.tValue} title={spatialRef.unit}>
                        {spatialRef.unit}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>本初子午线</div>
                      <div
                        className={styles.tValue}
                        title={spatialRef.primeMeridian}
                      >
                        {spatialRef.primeMeridian}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>基本面</div>
                      <div
                        className={styles.tValue}
                        title={spatialRef.datumName}
                      >
                        {spatialRef.datumName}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>参考椭球体</div>
                      <div className={styles.tValue} title={spatialRef.gcsName}>
                        {spatialRef.gcsName}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>长半轴</div>
                      <div
                        className={styles.tValue}
                        title={spatialRef.majorSemiAxis}
                      >
                        {spatialRef.majorSemiAxis}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>短半轴</div>
                      <div
                        className={styles.tValue}
                        title={spatialRef.minorSemiAxis}
                      >
                        {spatialRef.minorSemiAxis}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>扁率</div>
                      <div
                        className={styles.tValue}
                        title={spatialRef.flattening}
                      >
                        {spatialRef.flattening}
                      </div>
                    </li>
                  </ul>
                </Panel>
                {layer.type != 'map-image' && (
                  <Panel header="值域、分辨率和容差" key="4">
                    <ul className={styles.tables}>
                      <li>
                        <div className={styles.tLabel}>Y最小值</div>
                        <div
                          className={styles.tValue}
                          title={layer.sourceJSON?.sourceSpatialReference?.minY || layer?.fullExtent?.ymin || "无"}
                        >
                          {layer.sourceJSON?.sourceSpatialReference?.minY || layer?.fullExtent?.ymin || "无"}
                        </div>
                      </li>
                      <li>
                        <div className={styles.tLabel}>Y最大值</div>
                        <div
                          className={styles.tValue}
                          title={layer.sourceJSON?.sourceSpatialReference?.maxY || layer?.fullExtent?.ymax || "无"}
                        >
                          {layer.sourceJSON?.sourceSpatialReference?.maxY || layer?.fullExtent?.ymax || "无"}
                        </div>
                      </li>
                      <li>
                        <div className={styles.tLabel}>X最小值</div>
                        <div
                          className={styles.tValue}
                          title={layer.sourceJSON?.sourceSpatialReference?.minX || layer?.fullExtent?.xmin || "无"}
                        >
                          {layer.sourceJSON?.sourceSpatialReference?.minX || layer?.fullExtent?.xmin || "无"}
                        </div>
                      </li>
                      <li>
                        <div className={styles.tLabel}>X最大值</div>
                        <div
                          className={styles.tValue}
                          title={layer.sourceJSON?.sourceSpatialReference?.maxX || layer?.fullExtent?.xmax || "无"}
                        >
                          {layer.sourceJSON?.sourceSpatialReference?.maxX || layer?.fullExtent?.xmax || "无"}
                        </div>
                      </li>
                    </ul>

                    <ul className={styles.tables} style={{ marginTop: 4 }}>
                      <li>
                        <div className={styles.tLabel}>XY分辨率</div>
                        <div
                          className={styles.tValue}
                          title={
                            layer.sourceJSON?.sourceSpatialReference
                              ?.xyResolution
                          }
                        >
                          {
                            layer.sourceJSON?.sourceSpatialReference
                              ?.xyResolution
                          }
                        </div>
                      </li>
                    </ul>

                    <ul className={styles.tables} style={{ marginTop: 4 }}>
                      <li>
                        <div className={styles.tLabel}>XY容差</div>
                        <div
                          className={styles.tValue}
                          title={
                            layer.sourceJSON?.sourceSpatialReference
                              ?.xyTolerance
                          }
                        >
                          {
                            layer.sourceJSON?.sourceSpatialReference
                              ?.xyTolerance
                          }
                        </div>
                      </li>
                    </ul>
                  </Panel>
                )}
              </Collapse>
            </Tabs.TabPane>

            <Tabs.TabPane tab="显示范围" key="2" style={{ height: '100%' }}>
              <div style={{ paddingLeft: 14 }}>
                <div style={{ padding: '0 15px 0 9px' }}>
                  <Slider
                    range
                    min={0}
                    max={levelScaleMap.length - 1}
                    value={sliderValues}
                    onChange={handleSliderChange}
                    marks={marks}
                    step={1}
                    tooltip={{
                      formatter: (val: any) => `1:${levelScaleMap[val].scale}`,
                      placement: 'bottom',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    height: 68,
                    justifyContent: 'space-between',
                    margin: '80px 60px 30px 60px',
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <div>
                      <h4> 级别：{levelScaleMap[sliderValues[0]].level} </h4>
                      <h4>
                        比例：1:
                        <InputNumber
                          max={levelScaleMap[0].scale}
                          min={levelScaleMap[levelScaleMap.length - 1].scale}
                          value={showScales[0]}
                          controls={false}
                          onChange={(val) => handleInputChange(val, 0)}
                          style={{ width: 100, margin: '0 10px' }}
                        />
                        <Tooltip title="当前级别">
                          <AimOutlined
                            className={styles.setScaleIcon}
                            onClick={() => getCurrentMapScale(0)}
                          />
                        </Tooltip>
                        <Tooltip title="最大级别">
                          <FastBackwardOutlined
                            className={styles.setScaleIcon}
                            onClick={() => {
                              handleInputChange('--', 0);
                            }}
                          />
                        </Tooltip>
                      </h4>
                    </div>
                    <div style={{ marginLeft: 15 }}>
                      <img
                        src={levelScaleMap[sliderValues[0]].image}
                        alt="levelScale"
                      />
                    </div>
                  </div>
                  <Divider
                    type="vertical"
                    style={{ height: '100%', borderColor: 'var(--gabg3)' }}
                  />
                  <div style={{ display: 'flex' }}>
                    <div>
                      <h4>级别：{levelScaleMap[sliderValues[1]].level}</h4>
                      <h4>
                        比例：1:
                        <InputNumber
                          max={levelScaleMap[0].scale}
                          min={levelScaleMap[levelScaleMap.length - 1].scale}
                          value={showScales[1]}
                          controls={false}
                          onChange={(val) => handleInputChange(val, 1)}
                          style={{ width: 100, margin: '0 10px' }}
                        />
                        <Tooltip title="当前级别">
                          <AimOutlined
                            className={styles.setScaleIcon}
                            onClick={() => getCurrentMapScale(1)}
                          />
                        </Tooltip>
                        <Tooltip title="最小级别">
                          <FastForwardOutlined
                            className={styles.setScaleIcon}
                            onClick={() => {
                              handleInputChange('--', 1);
                            }}
                          />
                        </Tooltip>
                      </h4>
                    </div>
                    <div style={{ marginLeft: 15 }}>
                      <img
                        src={levelScaleMap[sliderValues[1]].image}
                        alt="levelScale"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  marginRight: 10,
                }}
              >
                <Button type="primary" onClick={onSave}>
                  保存
                </Button>
              </div>
            </Tabs.TabPane>


            <Tabs.TabPane tab="图层过滤" key="3" style={{ height: '100%' }}>
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
                      style={{ width: 180 }}
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
             
                            style={{ width: 200 }}
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
                            // options={fieldValues[condition.field]?.map(val => ({
                            //   value: val,
                            //   label: val
                            // })) || []}
                            options={fieldValues || []}
                          />
                        ) : (
                          <Select
                            showSearch
                            mode="tags"
             
                            allowClear
                            notFoundContent={"搜索中..."}
                            style={{ width: 200 }}
                            placeholder="输入或选择值"
                            value={condition[2]}
                            onChange={(vals) => {
                              const value = Array.isArray(vals) ? vals[0] : vals
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
                <div style={{ marginBottom: '16px' ,display: 'flex', gap: '10px' }}>
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
                <div style={{ marginTop: '24px', textAlign: 'right' }}>
                  <Space>
                    <Button onClick={() => setVisible(false)}>取消</Button>
                    <Button type="primary" onClick={useFilter}>应用</Button>
                  </Space>
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </DragModal>
  );
};

const RefComponent = forwardRef(LayerAttribute);

export default RefComponent;