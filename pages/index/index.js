// index.js
Page({
    data: {
        activeTab: 0,
        chat_history: [],
        chat_area_height: 0,
        show: true,
        // 定义工具分类
        categories: [
            {
                id: 'smart_classroom',
                name: '智慧课堂',
                tools: [
                    {
                        id: 'quiz',
                        title: '设计选择题',
                        description: '创建学科选择题测验，基于任何主题或标准',
                        path: '/pages/tools/quiz/quiz'
                    }
                ]
            },
            {
                id: 'knowledge_encyclopedia',
                name: '百科大全',
                tools: [
                    {
                        id: 'concept',
                        title: '概念解释',
                        description: '获取任何概念的清晰解释和示例',
                        path: '/pages/tools/concept/concept'
                    }
                ]
            },
            {
                id: 'creativity_lab',
                name: '创意工坊',
                tools: [
                    {
                        id: 'email',
                        title: '专业邮件',
                        description: '生成各种场景的专业邮件内容',
                        path: '/pages/tools/email/email'
                    }
                ]
            },
            {
                id: 'mindful_growth',
                name: '心灵成长',
                tools: []
            }
        ]
    },

    onLoad: function () {
        // 页面加载时的初始化逻辑
    },

    // 点击标签切换
    switchTab: function (e) {
        const index = parseInt(e.currentTarget.dataset.index);
        this.setData({
            activeTab: index
        });
    },

    // 滑动切换
    swiperChange: function (e) {
        this.setData({
            activeTab: e.detail.current
        });
    },

    // 导航到工具页面
    navigateToTool: function (e) {
        const toolId = e.currentTarget.dataset.tool;
        // 查找工具信息
        let toolPath = '';
        this.data.categories.forEach(category => {
            category.tools.forEach(tool => {
                if (tool.id === toolId) {
                    toolPath = tool.path;
                }
            });
        });

        if (toolPath) {
            wx.navigateTo({
                url: toolPath
            });
        } else {
            wx.showToast({
                title: '工具开发中',
                icon: 'none'
            });
        }
    },

    // 保留原有的AI对话功能
    updateChat: function (e) {
        this.setData({chat_history: e.detail.chat_history});
        this.setData({last_chat: "bottom"}); // 必须分开写
    }
})
