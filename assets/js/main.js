window.onload = function() {
  articlesOnLoad();
  cartOnLoad();

};


// variables

$productsCollumn = $('#productsCollumn');
$cartWrapper = $('#showCart');
$articles = [];

// end of variables


function articlesOnLoad() {
  $.get('data/articles.json', function(data) {
    populateArticles(data);
  });
}

function populateArticles(data) {
  var result = ``;

  data.forEach(a => {
    result += `
        <div class="col-md-6 text-center single-article-wrapper">
          <h5 class="single-article-heading">${a.name}</h5>
          <a class="btn btn-primary add-to-cart-btn" href="#" data-articleid="${a.id}">Add to cart</a><a class="btn btn-important remove-from-articles" href="#" data-removeid="${a.id}">-</a>

        </div> <!-- end of single article -->
    `
  });

  $productsCollumn.html(result);

  $('.add-to-cart-btn').click(bindOnClick);
}

function bindOnClick(e) {
  e.preventDefault();
  this.classList.add('disabled');
  $articles.push(this.dataset.articleid);



}

function cartOnLoad() {
  $cartWrapper.click(function() {
      $('#cartTable').toggle(200, function(){
        if ($('#showCart').html().trim() == "Show cart") {
          $('#showCart').html("Hide cart");
        } else {
          $('#showCart').html("Show cart");
        }
      })
    })
  };
