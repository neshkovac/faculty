window.onload = function () {
  articlesOnLoad();
  cartOnLoad();

};


// variables

$productsCollumn = $('#productsCollumn');
$cartWrapper = $('#showCart');
$articles = [];
var articles = [];
var lastID = 0;

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
      if ($('#showCart').html().trim() === "Show cart") {
        $('#showCart').html("Hide cart");
        populateCartTable($articles);
      } else {
        $('#showCart').html("Show cart");
      }
    })
    if(articles.length){
      $('#articlesTable').toggle(200);
    } else{
      $('#articlesTable').setAttribute('display','table');
    }
  })
}

function populateCartTable(ids) {
  let parsedIds = ids.map(function (x) {
    return parseInt(x, 10);
  });
  let tempArr = [];
  let result = ` <tr>
                  <th>Products</th>
                  <th>Quantity</th>
                </tr>`;
  let newData = [];
  let itemsInDdl = `
    <select id="cartDdl" class="cart-ddl"><option value="default" selected>Choose article...</option>`;
  $.get('data/articles.json', function (data) {
    data.forEach((e, i) => {
      tempArr = data.filter(function (item) {
        return parsedIds.includes(item.id);
      });
    });
    tempArr.forEach(e => {
      itemsInDdl += `
          <option data-cartitemid="${e.id}" data-priceunder="${e.priceUnder}"
          data-priceover="${e.priceOver}" class="cart-option" value="${e.name}">${e.name}</option>
        `
    })
    itemsInDdl += `</select>`;
    result += `<tr class="cart-ddl-row"><td>${itemsInDdl}</td><td><input type="text" 
        placeholder="enter quantity" class="cart-ddl-input"></td><td><a href="#" class="btn btn-secondary" id="confirm-cart-item">Add</td></tr>
        `
    $('#cartBody').html(result);
    $('a#confirm-cart-item').click(function (e) {
      e.preventDefault();
      cartDataCheck();
    })
  })
}

function cartDataCheck() {

  if (!$('input.cart-ddl-input').val() == "" && !isNaN($('input.cart-ddl-input').val())) {
    var parsedQuantity = parseInt($('input.cart-ddl-input').val());
  } else {
    alert("Quantity must be numeric value!");
  }

  if (typeof(parsedQuantity) == 'number' && $('select#cartDdl option:selected')[0].index != 0) {
    let inputVal = $('input.cart-ddl-input').val();
    let selectedOptionHTML = $('select#cartDdl option:selected')[0].dataset.cartitemid;
    let selectedOptionPriceUnder = $('select#cartDdl option:selected')[0].dataset.priceunder;
    let selectedOptionPriceOver = $('select#cartDdl option:selected')[0].dataset.priceover;
    let selectedOptionName = $('select#cartDdl option:selected')[0].innerHTML;
    console.log(selectedOptionHTML);
    populateCartArticles(inputVal, selectedOptionHTML,selectedOptionPriceUnder,selectedOptionPriceOver,selectedOptionName);
  } else {
    alert("Select article, please.");
    console.log("Failure!");
    console.log($('input.cart-ddl-input').val());
    console.log($('select#cartDdl'));
  }
}

function populateCartArticles(quantity,id,priceUnder,priceOver,name){
    if(parseInt(quantity,10) <= 10) {
      let price = parseInt(priceUnder,10) * quantity;
      articles.push({
        "id": id,
        "quantity": quantity,
        "lastID": lastID,
        "price": price,
        "name" : name
      });
      lastID++;
      displaySelectedArticles();
    } else {
      let price = parseInt(priceOver,10) * quantity;
      articles.push({
        "id": id,
        "quantity": quantity,
        "lastID": lastID,
        "price": price,
        "name" : name
      });
      lastID++;
      displaySelectedArticles();
    }

    
}

function displaySelectedArticles(){
  let result = ``;
  articles.forEach((e,i) => {
    result+=`
      <tr><td>${++i}.</td><td>${e.name}</td><td>${e.price}</td><td><a class="btn btn-danger cart-item-btn"
       href="#" onclick="removeFromCart(${e.lastID})">-</a></td></tr>
    `
  });
  $('#articlesTable').html(result);
}

function removeFromCart(id){
  articles.filter(x=> x.lastID == id);
  articles.splice(0,1);
  if(!articles.length){
    lastID = 0;
  }
  displaySelectedArticles();
}