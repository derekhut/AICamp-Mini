// index.js
Page({
    data: {
        activeCategory: 'all',  // 当前选中的分类
        chat_history: [],
        chat_area_height: 0,
        show: true,
        
        // 分类列表
        categoryList: [
            { id: 'all', name: '全部' },
            { id: 'smart_classroom', name: '智慧课堂' },
            { id: 'knowledge_encyclopedia', name: '百科大全' },
            { id: 'creativity_lab', name: '创意工坊' },
            { id: 'mindful_growth', name: '心灵成长' }
        ],
        
        // 工具数据
        tools: [
            {
                id: 'quiz',
                title: '设计选择题',
                description: '创建一个AI学科的选择题测验，基于任何主题、排版整洁！',
                path: '/pages/tools/quiz/quiz',
                category: 'smart_classroom',
                categoryName: '智慧课堂',
                featured: true
            },
            {
                id: 'concept',
                title: '概念解释',
                description: '获取任何概念的清晰解释和实例应用',
                path: '/pages/tools/concept/concept',
                category: 'knowledge_encyclopedia',
                categoryName: '百科大全',
                featured: false
            },
            {
                id: 'email',
                title: '撰写专业邮件',
                description: '根据需求生成专业、得体的商务和学术邮件',
                path: '/pages/tools/email/email',
                category: 'creativity_lab',
                categoryName: '创意工坊',
                featured: false
            }
        ],
        
        // 筛选后的工具列表
        filteredTools: [],
        
        // 推荐工具
        featuredTool: null
    },

    onLoad() {
        // 找出标记为featured的工具
        const featuredTools = this.data.tools.filter(tool => tool.featured);
        const featuredTool = featuredTools.length > 0 ? featuredTools[0] : null;
        
        // 初始化筛选工具列表
        this.setData({
            featuredTool,
            filteredTools: this.data.tools
        });
    },

    // 切换分类
    switchCategory(e) {
        const category = e.currentTarget.dataset.category;
        this.setData({
            activeCategory: category
        });
        this.filterTools();
    },

    // 过滤工具
    filterTools() {
        const { tools, activeCategory } = this.data;
        let filtered = tools;
        
        if (activeCategory !== 'all') {
            filtered = tools.filter(tool => tool.category === activeCategory);
        }
        
        this.setData({
            filteredTools: filtered
        });
    },

    // 导航到工具页面
    navigateToTool(e) {
        const toolId = e.currentTarget.dataset.tool;
        
        // 找到对应的工具
        const tool = this.data.tools.find(item => item.id === toolId);
        
        if (tool) {
            wx.navigateTo({
                url: tool.path,
                success: () => {
                    console.log(`成功导航到工具: ${tool.title}`);
                },
                fail: (err) => {
                    console.error(`导航失败: ${err.errMsg}`);
                    wx.showToast({
                        title: '页面打开失败',
                        icon: 'none'
                    });
                }
            });
        }
    },

    // 保留原有的AI对话功能
    updateChat(e) {
        this.setData({
            chat_history: e.detail.chat_history
        });
        this.setData({last_chat: "bottom"}); // 必须分开写
    }
})
