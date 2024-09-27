class FullscreenScroll {
  constructor() {
    const parentElement = document.getElementById("section2")
    this.sections = parentElement.children
    this.currentSection = 0
    this.currentSectionRect = {}
    this.isScrolling = false
    this.bindEvents()
  }

  bindEvents() {
    window.addEventListener("wheel", (event) => this.onScroll(event), {
      passive: false
    })
    window.addEventListener("keydown", (event) => this.onKeydown(event))
  }

  onScroll(event) {
    event.preventDefault()
    if (this.isScrolling) return

    const direction = event.deltaY > 0 ? 1 : -1
    this.scrollToSection(this.currentSection + direction)
  }

  onKeydown(event) {
    if (this.isScrolling) return

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
    )
      return

    this.isScrolling = true
    this.currentSection = index

    this.currentSectionRect =
      this.sections[this.currentSection].getBoundingClientRect()

    console.log(this.currentSectionRect, "react")
    this.sections[index].scrollIntoView({ behavior: "smooth" })

    await this.waitForScrollComplete()
    this.isScrolling = false
  }

  waitForScrollComplete() {
    return new Promise((resolve) => {
      const checkScroll = () => {
        const section = this.sections[this.currentSection]
        const { top } = section.getBoundingClientRect()

        if (Math.abs(top) < 1) {
          resolve()
        } else {
          requestAnimationFrame(checkScroll)
        }
      }
      requestAnimationFrame(checkScroll)
    })
  }
}

// 导出插件
export default FullscreenScroll
