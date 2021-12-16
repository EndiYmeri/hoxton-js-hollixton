// Instructions
// - You will start from scratch, with only the product data avaialble
// - You will have to work on the HTML, the CSS, the JS. Note that it doesn't need to look identical.
// - Build a homepage, where you can see all products
//     - A product should display:
//         - an image
//         - name of the item
//         - its price and a discount if available
//         - a "new!" tag if the item was added less than 10 days ago
// - Clicking on an product should take you to a detail page for it
//     - On this page, clicking on the ADD TO BAG button should:
//         - add the item to the bag the first time
//         - increase the quantity of this item in the bag subsequent times
// - There should be a menu at the top with:
//     - 3 links to filter pages: Girls, Guys, Sale
//     - 3 links to modals: Search, Profile/Sign-in, Bag
// - About the search modal:
//     - Typing something in the search modal should apply a search to any view
//     - The current search should be displayed on the page, and the user should be able to clear it
// - About the profile modal:
//     - When the user clicks on this icon, they will get a sign-in or profile modal, depending on whether they are signed in already or not
//     - The profile modal will greet them by name and allow them to sign out
//     - The sign in modal allows them to sign in or create a new account if they don't have one
// - About the cart modal:
//     - Users can see every product in the bag, how many of each, and their price, including discount
//     - Users can remove an item from the bag
//     - Users can see the total at the end 




const state = {
    store: [],
    typeSelected: null,
    saleSelected: false,
    selectedProductID: null,
    cart: [],
    totalCartItemsCount: 0,
    totalPrice: 0,
    searchModal: false,
    accountModal: false,
    cartModal: false,
    userSignedIn: false
}

// Server Functions
function getStoreItemsFromDB() {
    return fetch('http://localhost:3000/store').then(resp => resp.json())
}


// Helper Functions
// Check if item is new or not
function isItemNew(product) {
    const daysToConsider = 10

    // check how many ms are there in 10 days
    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const day = hour * 24

    const msForTenDaysAgo = Date.now() - day * daysToConsider

    // get ms for current product
    const msForProductDate = Date.parse(product.dateEntered)
        // check if the product ms is more recent than 10 days ago
    return msForProductDate > msForTenDaysAgo
}

// Get elemennts that we want to show when using filters
function getProductsToShow() {

    let productsToShow = state.store

    if (state.selectedProductID) {
        productsToShow = productsToShow.filter((product) => {
            return state.selectedProductID === product.id
        })
    } else {

        if (state.typeSelected) {
            productsToShow = productsToShow.filter((product) => {
                return state.typeSelected === product.type
            })

        }
        if (state.saleSelected) {
            productsToShow = productsToShow.filter((product) => {
                if (product.discountedPrice) {
                    return product
                }
            })
        }
    }

    return productsToShow
}

// Add item to cart,creating a cart array and decrease the stock 
function addItemToCart(product) {
    if (product.stock > 0) {
        product.stock--
            if (!state.cart.includes(product)) {
                product.count = 1
                state.cart.push(product)
                state.totalCartItemsCount++
            } else {
                product.count++;
                state.totalCartItemsCount++
            }
    }
}

function removeItemFromCart(product) {
    if (product.count > 0) {
        product.stock++;
        product.count--
            state.totalCartItemsCount--
    }
}

function getCartTotalPrice() {
    state.totalPrice = 0
    for (const item of state.cart) {
        if (item.discountedPrice) {
            state.totalPrice += item.count * item.discountedPrice
        } else {

            state.totalPrice += item.count * item.price
        }
    }
    return state.totalPrice
}

// Go Home
function goHome() {
    state.typeSelected = null
    state.saleSelected = false
    state.selectedProductID = null
    state.searchModal = false
    state.accountModal = false
    state.cartModal = false
    render()
}

// Render functions
// Render Header
function renderHeader(store) {
    const headerEl = document.createElement('header')
    const logoEl = document.createElement('h1')
    logoEl.textContent = "HOLLXTON"

    logoEl.addEventListener('click', () => {
        goHome()
    })

    const navEl = document.createElement('nav')
    const menuEl = document.createElement('ul')

    const liElements = new Set()
    for (const item of store) {
        liElements.add(item.type)
    }
    for (const li of liElements) {
        menuEl.append(renderMenuLiElements(li))
    }

    const saleMenuItemEl = document.createElement('li')
    const saleMenuItemAnchorEl = document.createElement('a')
    saleMenuItemAnchorEl.setAttribute('href', '#')
    saleMenuItemAnchorEl.textContent = "Sale"

    saleMenuItemAnchorEl.addEventListener('click', () => {
        state.saleSelected = !state.saleSelected
        render()
    })


    saleMenuItemEl.append(saleMenuItemAnchorEl)
    menuEl.append(saleMenuItemEl)



    navEl.append(menuEl)

    headerEl.append(logoEl, navEl, renderShopButtonsSection())

    return headerEl
}

