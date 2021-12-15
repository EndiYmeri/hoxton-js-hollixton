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
    store: []
}


// Server Functions

function getStoreItemsFromDB() {
    return fetch('http://localhost:3000/store').then(resp => resp.json())
}


// Helper Functions
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

function getItemsByType(type) {
    if (type) {
        return state.store.filter((element) => {
            return type === element.type

        })
    } else return state.store
}

// Render functions
function renderHeader(store) {

    const ShopElements = ["/assets/search.svg", "/assets/account.svg", "/assets/cart.svg"]

    const headerEl = document.createElement('header')
    const logoEl = document.createElement('h1')
    logoEl.textContent = "HOLLXTON"

    logoEl.addEventListener('click', () => render(state.store))


    const navEl = document.createElement('nav')
    const menuEl = document.createElement('ul')

    const liElements = new Set()
    for (const item of store) {
        liElements.add(item.type)

    }
    for (const li of liElements) {
        const menuItemEl = document.createElement('li')
        const menuItemAnchorEl = document.createElement('a')
        menuItemAnchorEl.setAttribute('href', '#')
        menuItemAnchorEl.textContent = li

        menuItemAnchorEl.addEventListener('click', () => {
            render(getItemsByType(li))
        })

        menuItemEl.append(menuItemAnchorEl)
        menuEl.append(menuItemEl)
    }

    const saleMenuItemEl = document.createElement('li')
    const saleMenuItemAnchorEl = document.createElement('a')
    saleMenuItemAnchorEl.setAttribute('href', '#')
    saleMenuItemAnchorEl.textContent = "Sale"

    // saleMenuItemAnchorEl.addEventListener('click', () => {
    //     getItemsByType()
    //     return store.filter((element) => {
    //         if (element.discountedPrice) {
    //             return element
    //         }


    //     })
    // })


    saleMenuItemEl.append(saleMenuItemAnchorEl)
    menuEl.append(saleMenuItemEl)

    const shopButtonsSection = document.createElement('nav')
    shopButtonsSection.setAttribute('class', 'header-shop-buttons')

    for (const shopEl of ShopElements) {

        const shopButton = document.createElement('button')
        const shopButtonImg = document.createElement('img')
        shopButtonImg.setAttribute('src', shopEl)

        shopButton.append(shopButtonImg)
        shopButtonsSection.append(shopButton)
    }
    navEl.append(menuEl)

    headerEl.append(logoEl, navEl, shopButtonsSection)

    return headerEl
}

function renderMain(store) {
    const mainEl = document.createElement('main')

    const pageTitle = document.createElement('h2')
    pageTitle.setAttribute('class', 'page-title')
    pageTitle.textContent = "Home"

    const shopItems = document.createElement('section')
    shopItems.setAttribute('class', 'shop-items-section')

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

    }
    mainEl.append(pageTitle, shopItems)
    return mainEl
}

function render(store) {
    const body = document.querySelector('body')
    body.innerHTML = ""
    body.append(renderHeader(state.store), renderMain(store))
        // renderHeader()
        // renderMain()
        // renderFooter()
}

function init() {
    render(state.store)
    getStoreItemsFromDB().then((store) => {
        state.store = store
        render(state.store)

    })
}
init()