const scrapy = require('node-scrapy');
var movieArray = [];
const fs = require('fs');
const json2csv = require('json2csv');
const movie = require('./movie');
const url = "https://www.themoviedb.org/movie/now-playing?language=es";
const container = ".results";


var model =  {

  titles: `${container} .title`,
  points: `${container} .vote_average`,
  images:  {
    selector: `${container} img`,
    get: 'data-src',
  },
  overviews: `${container} .overview`,
  links:{
    selector: `${container} .view_more a`,
    get: 'href',
    prefix: "https://www.themoviedb.org"
  }

}
scrapy.scrape(url, model, function(err, data) {
    if (err) return console.error(err);
    for(var i = 0; i < model.titles.length; i++){

        movieArray.push(new movie.Movie(data.titles[i], data.images[i], data.overviews[i], data.points[i], data.links[i]));
    }
    console.log(movieArray);


    var fields = ['title', 'image', 'overview', 'points', 'link'];
    var fieldNames = ['Title', 'Image', 'Overview', 'Points', 'Link'];
    var opts = {
      data: movieArray,
      fields: fields,
      fieldNames: fieldNames,
      quotes: ''
    };
    var csv = json2csv(opts);
    fs.writeFile('movies.csv', csv, function(err) {
      if (err) throw err;
      console.log('file saved');
    });

});
