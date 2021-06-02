import install from '@layer0/prefetch/window/install'
import installDevtools from '@layer0/devtools/install'

async function lateLoadContent() {
  const url = '/content' + window.location.pathname
  const res = await fetch(url)
  const html = await res.text()
  const root = document.createElement('html')
  root.innerHTML = html
  const elements = Array.from(document.querySelectorAll('[data-moov-replace]'))
  const personalizedElements = Array.from(root.querySelectorAll('[data-moov-replace]'))

  for (let i = 0; i < personalizedElements.length; i++) {
    const el = personalizedElements[i]

    for (let { name, value } of Array.from(el.attributes)) {
      elements[i].setAttribute(name, value)
    }

    elements[i].innerHTML = el.innerHTML
  }
}

document.addEventListener('DOMContentLoaded', function () {

  // The XDN Devtools is a widget that helps developers understand how their site interacts with the XDN
  // For more details see - https://developer.moovweb.com/guides/devtools
  // Comment out for easier speed measurements
  // installDevtools()

  // @ts-ignore
  install({

    includeCacheMisses: true, // DISABLE THIS LINE IN PRODUCTION

    // watch: [
    //   {
    //     selector: '.child-loaded',
    //     callback: (el) => {
    //       const url = el.getAttribute('href')
    //       if (url) prefetch(url, 'fetch')
    //     },
    //   },
    //   {
    //     selector: '[mw-data-src]',
    //     callback: el => {
    //       el.setAttribute('src', el.getAttribute('mw-data-src'))
    //     }
    //   },
    // ],

  })

  // if (window.location.pathname.indexOf('/content') !== 0) {
  //   lateLoadContent()
  // }
})
