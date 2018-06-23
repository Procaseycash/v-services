export const utils = {
  deepCopy(data) {
    return JSON.parse(JSON.stringify(data))
  },
  scrollToTop(top) {
    const topTop = top || 0
    $(() => {
      const $overview = $('#app')
      $overview.show()
      const height = $(window).scrollTop()
      if (height > 0) {
        $('html, body').animate({
          scrollTop: topTop
        }, 1000)
      }
    })
  }
}

