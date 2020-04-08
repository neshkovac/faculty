window.onload = function () {
  articlesOnLoad();
  cartOnLoad();

};


// variables

$productsCollumn = $('#productsCollumn');
$cartWrapper = $('#showCart');
$articles = [];

// end of variables


function articlesOnLoad() {
  $.get('data/articles.json', function (data) {
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
  populateCartTable($articles);



}

function cartOnLoad() {
  $cartWrapper.click(function () {
    $('#cartTable').toggle(200, function () {
      if ($('#showCart').html().trim() == "Show cart") {
        $('#showCart').html("Hide cart");
        populateCartTable($articles);
      } else {
        $('#showCart').html("Show cart");
      }
    })
  })
};

function populateCartTable(ids) {
  let parsedIds = ids.map(function (x) {
    return parseInt(x, 10);
  });
  var tempArr = [];
  let result = ``;
  let newData = [];
  let itemsInDdl = `<select id="cartDdl" class="cart-ddl"><option value="default" selected>Choose article...</option>`;
  $.get('data/articles.json', function (data) {
    data.forEach((e, i) => {
      tempArr = data.filter(function (item) {
        return parsedIds.includes(item.id);
      });
    });
    tempArr.forEach(e => {
      itemsInDdl += `
          <option data-cartitemid="${e.id}" class="cart-option" value="${e.name}">${e.name}</option>
        `
    })
    itemsInDdl += `</select>`;
    result += `<tr class="cart-ddl-row"><td>${itemsInDdl}</td><td><input type="text" 
        placeholder="enter quantity" class="cart-ddl-input"></td></tr>
        `
    $('#cartBody').html(result);
  })

}