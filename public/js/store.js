if(document.readyState == 'loading')
{
    document.addEventListener('DOMContentLoaded', ready)
}
else
{
    ready()
}

function ready()
{
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for(var i=0; i < removeCartItemButtons.length; i++)
    {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for(var i=0; i < quantityInputs.length; i++)
    {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++)
        {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function removeCartItem(event)
{
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event)
{
    var input = event.target
    if(isNaN(input.value) || input.value <= 0)
    {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event)
{
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-img')[0].src
    var id = shopItem.dataset.itemId
    addItemToCart(title, price, imageSrc, id)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc, id)
{
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId = id
    var cartImgBar = document.getElementsByClassName('cart-img-bar')[0]
    var cartItemTitle = cartImgBar.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemTitle.length; i++)
    {
        if (cartItemTitle[i].innerText == title)
        {
            alert('This item is already added to the cart. Increase the quantity in the cart to purchase more.')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item">
            <img class="shop-item-img" src="${imageSrc}">
            <div class="item-info">
                    <p class="shop-item-title cart-item-title">${title}</p>
                </div>
            </div>
            <div class="cart-quantity">
                <div class="price">
                    <span>Price: </span>${price}
                </div>
                <div class="quantity">
                    Quantity:
                    <input class="cart-quantity-input" type="number" value="1">
                </div>
                <div class="remove">
                    <button class="btn btn-danger" type="button">REMOVE</button>
                </div>
            </div>`
    cartRow.innerHTML = cartRowContents
    cartImgBar.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal()
{
    var cartItemContainer = document.getElementsByClassName('cart-img-bar')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for(var i=0; i < cartRows.length; i++)
    {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('Price: Rs. ',''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total*100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = 'Rs. ' + total
}

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'auto',
    token: function(token) {
        var items = []
        var cartItemContainer = document.getElementsByClassName('cart-img-bar')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-row')
        for (var i = 0; i < cartRows.length; i++)
        {
            var cartRow = cartRows[i]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            var quantity = quantityElement.value
            var id = parseInt(cartRow.dataset.itemId)
            items.push({
                id: id,
                quantity: quantity
            })
        }

        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items: items
            })
        }).then(function() {
            alert('Successfully purchased items')
            while (cartItemContainer.hasChildNodes())
            {
                cartItemContainer.removeChild(cartItemContainer.firstChild)
            }
            updateCartTotal()
        }).catch(function(error) {
            console.error(error)
        })
    }
})

function purchaseClicked()
{
    var priceElement = document.getElementsByClassName('cart-total-price')[0]
    var price = parseFloat(priceElement.innerText.replace('Rs. ','')*100)
    console.log(price)
    stripeHandler.open({
        amount: price,
        currency: 'inr'
    })
}