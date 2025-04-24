Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function(newVal) {
        if (newVal) {
          this.start();
        } else {
          this.reset();
        }
      }
    },
    text: {
      type: String,
      value: '正在生成内容...'
    }
  },
  
  data: {
    progress: 0,
    progressTimer: null
  },
  
  lifetimes: {
    attached() {
      // 组件创建时执行
    },
    detached() {
      // 组件销毁时执行，清理定时器
      this.clearTimers();
    }
  },
  
  methods: {
    start() {
      // 清理可能存在的定时器
      this.clearTimers();
      
      // 重置进度
      this.setData({ progress: 0 });
      
      // 模拟进度加载
      let progress = 0;
      const progressTimer = setInterval(() => {
        // 进度增长逻辑 - 3个阶段
        // 1. 快速增长到30%
        if (progress < 30) {
          progress += Math.random() * 4 + 2; // 每次增加2-6%
        } 
        // 2. 中速增长到60%
        else if (progress < 60) {
          progress += Math.random() * 2 + 1; // 每次增加1-3%
        } 
        // 3. 慢速增长到90%
        else if (progress < 90) {
          progress += Math.random() * 0.8 + 0.2; // 每次增加0.2-1%
        }
        
        // 限制最大值为90%（留给结束时使用）
        if (progress > 90) {
          progress = 90;
        }
        
        this.setData({ progress: Math.floor(progress) });
      }, 200); // 每200ms更新一次
      
      this.progressTimer = progressTimer;
    },
    
    // 完成加载
    finish() {
      this.clearTimers();
      
      // 立即完成到100%
      this.setData({ progress: 100 });
      
      // 短暂延迟后隐藏
      setTimeout(() => {
        this.setData({ show: false });
      }, 300);
    },
    
    // 重置状态
    reset() {
      this.clearTimers();
      this.setData({ progress: 0 });
    },
    
    // 清理定时器
    clearTimers() {
      if (this.progressTimer) {
        clearInterval(this.progressTimer);
        this.progressTimer = null;
      }
    }
  }
})
