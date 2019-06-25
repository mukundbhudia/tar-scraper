const rp = require('request-promise');
const $ = require('cheerio');

const reviewParse = function(url) {
    return rp(url)
    .then(function(html){
      const reviewContainer = $('div.reviewSelector', html);
      const reviewsDiv = [];
      console.log('Processing and collecting: ' + reviewContainer.length + ' reviews')

      for (let i = 0; i < reviewContainer.length; i++) {
          const reviewTitle = $('span.noQuotes', reviewContainer[i])[0].children[0].data
          const reviewText = $('p.partial_entry', reviewContainer[i])[0].children[0].data
          const reviewUserName = $('div.info_text > div', reviewContainer[i])[0].children[0].data
          const reviewDate = $('span.ratingDate', reviewContainer[i])[0].children[0].parent.attribs.title
          const reviewUserAvatar = $('div.ui_avatar.resp > img.basicImg', reviewContainer[i])[0].attribs.src
          const reviewRating = $('span.ui_bubble_rating', reviewContainer[i])[0].attribs.class

          const outOfFiveRating = (reviewRating.match(/\d+/)[0]) / 10

          reviewsDiv.push({
              'reviewTitle': reviewTitle,
              'reviewText': reviewText,
              'reviewUserName': reviewUserName,
              'reviewDate': reviewDate,
              'reviewUserAvatar': reviewUserAvatar,
              'outOfFiveRating': outOfFiveRating
          });
      }
      return reviewsDiv;
    })
    .catch(function(err){
      console.error(err);
  });
};
  
module.exports = reviewParse;
