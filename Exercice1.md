Exercice 1 : Déboguer avec l'IA

Mission : Résoudre les erreurs de ce code avec chatGPT


## Composant Bugué : `add-to-cart-custom.js`

```javascript
define([
    'jquery',
    'Magento_Ui/js/modal/alert',
    'mage/translate'
], function ($, alert, $t) {
    'use strict';

    return function (config, element) {
        
       
        var productId = config.productId;
        var addToCartUrl = configuration.addToCartUrl;
        
        var $button = $('.add-to-cart-btn');
        var $quantityInput = $('#quantity-input');
        
        $button.on('click', function() {
            var quantity = $quantityInput.val();
            
            $.ajax({
                url: addToCartUrl,
                type: 'POST',
                data: {
                    product_id: productId,
                    qty: quantity
                },
                success: function(response) {
                    alert(response.message);
                    
                    $button.animate('success');
                },
                error: function(xhr, status, error) {
                    /onsole.log('Erreur:', error);
                }
            });
        });
        
        $('.product-options').on('change', function() {
            updatePrice();
        });
        
        
        function updateTotal() {
            var price = config.price;
            var qty = $quantityInput.val();
            total = price * qty; // 'total' non déclaré
            $('.total-price').text(total);
        }
        
        
        var viewModel = {
            productName: ko.observable(config.productName),
            addToCart: function() {
                // 'ko' n'est pas importé dans define()
                this.loading(true);
            }
        };
    };
});
```

## Fichier `requirejs-config.js` associé (avec erreurs)

```javascript
var config = {
    map: {
        '*': {
            'addToCartCustom': 'Vendor_Module/js/add-to-cart-custom'
        }
    },
    
    deps: [
        'jquery',
        'knockout' // Manque dans le define() du composant
    ],
    shim: {
        
        'addToCartCustom': {
            deps: ['jquery']
        }
    }
};
```

## Template PHTML (pour contexte)

```php
<div class="product-add-form" data-mage-init='{"addToCartCustom": {"productId": "<?= $product->getId() ?>", "price": "<?= $product->getFinalPrice() ?>"}}'>
    
    <input type="number" id="quantity-input" value="1" />
    
    <button class="add-to-cart-btn" type="button">
        <?= __('Add to Cart') ?>
    </button>
    
    <div class="total-price"></div>
</div>
```
