window.onload = function(){
  articlesOnLoad();
};


// variables

$productsWrapper = $("#productsRow");

// end of variables


function articlesOnLoad(){
  $.get('data/articles.json',function(data){
      populateArticles(data);
  });
}

function populateArticles(data){
  var result = ``;

  data.forEach( a => {
    result+=`
        <div class="col-md-4 text-center single-article-wrapper">
          <h5 class="single-article-heading">${a.name}</h5>
          <a class="btn btn-default" href="#" data-productid="${a.id}">Add to cart</a>
        </div> // end of single article
    `
  });

  $productsWrapper.html(result);
}
