function searchToggle() {
  let search = document.querySelector(".search-wrapper");
  search.classList.toggle("active");
}
function viewCart() {
  let buttonViewCart = document.querySelector(".shopping");
  buttonViewCart.classList.toggle("active");
}
const getData = async () => {
  let result;
  await fetch("js/data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      result = data;
    });
  return result;
};
// Render Menu
const renderMenu = async (data) => {
  const content = data.Products.map((item) => {
    if (item.Categories === "Menu") {
      return ` <div class="menu__item">
                  <div class="menu__text">
                      <img src="${item.image}" alt="" class="menu__img">
                      <h3 class="menu__title">${item.title}
                      </h3>
                      <div class="menu__price price">$${item.price} <span class="menu__price--old old">$${item.oldPrice}</span></div>
                      <button class="btn menu__button shoppingcart" data-id="${item.id}">Add To Cart</button>
                  </div>
              </div>`;
    }
  }).join("");
  let productsMenu = document.querySelector("#render-menu");
  productsMenu.innerHTML = content;
};
// Shopping cart
const renderCount = () => {
  let listId = getLocalstorage();
  let viewCount = document.querySelector("#view-cart");
  viewCount.innerHTML = listId.length;
};
const deleteProduct = (event, data) => {
  let listId = getLocalstorage();
  const findIndex = listId.findIndex((p) => p.id == event.target.dataset.id);
  listId.splice(findIndex, 1);
  setLocalstorage(listId);
  renderShopping(data);
  renderCount();
};
const renderShopping = (data) => {
  const listId = getLocalstorage();
  const arrSp = listId.map((item) => {
    const findItem = data.find((p) => p.id == item.id);
    if (findItem != undefined) {
      return { ...findItem, quantity: item.quantity };
    }
  });
  let priceAll = 0;
  const content = arrSp
    .map((item) => {
      priceAll += item.price;
      return `<div class="shopping__item">
    <div class="shopping__item--left">
      <div class="shopping__item--img">
        <img
          src="${item.image}"
          alt=""
        />
      </div>
      <div class="shopping__item--intro">
        <div class="shopping__item--name">
          ${item.title}
        </div>
        <div class="shopping__item--price">
          <span>${item.quantity} x </span>${item.price}&nbsp;₫
        </div>
      </div>
    </div>
    <div class="shopping__item--right">
      <i class="fa fa-trash-alt delete-cart" data-id="${item.id}"></i>
    </div>
  </div>`;
    })
    .join("");
  document.querySelector(".shopping__total").innerHTML = priceAll;
  const shoppingProduct = document.querySelector(".shopping__products");
  shoppingProduct.innerHTML = content;
  const deleteAll = document.querySelectorAll(".delete-cart");
  deleteAll.forEach((item) =>
    item.addEventListener("click", (event) => {
      deleteProduct(event, data);
    })
  );
};
const addProductCart = (event, data) => {
  const id = event.target.dataset.id;
  let dataShopping = getLocalstorage();
  const index = dataShopping.findIndex((item) => item.id == id);
  if (index != -1) {
    dataShopping[index].quantity++;
    localStorage.setItem("shopping-cart", JSON.stringify(dataShopping));
  } else {
    localStorage.setItem(
      "shopping-cart",
      JSON.stringify([...getLocalstorage(), { id, quantity: 1 }])
    );
  }
  renderShopping(data);
  renderCount();
};
const setLocalstorage = (arr) => {
  localStorage.setItem("shopping-cart", JSON.stringify(arr));
};
const getLocalstorage = () => {
  let data = localStorage.getItem("shopping-cart");
  return data != undefined ? JSON.parse(data) : [];
};
// Render
const renderProducts = (data) => {
  const content = data.Products.map((item) => {
    if (item.Categories === "Products") {
      return `<div class="products__item">
      <div class="products__social">
        <i class="fa fa-shopping-cart shoppingcart" data-id="${item.id}"></i>
        <i class="fa fa-heart"></i>
        <i class="fa fa-eye"></i>
      </div>
      <div class="products__img">
        <img src="${item.image}" alt="" />
      </div>
      <h3 class="products__title">${item.title}</h3>
      <div class="star">
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star-half-alt"></i>
      </div>
      <div class="price">$${item.price} <span class="old">$${item.oldPrice}</span></div>
    </div>`;
    }
  }).join("");
  let productsEle = document.querySelector("#render-products");
  productsEle.innerHTML = content;
  const addCart = document.querySelectorAll(".shoppingcart");
  addCart.forEach((item) =>
    item.addEventListener("click", (event) => {
      addProductCart(event, data.Products);
    })
  );
};
//Render search

const renderSearch = (data) => {
  const content = data
    .map((item) => {
      return ` <div class="coffee">
    <img src="${item.image}" alt="" />
    <div class="coffee-info">
      <div class="coffee-name">${item.title}</div>
      <div class="coffee-price">$${item.price}</div>
    </div>
    <div class="coffee-buy"><i class="fa fa-cart-plus"></i></div>
  </div>`;
    })
    .join("");
  let productsSearch = document.querySelector("#render-search");
  productsSearch.innerHTML = content;
};
function search(e, data) {
  let txtSearch = e.target.value.trim();
  let newData =
    txtSearch == ""
      ? []
      : data.Products.filter((item) =>
          item.title.toUpperCase().includes(txtSearch.toUpperCase())
        );
  renderSearch(newData);
}
var searchInput = document.querySelector("#filter");
(async () => {
  const data = await getData();
  searchInput.addEventListener("keyup", (event) => {
    search(event, data);
  });
  renderMenu(data);
  renderProducts(data);
  renderShopping(data.Products);
  renderCount();
})();
