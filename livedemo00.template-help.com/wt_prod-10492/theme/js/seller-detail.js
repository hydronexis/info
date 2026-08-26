/**
 * Seller Detail Page - Carga dinámica de datos y tabs
 */
(function () {
  'use strict';

  function getParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      product: params.get('product'),
      seller: params.get('seller')
    };
  }

  function initTabs() {
    var tabBtns = document.querySelectorAll('.seller-tab-btn');
    var tabPanels = document.querySelectorAll('.seller-tab-panel');

    function activateTab(btn) {
        var target = btn.getAttribute('data-tab');

        tabBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
          b.tabIndex = -1;
        });
        tabPanels.forEach(function (p) {
          p.classList.remove('active');
          p.hidden = true;
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        btn.tabIndex = 0;
        var panel = document.getElementById('tab-' + target);
        if (panel) {
          panel.classList.add('active');
          panel.hidden = false;
        }
    }

    tabBtns.forEach(function (btn, index) {
      btn.tabIndex = btn.classList.contains('active') ? 0 : -1;
      btn.addEventListener('click', function () {
        activateTab(btn);
      });
      btn.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        var offset = event.key === 'ArrowRight' ? 1 : -1;
        var next = tabBtns[(index + offset + tabBtns.length) % tabBtns.length];
        activateTab(next);
        next.focus();
      });
    });
  }

  function renderReviews(reviews) {
    var container = document.getElementById('reviews-list');
    if (!container || !reviews) return;

    container.innerHTML = reviews.map(function (review) {
      return (
        '<div class="review-item">' +
          '<div class="review-avatar">' + SELLER_AVATAR_SVG + '</div>' +
          '<div class="review-body">' +
            '<div class="review-header">' +
              '<div class="review-author-stars">' +
                '<span class="review-author">' + review.author + '</span>' +
                '<span class="review-stars">' + renderStars(review.stars) + '</span>' +
              '</div>' +
              '<span class="review-date">' + review.date + '</span>' +
            '</div>' +
            '<p class="review-text">' + review.text + '</p>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function loadDetail() {
    var params = getParams();
    var product = MARKETPLACE_DATA[params.product];
    if (!product) {
      document.getElementById('seller-detail-content').innerHTML =
        '<p style="text-align:center;padding:60px;">Product not found. <a href="grid-shop.html">Back to Marketplace</a></p>';
      return;
    }

    var seller = product.sellers.find(function (s) { return s.id === params.seller; });
    if (!seller) {
      document.getElementById('seller-detail-content').innerHTML =
        '<p style="text-align:center;padding:60px;">Seller not found. <a href="' + product.sellersPage + '">Back to sellers</a></p>';
      return;
    }

    document.title = seller.name + ' - ' + product.name + ' | Hydronexis';

    /* Breadcrumb */
    var breadcrumb = document.getElementById('detail-breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML =
        '<li><a href="index.html">Home</a></li>' +
        '<li><a href="grid-shop.html">Marketplace</a></li>' +
        '<li><a href="' + product.sellersPage + '">' + product.name + '</a></li>' +
        '<li class="active">' + seller.name + '</li>';
    }

    /* Seller top bar */
    var topBar = document.getElementById('seller-top-bar');
    if (topBar) {
      var avatarMarkup = seller.photo
        ? '<div class="seller-avatar"><img src="' + seller.photo + '" alt="' + seller.name + '"></div>'
        : '<div class="seller-avatar">' + SELLER_AVATAR_SVG + '</div>';

      topBar.innerHTML =
        avatarMarkup +
        '<span class="seller-name-price">' + seller.name + ': $' + seller.price + ' per pound</span>' +
        '<div class="seller-chat-icon">' + CHAT_ICON_SVG + '</div>';
    }

    /* Product image + description */
    var productImage = document.getElementById('product-image');
    if (productImage) {
      productImage.src = product.image;
      productImage.alt = product.name;
    }

    var productLabel = document.getElementById('product-label');
    if (productLabel) productLabel.textContent = product.name.toLowerCase();

    var productDesc = document.getElementById('product-description');
    if (productDesc) productDesc.textContent = seller.description;

    var addCart = document.getElementById('btn-add-cart');
    if (addCart) {
      addCart.href = 'cart-page.html';
      addCart.setAttribute('aria-label', 'Add ' + product.name + ' from ' + seller.name + ' to cart');
      addCart.dataset.cartProductId = product.id;
      addCart.dataset.cartSellerId = seller.id;
      addCart.dataset.cartSellerName = seller.name;
      addCart.dataset.cartProductName = product.name;
      addCart.dataset.cartImage = product.image;
      addCart.dataset.cartDisplayPrice = seller.price;
    }

    var contactSeller = document.getElementById('btn-contact-seller');
    if (contactSeller) {
      contactSeller.href = 'hydrochat.html?mode=purchase&product=' +
        encodeURIComponent(product.id) + '&seller=' + encodeURIComponent(seller.id) +
        '&productName=' + encodeURIComponent(product.name) +
        '&sellerName=' + encodeURIComponent(seller.name) +
        '&price=' + encodeURIComponent(seller.price);
    }

    var startExchange = document.getElementById('btn-start-exchange');
    if (startExchange) {
      startExchange.href = 'exchanges.html?product=' + encodeURIComponent(product.id) +
        '&seller=' + encodeURIComponent(seller.id);
    }

    /* Seller extra info */
    var sellerInfo = document.getElementById('seller-extra-info');
    if (sellerInfo) {
      sellerInfo.innerHTML =
        '<strong>About the seller:</strong> ' + seller.sellerInfo +
        ' &mdash; <strong>Price:</strong> $' + seller.price + ' per pound';
    }

    /* Location map */
    var mapFrame = document.getElementById('location-map');
    if (mapFrame && seller.location) {
      mapFrame.src = seller.location.embed;
    }

    var locationTitle = document.getElementById('location-title');
    if (locationTitle) {
      locationTitle.textContent = 'Location description (where to pick it up or exchange it depends on the case)';
    }

    var locationDesc = document.getElementById('location-description');
    if (locationDesc && seller.location) {
      locationDesc.innerHTML =
        '<strong>' + seller.location.name + '</strong> &mdash; ' + seller.location.address +
        '<br><br>' + seller.location.directions;
    }

    /* Reviews */
    renderReviews(seller.reviews);
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadDetail();
    initTabs();
  });
})();
