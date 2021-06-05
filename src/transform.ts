import cheerio from 'cheerio'
import Response from '@layer0/core/router/Response'
import Request from '@layer0/core/router/Request'
import { injectBrowserScript } from '@layer0/starter'
import { parse } from 'path'

export default function transform(response: Response, request: Request) {
  // inject browser.ts into the document returned from the origin
  injectBrowserScript(response)

  if (response.body) {
    const $ = cheerio.load(response.body)
    // console.log("Transform script running on '"+response.req.originalUrl+"'") // for testing

    // Those 2 scripts are added using server side transformation just for Proof of Concept purposes.
    // For production those 2 scripts should be included in original website base code.
    $('head').append(`
      <script src="/__layer0__/cache-manifest.js" defer="defer"></script>
      <script src="/main.js" defer="defer"></script>
    `)

    $('a[href^="https://www.mcafee.com"]').map((i, el) => {
      var link = $(el).attr('href') || '';
      $(el).attr('href', link.replace(/.+\.com\//, '/'));
    })

    $('.cmp-loader').remove()

    $('#banner .bg-stretch').map((i, el) => {
      var imageURL = $(el).children('img').attr('src');
      var style = `background-image: url("${imageURL}"); background-size: cover; background-position: center center; background-repeat: no-repeat;`
      $(el).attr('style', style);
    })

    $('v-lazy-image').slice(0,3).map((i, el) => {
      var imageURL = $(el).attr('src');
      $(el).parent().append(`<img class="v-lazy-image v-lazy-image-loaded" src="${imageURL}"/>`)
      $(el).remove()
    })

    var price = '',
        savings = '',
        retailPrice = '';

    $('#mtp-title + p + p[v-if^="digitalData.offersGroup.dropdownSelected =="]').remove()

    $('script:contains("var digitalData = {")').map((i, el) => {
      var scriptRaw = $(el).html() || '';
      var script = scriptRaw.replace('var digitalData = ','')
      var scriptJSON = JSON.parse(script)

      var priceRaw = script.match(/digitalData.offers.o3.finalPriceAfterCashback=\\"([^\\]+)/) || '';
      price = priceRaw[1]

      var savingsRaw = script.match(/digitalData.offers.o3.discountAmountAfterCashback=\\"([^\\]+)/) || '';
      savings = savingsRaw[1]

      var retailPriceRaw = script.match(/digitalData.offers.o3.retailPrice=\\"([^\\]+)/) || '';
      retailPrice = retailPriceRaw[1]

    })


    response.body = $.html()
                      .replace(/https:\/\/www\.mcafee\.com\//g, '/')
                      .replace("{{finalPriceAfterCashback(digitalData.offersGroup.dropdownSelected)}}", price)
                      .replace("{{retailPrice(digitalData.offersGroup.dropdownSelected)}}", retailPrice)
                      .replace("{{discountedAmountAfterCashback(digitalData.offersGroup.dropdownSelected)}}", savings)

  }
}
