const rp = require('request-promise');
const $ = require('cheerio');

const reviewParse = function(url) {
    return rp(url)
    .then(function(html){
    //   const reviewPages = $('a.pageNum', html);
      const reviewContainer = $('div.reviewSelector', html);
      const reviewsDiv = [];
  
      for (let i = 0; i < 10; i++) {
          if (! $('span.noQuotes', reviewContainer[i])[0].children[0]) {
            console.log(url)
            console.log($('span.noQuotes', reviewContainer[i])[0])
          }
          const reviewTitle = $('span.noQuotes', reviewContainer[i])[0].children[0].data
          const reviewText = $('p.partial_entry', reviewContainer[i])[0].children[0].data
          const reviewUserName = $('div.info_text > div', reviewContainer[i])[0].children[0].data
          const reviewDate = $('span.ratingDate', reviewContainer[i])[0].children[0].parent.attribs.title
          const reviewUserAvatar = $('div.ui_avatar.resp > img.basicImg', reviewContainer[i])[0].attribs.src
          reviewsDiv.push({
              'reviewTitle': reviewTitle,
              'reviewText': reviewText,
              'reviewUserName': reviewUserName,
              'reviewDate': reviewDate,
              'reviewUserAvatar': reviewUserAvatar
          });
      }
      return reviewsDiv;
    })
    .catch(function(err){
      console.error(err);
  });
  };
  
module.exports = reviewParse;
