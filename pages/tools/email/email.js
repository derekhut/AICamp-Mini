Page({
  data: {
    toolInfo: {
      id: 'email',
      title: '撰写专业邮件',
      description: '根据需求生成专业、得体的商务和学术邮件',
      params: [
        {
          id: 'emailRequest',
          label: '邮件需求',
          type: 'textarea',
          required: true,
          placeholder: '请描述您需要的邮件类型、目的和内容…',
          helpText: '详细说明邮件的目的、收件人、主要内容等'
        }
      ]
    },
    formData: {},
    pickerIndexes: {},
    result: ''
  },
  
  onLoad: function() {
    // 预处理选项标签
    const params = this.data.toolInfo.params;
    params.forEach(param => {
      if (param.type === 'select' && param.options) {
        const optionsLabels = param.options.map(opt => {
          return typeof opt === 'string' ? opt : opt.label;
        });
        param.optionsLabels = optionsLabels;
      }
    });
    
    this.setData({
      'toolInfo.params': params
    });
  },
  
  pickerChange(e) {
    const field = e.currentTarget.dataset.field;
    const index = e.detail.value;
    const param = this.data.toolInfo.params.find(p => p.id === field);
    let value;
    
    if (param && param.options && param.options[index]) {
      if (param.options[index].value) {
        value = param.options[index].value;
      } else {
        value = param.options[index];
      }
      
      this.setData({
        [`formData.${field}`]: value,
        [`pickerIndexes.${field}`]: index
      });
    }
  },
  
  radioChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },
  
  submitForm(e) {
    // 获取表单值，并合并已存储在formData中的值
    const formValues = {...this.data.formData, ...e.detail.value};
    
    // 简单验证（确保必填字段已填写）
    const params = this.data.toolInfo.params;
    let isValid = true;
    let errorMessage = '';
    
    params.forEach(param => {
      if (param.required && !formValues[param.id]) {
        isValid = false;
        errorMessage = `请填写${param.label}`;
      }
    });
    
    if (!isValid) {
      wx.showToast({
        title: errorMessage,
        icon: 'none'
      });
      return;
    }
    
    // 构建提示词
    const prompt = this.buildPrompt(formValues);
    
    // 显示加载进度指示器
    const loadingProgress = this.selectComponent('#loadingProgress');
    loadingProgress.setData({ show: true });
    
    // 调用AI组件处理请求
    const aiGroup = this.selectComponent('#aiGroup');
    aiGroup.data.chat_history = [];
    aiGroup.add_to_his('USER', 'Me', prompt);
    aiGroup.send();
  },
  
  handleAIResponse(e) {
    // 完成加载进度并隐藏加载指示器
    const loadingProgress = this.selectComponent('#loadingProgress');
    loadingProgress.finish();
    
    const chatHistory = e.detail.chat_history;
    if (chatHistory && chatHistory.length > 0) {
      // 获取AI回复
      const aiResponse = chatHistory[chatHistory.length - 1];
      if (aiResponse.sender_type === 'BOT') {
        this.setData({
          result: aiResponse.text
        });
      }
    }
  },
  
  buildPrompt(formData) {
    // 基于AI-Camp专业邮件工具的提示词模板
    return `
你是一位专业的邮件撰写专家，精通商务沟通和学术交流。
请根据以下需求，撰写一封专业、得体的邮件：

${formData.emailRequest}

要求：

- 使用专业、得体的语言
- 结构清晰，逻辑连贯
- 语气适合收件人和目的
- 包含适当的开头称呼和结尾署名
- 清楚表达主要内容和目的

请确保邮件：
- 专业且有礼貌
- 简洁明了，不啵嗦
- 符合商务或学术邮件的标准格式
- 没有语法或拼写错误
    `;
  },
  
  copyResult() {
    wx.setClipboardData({
      data: this.data.result,
      success() {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },
  
  onShareAppMessage() {
    return {
      title: this.data.toolInfo.title,
      path: '/pages/tools/email/email'
    };
  }
})