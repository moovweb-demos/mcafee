import cheerio from 'cheerio'
import Response from '@layer0/core/router/Response'
import Request from '@layer0/core/router/Request'
import { injectBrowserScript } from '@layer0/starter'

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

    // your transformations go here
    // ...
    // ...

    $('a[href^="https://www.mcafee.com"]').map((i, el) => {
      var link = $(el).attr('href') || '';
      $(el).attr('href', link.replace(/.+\.com\//, '/'));
    })

    response.body = $.html()
                      .replace(/https:\/\/www\.mcafee\.com\//g, '/')

  }
}