// Render Main
function renderMain(store) {
    const mainEl = document.createElement('main')

    const pageTitle = document.createElement('h2')
    pageTitle.setAttribute('class', 'page-title')
    pageTitle.textContent = "Home"

    const shopItems = document.createElement('section')
    shopItems.setAttribute('class', 'shop-items-section')

    if (state.selectedProductID) {
        shopItems.setAttribute('class', `shop-single item-${state.selectedProductID}`)
        shopItems.append(renderSingleItem(store[0]))

    } else {
        for (let product of store) {

            const cardEl = document.createElement('div')
            cardEl.setAttribute('class', 'item-card')

            if (isItemNew(product)) {
                cardEl.classList.add('new-item')
            }

            const productImage = document.createElement('img')
            productImage.setAttribute('class', 'product-image')
            productImage.setAttribute('src', product.image)

            const productTitle = document.createElement('h3')
            productTitle.textContent = product.name

            const productPrice = document.createElement('p')

            const regularPrice = document.createElement('span')
            regularPrice.setAttribute('class', 'regular-price')
            regularPrice.textContent = `£${product.price}`

            productPrice.append(regularPrice)

            if (product.discountedPrice) {
                regularPrice.setAttribute('class', 'regular-price-with-sale')
                const salePrice = document.createElement('span')
                salePrice.setAttribute('class', 'sale-price')
                salePrice.textContent = `£${product.discountedPrice}`
                productPrice.append(salePrice)
            }
            cardEl.append(productImage, productTitle, productPrice)
            shopItems.append(cardEl)

            cardEl.addEventListener('click', () => {
                state.selectedProductID = product.id
                state.searchModal = false
                state.accountModal = false
                state.cartModal = false
                render()
            })

            if (!product.stock) {
                const productOutOfStock = document.createElement('p')
                productOutOfStock.setAttribute('class', 'out-of-stock-notice')
                productOutOfStock.innerText = "Product out of Stock"
                cardEl.prepend(productOutOfStock)

                productTitle.classList.add('out-of-stock-title')

            }
        }
    }


    mainEl.append(pageTitle, shopItems, renderCart(), renderAccountModal())
    return mainEl
}
// Render Menu List Elements
function renderMenuLiElements(li) {
    const menuItemEl = document.createElement('li')
    const menuItemAnchorEl = document.createElement('a')
    menuItemAnchorEl.setAttribute('href', '#')
    menuItemAnchorEl.textContent = li

    menuItemAnchorEl.addEventListener('click', () => {
        if (state.typeSelected !== li) {
            state.typeSelected = li
            state.selectedProductID = null
            state.searchModal = false
            state.accountModal = false
            state.cartModal = false
            render()
        } else {
            state.typeSelected = null
            state.selectedProductID = null
            state.searchModal = false
            state.accountModal = false
            state.cartModal = false
            render()
        }
    })
    menuItemEl.append(menuItemAnchorEl)
    return menuItemEl
}
// Render Shop Buttons Section
function renderShopButtonsSection() {

    const shopButtonsSection = document.createElement('nav')
    shopButtonsSection.setAttribute('class', 'header-shop-buttons')

    const shopSearchButton = document.createElement('button')
    const shopAccountButton = document.createElement('button')
    const shopCartButton = document.createElement('button')



    const shopSearchButtonImg = document.createElement('img')
    const shopAccountButtonImg = document.createElement('img')
    const shopCartButtonImg = document.createElement('img')
    const shopCartItemsCount = document.createElement('span')

    shopCartItemsCount.innerText = state.totalCartItemsCount

    shopSearchButtonImg.setAttribute('src', '/assets/search.svg')
    shopAccountButtonImg.setAttribute('src', '/assets/account.svg')
    shopCartButtonImg.setAttribute('src', '/assets/cart.svg')
    shopCartItemsCount.setAttribute('class', 'cart-items-count')


    shopSearchButton.append(shopSearchButtonImg)
    shopAccountButton.append(shopAccountButtonImg)


    shopAccountButton.addEventListener('click', () => {
        state.searchModal = false
        state.accountModal = !state.accountModal
        state.cartModal = false
        render()
    })

    shopCartButton.addEventListener('click', () => {
        state.searchModal = false
        state.accountModal = false
        state.cartModal = !state.cartModal
        render()
    })

    shopCartButton.append(shopCartButtonImg, shopCartItemsCount)
    shopButtonsSection.append(shopSearchButton, shopAccountButton, shopCartButton)

    return shopButtonsSection
}

