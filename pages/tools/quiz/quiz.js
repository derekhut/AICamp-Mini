// pages/tools/quiz/quiz.js
Page({
  data: {
    toolInfo: {
      id: 'quiz',
      title: '设计选择题',
      description: '创建一个学科的选择题测验，基于任何主题、标准或描述！',
      params: [
        {
          id: 'subject',
          label: '学科',
          type: 'select',
          required: true,
          options: [
            { value: '生物学', label: '生物学' },
            { value: '化学', label: '化学' },
            { value: '物理学', label: '物理学' },
            { value: '数学', label: '数学' },
            { value: '计算机科学', label: '计算机科学' },
            { value: '历史', label: '历史' },
            { value: '文学', label: '文学' },
            { value: '经济学', label: '经济学' },
          ],
          placeholder: '选择学科',
          helpText: '选择题目所属的学科'
        },
        {
          id: 'topic',
          label: '主题',
          type: 'text',
          required: true,
          placeholder: '如：细胞分裂、牛顿第二定律、线性代数...',
          helpText: '具体的知识点或主题'
        },
        {
          id: 'difficulty',
          label: '难度',
          type: 'radio',
          required: true,
          options: [
            { value: '简单', label: '简单' },
            { value: '中等', label: '中等' },
            { value: '困难', label: '困难' },
          ],
          helpText: '选择题目的难度级别'
        },
        {
          id: 'numQuestions',
          label: '题目数量',
          type: 'select',
          required: true,
          options: [
            { value: '1', label: '1题' },
            { value: '3', label: '3题' },
            { value: '5', label: '5题' },
            { value: '10', label: '10题' },
          ],
          helpText: '需要生成的题目数量'
        }
      ]
    },
    formData: {
      difficulty: '中等',
      numQuestions: '1' // 默认值设置为1题
    },
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
    
    if (param.options[index].value) {
      value = param.options[index].value;
    } else {
      value = param.options[index];
    }
    
    this.setData({
      [`formData.${field}`]: value,
      [`pickerIndexes.${field}`]: index
    });
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
    
    // 显示加载状态
    wx.showLoading({
      title: '生成中...',
    });
    
    // 调用AI组件处理请求
    const aiGroup = this.selectComponent('#aiGroup');
    aiGroup.data.chat_history = [];
    aiGroup.add_to_his('USER', 'Me', prompt);
    aiGroup.send();
  },
  
  handleAIResponse(e) {
    // 隐藏加载状态
    wx.hideLoading();
    
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
    // 确保题目数量是数字字符串，防止为空或undefined
    const numQuestions = formData.numQuestions || '1';
    console.log('当前题目数量:', numQuestions);
    
    // 基于MP2项目中的提示词模板构建提示词
    return `请按照以下要求生成多选题：

- 学科：${formData.subject}
- 主题：${formData.topic}
- 难度：${formData.difficulty}
- 题目数量：${numQuestions}

要求：
1. 仅生成${numQuestions}道题目
2. 每个问题必须有一个明确、唯一的正确答案
3. 干扰项必须合理，有迷惑性，但不能含糊不清
4. 题目应该测试理解力和应用能力，而不仅仅是记忆力
5. 保持难度一致性

输出格式：
- 题目编号（1, 2, 3...）
- 题干
- 答案选项（A, B, C, D, E）
- 标记正确答案
- 简短的解析（说明为什么这个选项是正确的）`;
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
      path: `/pages/tools/quiz/quiz`
    };
  }
})