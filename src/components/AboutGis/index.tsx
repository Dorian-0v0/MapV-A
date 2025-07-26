import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { Card } from 'antd';

const AboutGis = () => {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        // 假设 README.md 位于 public 文件夹中
        const response = await axios.get('/README.md');
        setMarkdown(response.data);
      } catch (err) {
        setError('无法加载 README 文件');
        console.error('加载 README 失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, []);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <Card
      title="关于项目">
      <div style={{
        marginTop: '-60px',
        marginBottom: '-20px'
      }}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      <div>
        <div id="basemapGalleryContainerRef" />
        cas
      </div>
    </Card >

  );
};

export default AboutGis;