// Render Single Item Page
function renderSingleItem(product) {
    const shopSingleItem = document.createElement('div')
    shopSingleItem.setAttribute('class', 'shop-single-item')

    const productImage = document.createElement('img')
    productImage.setAttribute('src', product.image)

    const productInfo = document.createElement('div')
    const productTitle = document.createElement('h1')
    productTitle.setAttribute('class', 'single-product-title')
    productTitle.innerText = product.name

    const productPrice = document.createElement('p')

    const regularPrice = document.createElement('span')
    regularPrice.setAttribute('class', 'regular-price')
    regularPrice.textContent = `£${product.price}`

    productPrice.append(regularPrice)

    if (product.discountedPrice) {
        regularPrice.setAttribute('class', 'regular-price-with-sale')
        const salePrice = document.createElement('span')
        salePrice.setAttribute('class', 'sale-price')
        salePrice.textContent = `£${product.discountedPrice}`
        productPrice.append(salePrice)
    }

    const addToCartButton = document.createElement('button')
    addToCartButton.setAttribute('class', 'add-to-cart-button')

    addToCartButton.innerText = "Add item to cart"
    addToCartButton.addEventListener('click', () => {
        addItemToCart(product)
        render()
    })
    if (!product.stock) {
        const productOutOfStock = document.createElement('p')
        productOutOfStock.innerText = "Product out of Stock"

        productInfo.prepend(productOutOfStock)

        productTitle.classList.add('out-of-stock-title')
        addToCartButton.classList.add('out-of-stock-button')

    }

    productInfo.append(productTitle, productPrice, addToCartButton)
    shopSingleItem.append(productImage, productInfo)
    return shopSingleItem
}

function renderCart() {
    const cartModalEl = document.createElement('div')
    cartModalEl.setAttribute('class', 'modal')

    if (state.cartModal) {
        cartModalEl.classList.add('modal-active')
    }
    const modalTitle = document.createElement('h2')
    modalTitle.textContent = "Cart"

    const purchaseButton = document.createElement('button')
    purchaseButton.setAttribute('class', 'purchase-button')
    purchaseButton.innerText = `Pay: £${state.totalPrice}`

    if (state.totalCartItemsCount === 0) {
        const cartEmpty = document.createElement('h3')
        cartEmpty.textContent = "Cart is Empty"
        cartModalEl.append(modalTitle, cartEmpty)

    } else {
        const cartItems = document.createElement('ul')
        cartItems.setAttribute('class', 'cart-items')
        for (const product of state.cart) {
            const cartItem = document.createElement('li')
            cartItem.setAttribute('class', 'cart-item')


            const cartProductImage = document.createElement('img')
            cartProductImage.setAttribute('src', product.image)

            const cartProductInfo = document.createElement('div')
            const cartProductName = document.createElement('h3')
            cartProductName.textContent = product.name

            const productPrice = document.createElement('p')
            const regularPrice = document.createElement('span')
            regularPrice.setAttribute('class', 'regular-price')
            regularPrice.textContent = `£${product.price}`

            const itemCount = document.createElement('span')
            itemCount.setAttribute('class', 'cart-item-count')
            itemCount.textContent = `(x${product.count})`

            productPrice.append(regularPrice, itemCount)

            if (product.discountedPrice) {
                regularPrice.setAttribute('class', 'regular-price-with-sale')
                const salePrice = document.createElement('span')
                salePrice.setAttribute('class', 'sale-price')
                salePrice.textContent = `£${product.discountedPrice}`
                productPrice.append(salePrice, itemCount)
            }

            cartProductInfo.append(cartProductName, productPrice)

            const removeItemButton = document.createElement('button')
            removeItemButton.setAttribute('class', 'remove-item-button')
            removeItemButton.textContent = "X"
            removeItemButton.addEventListener('click', () => {
                removeItemFromCart(product)
                render()
                if (state.selectedProductID) {
                    renderSingleItem(product)
                } else {
                    state.selectedProductID = null
                }
            })

            cartItem.append(cartProductImage, cartProductInfo, removeItemButton)
            cartItems.append(cartItem)
        }


        cartModalEl.append(modalTitle, cartItems, purchaseButton)

    }
    return cartModalEl
}

function renderAccountModal() {
    const accountModalEl = document.createElement('div')
    accountModalEl.setAttribute('class', 'modal')
    if (state.accountModal) {
        accountModalEl.classList.add('modal-active')
    }
    const modalTitle = document.createElement('h2')
    modalTitle.textContent = "Sign In"

    if (!state.userSignedIn) {

        accountModalEl.append(modalTitle)
    } else {

        accountModalEl.append(modalTitle)
    }


    return accountModalEl
}

function render() {
    const body = document.querySelector('body')
    body.innerHTML = ""
    getCartTotalPrice()
    body.append(renderHeader(state.store), renderMain(getProductsToShow()))
}

function init() {
    render()
    getStoreItemsFromDB().then((store) => {
        state.store = store
        render()

    })
}
init()