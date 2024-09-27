class FullPage {
  constructor() {
    const parentElement = document.getElementById("section2")
    this.sections = parentElement.children
    this.currentSection = 0
    this.isScrolling = false
    this.dots = [] // 存储圆点元素
    this.labels = [] // 存储文字元素
    this.bindEvents()
    this.createDots() // 创建圆点
    this.setupObserver()
  }

  debounce(func, wait) {
    let timeout

    return function (...args) {
      const context = this

      if (!timeout) {
        func.apply(context, args) // 第一次调用时立即执行
      }

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        timeout = null // 重置 timeout
      }, wait)
    }
  }

  createDots() {
    const dotContainer = document.createElement("div")
    dotContainer.style.position = "fixed"
    dotContainer.style.right = "20px"
    dotContainer.style.top = "50%"
    dotContainer.style.transform = "translateY(-50%)"
    document.body.appendChild(dotContainer) // 将容器添加到 body

    Array.from(this.sections).forEach((section, index) => {
      const dot = document.createElement("div")
      dot.className = "dot"
      dot.id = `dot-${index}` // 自动生成 ID
      dot.style.width = "6px" // 小点的宽度
      dot.style.height = "6px" // 小点的高度
      dot.style.backgroundColor = "white" // 圆点颜色
      dot.style.borderRadius = "50%" // 圆形
      dot.style.margin = "15px 0" // 圆点间距
      dot.style.cursor = "pointer"
      dot.style.transition = "transform 0.2s, background-color 0.2s" // 添加平滑过渡效果
      dot.style.position = "relative" // 设置相对定位

      // 增加可点击区域
      const clickArea = document.createElement("div")
      clickArea.style.position = "absolute"
      clickArea.style.width = "20px" // 可点击区域宽度
      clickArea.style.height = "20px" // 可点击区域高度
      clickArea.style.top = "-8px" // 调整位置
      clickArea.style.left = "-8px" // 调整位置
      clickArea.style.cursor = "pointer"
      clickArea.addEventListener("click", () => {
        this.scrollToSection(index)
      })

      dot.appendChild(clickArea) // 将可点击区域添加到圆点中
      dotContainer.appendChild(dot) // 将圆点添加到容器
      this.dots.push(dot) // 保存圆点引用

      // 创建文字元素
      const label = document.createElement("div")
      label.textContent = section.getAttribute("data-label") || ``
      label.style.position = "absolute"
      label.style.right = "12px" // 文字位置
      label.style.top = "50%"
      label.style.transform = "translateY(-50%)"
      label.style.color = "white" // 文字颜色
      label.style.fontSize = "10px"
      label.style.opacity = "0" // 初始不显示
      label.style.transition = "opacity 0.2s" // 添加过渡效果
      label.style.whiteSpace = "nowrap" // 不换行

      dot.appendChild(label) // 将文字添加到圆点中
      this.labels.push(label) // 保存文字引用

      // 添加 hover 效果
      dot.addEventListener("mouseenter", () => {
        dot.style.transform = "scale(1.5)" // 鼠标悬停时放大
        dot.style.backgroundColor = "rgba(255, 255, 255, 0.5)" // 改变背景颜色
        label.style.opacity = "1" // 鼠标悬停时显示文字
      })
      dot.addEventListener("mouseleave", () => {
        this.updateDots() // 鼠标离开时恢复状态
        label.style.opacity = "0" // 鼠标离开时隐藏文字
      })
    })

    this.updateDots() // 初始化时更新圆点状态
  }

  updateDots() {
    // 更新圆点状态
    this.dots.forEach((dot, index) => {
      dot.style.transform =
        index === this.currentSection ? "scale(1.5)" : "scale(1)" // 当前点变大
    })
  }

  bindEvents() {
    window.addEventListener(
      "wheel",
      this.debounce((event) => this.onScroll(event), 50)
    )
    window.addEventListener(
      "keydown",
      this.debounce((event) => this.onKeydown(event), 100)
    )
  }

  onScroll(event) {
    if (this.isScrolling) return
    this.isScrolling = true

    const direction = event.deltaY > 0 ? 1 : -1
    this.scrollToSection(this.currentSection + direction)
  }

  onKeydown(event) {
    if (this.isScrolling) return
    this.isScrolling = true

    switch (event.key) {
      case "ArrowDown":
      case "PageDown":
        this.scrollToSection(this.currentSection + 1)
        break
      case "ArrowUp":
      case "PageUp":
        this.scrollToSection(this.currentSection - 1)
        break
    }
  }

  async scrollToSection(index) {
    if (
      index < 0 ||
      index >= this.sections.length ||
      index === this.currentSection
    ) {
      this.isScrolling = false
      return
    }

    this.currentSection = index
    const targetSection = this.sections[index]
    targetSection.scrollIntoView({ behavior: "smooth" })

    this.updateDots() // 更新圆点状态

    // 等待滚动完成
    await new Promise((resolve) => setTimeout(resolve, 500)) // 根据实际情况调整延迟时间
    this.isScrolling = false
  }

  setupObserver() {
    const options = { threshold: 1 }

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const newIndex = Array.from(this.sections).indexOf(entry.target)
          if (newIndex !== this.currentSection) {
            this.currentSection = newIndex
            console.log(`当前可见部分是: ${entry.target.textContent}`)
            this.updateDots() // 更新圆点状态
          }
        }
      })
    }

    const observer = new IntersectionObserver(callback, options)
    Array.from(this.sections).forEach((section) => observer.observe(section))
  }
}

// 导出插件
export default FullPage

// 在页面加载时实例化 FullPage 类
document.addEventListener("DOMContentLoaded", () => {
  new FullPage()
})
