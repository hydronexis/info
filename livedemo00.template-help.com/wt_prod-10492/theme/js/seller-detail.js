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

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');

        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        tabPanels.forEach(function (p) { p.classList.remove('active'); });

        btn.classList.add('active');
        var panel = document.getElementById('tab-' + target);
        if (panel) panel.classList.add('active');
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
        '<p style="text-align:center;padding:60px;">Producto no encontrado. <a href="grid-shop.html">Volver al Marketplace</a></p>';
      return;
    }

    var seller = product.sellers.find(function (s) { return s.id === params.seller; });
    if (!seller) {
      document.getElementById('seller-detail-content').innerHTML =
        '<p style="text-align:center;padding:60px;">Vendedor no encontrado. <a href="' + product.sellersPage + '">Volver a vendedores</a></p>';
      return;
    }

    document.title = seller.name + ' - ' + product.nameEs + ' | Hydronexis';

    /* Breadcrumb */
    var breadcrumb = document.getElementById('detail-breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML =
        '<li><a href="index.html">Home</a></li>' +
        '<li><a href="grid-shop.html">Marketplace</a></li>' +
        '<li><a href="' + product.sellersPage + '">' + product.nameEs + '</a></li>' +
        '<li class="active">' + seller.name + '</li>';
    }

    /* Barra superior del vendedor */
    var topBar = document.getElementById('seller-top-bar');
    if (topBar) {
      topBar.innerHTML =
        '<div class="seller-avatar">' + SELLER_AVATAR_SVG + '</div>' +
        '<span class="seller-name-price">' + seller.name + ': $' + seller.price + ' x Pound</span>' +
        '<div class="seller-chat-icon">' + CHAT_ICON_SVG + '</div>';
    }

    /* Producto: imagen + descripción */
    var productImage = document.getElementById('product-image');
    if (productImage) {
      productImage.src = product.image;
      productImage.alt = product.nameEs;
    }

    var productLabel = document.getElementById('product-label');
    if (productLabel) productLabel.textContent = product.nameEs.toLowerCase();

    var productDesc = document.getElementById('product-description');
    if (productDesc) productDesc.textContent = seller.description;

    var addCart = document.getElementById('btn-add-cart');
    if (addCart) {
      addCart.href = 'cart-page.html';
      addCart.setAttribute('aria-label', 'Añadir ' + product.nameEs + ' de ' + seller.name + ' al carrito');
    }

    /* Info adicional del vendedor */
    var sellerInfo = document.getElementById('seller-extra-info');
    if (sellerInfo) {
      sellerInfo.innerHTML =
        '<strong>Sobre el vendedor:</strong> ' + seller.sellerInfo +
        ' &mdash; <strong>Precio:</strong> $' + seller.price + ' x Pound';
    }

    /* Tab Ubicación - Mapa */
    var mapFrame = document.getElementById('location-map');
    if (mapFrame && seller.location) {
      mapFrame.src = seller.location.embed;
    }

    var locationTitle = document.getElementById('location-title');
    if (locationTitle) {
      locationTitle.textContent = 'Descripción de Ubicación (de dónde ir a adquirirlo o intercambiar depende del caso)';
    }

    var locationDesc = document.getElementById('location-description');
    if (locationDesc && seller.location) {
      locationDesc.innerHTML =
        '<strong>' + seller.location.name + '</strong> &mdash; ' + seller.location.address +
        '<br><br>' + seller.location.directions;
    }

    /* Tab Reviews */
    renderReviews(seller.reviews);
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadDetail();
    initTabs();
    /* Tab Enviar review - prevent actual submit for demo */
    var reviewForm = document.querySelector('.review-form-grid');
    if (reviewForm) {
      reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('¡Gracias por tu review! (demo)');
        reviewForm.reset();
      });
    }
  });
})();
