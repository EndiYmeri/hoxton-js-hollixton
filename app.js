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




state = {

}

function renderHeader() {
    const liElements = ["Girls", "Guys", "Sale"]
    const ShopElements = ["/assets/search.svg", "/assets/account.svg", "/assets/cart.svg"]

    const headerEl = document.createElement('header')
    const logoEl = document.createElement('h1')
    logoEl.textContent = "HOLLXTON"
    const navEl = document.createElement('nav')
    const menuEl = document.createElement('ul')

    for (const li of liElements) {
        const menuItemEl = document.createElement('li')
        const menuItemAnchorEl = document.createElement('a')
        menuItemAnchorEl.setAttribute('href', '#')
        menuItemAnchorEl.textContent = li

        menuItemEl.append(menuItemAnchorEl)
        menuEl.append(menuItemEl)
    }
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

function render() {
    const body = document.querySelector('body')
    body.append(renderHeader())
        // renderHeader()
        // renderMain()
        // renderFooter()
}
render()