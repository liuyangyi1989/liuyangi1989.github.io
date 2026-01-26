/**
 * 网页应用的JavaScript功能
 */

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 绑定按钮点击事件
    const btn = document.querySelector('.btn');
    if (btn) {
        btn.addEventListener('click', showMessage);
    }
    
    // 添加页面加载动画
    addPageLoadAnimation();
    
    // 初始化功能示例
    initFeatureExamples();
});

/**
 * 显示欢迎消息
 */
function showMessage() {
    alert('你好！欢迎使用我的网页应用。');
}

/**
 * 添加页面加载动画
 */
function addPageLoadAnimation() {
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // 触发重排后设置最终样式
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }
}

/**
 * 初始化功能示例
 */
function initFeatureExamples() {
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        // 添加延迟动画
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 300 + (index * 100));
        
        // 添加鼠标悬停效果
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

/**
 * 添加新功能：动态创建元素
 */
function addNewFeature() {
    const featuresContainer = document.querySelector('.features');
    if (featuresContainer) {
        const newFeature = document.createElement('div');
        newFeature.className = 'feature-item';
        newFeature.innerHTML = `
            <h3>新功能</h3>
            <p>这是一个动态添加的功能示例</p>
        `;
        
        // 添加动画效果
        newFeature.style.opacity = '0';
        newFeature.style.transform = 'translateY(20px)';
        newFeature.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        featuresContainer.appendChild(newFeature);
        
        // 触发动画
        setTimeout(() => {
            newFeature.style.opacity = '1';
            newFeature.style.transform = 'translateY(0)';
        }, 100);
    }
}

/**
 * 示例：表单处理函数
 * @param {Event} e - 表单提交事件
 */
function handleFormSubmit(e) {
    e.preventDefault();
    // 这里可以添加表单处理逻辑
    alert('表单提交成功！');
}

/**
 * 示例：API调用函数
 */
async function fetchData() {
    try {
        // 这里可以添加真实的API调用
        // const response = await fetch('https://api.example.com/data');
        // const data = await response.json();
        
        // 模拟API响应
        const mockData = { message: '数据获取成功！', timestamp: new Date().toLocaleString() };
        alert(JSON.stringify(mockData, null, 2));
    } catch (error) {
        console.error('获取数据失败:', error);
        alert('获取数据失败，请稍后重试');
    }
}
