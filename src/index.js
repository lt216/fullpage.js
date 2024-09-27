class FullPage {
  constructor() {
    const parentElement = document.getElementById("section2")
    this.sections = parentElement.children
    this.currentSection = 0
    this.isScrolling = false
    this.bindEvents()
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
