const chairsElements = document.querySelectorAll('.chair');
const generalPriceSummaryElement = document.querySelector('#general-price-summary');
const preferentialPriceSummaryElement = document.querySelector('#preferential-price-summary');
const totalPriceElement = document.querySelector('#tickets-total-price');
const addTicketsToCartButtonElement = document.querySelector('#tickets-summary-section #add-tickets-to-cart');
const cartBadgeElements2 = document.querySelectorAll('.nav-items .badge');
const priceGeneral = +chairsElements[0].dataset.price;
const pricePreferential = +chairsElements[41].dataset.price;
let totalGeneralTickets = 0;
let totalPreferentialTickets = 0;
let totalTickets = 0;
let generalTickets = [];
let preferentialTickets = [];

function selectChair(event) {
    const selectedChair = event.target;
    if (selectedChair.dataset.status === 'available') {

        if (selectedChair.dataset.ispreferential === "true") {
            preferentialTickets.push({
                row: selectedChair.dataset.row,
                column: selectedChair.dataset.column,
                price: pricePreferential,
            });

            totalPreferentialTickets = +(pricePreferential * preferentialTickets.length);

            preferentialPriceSummaryElement.innerHTML = `<span class="tittle-span">Preferential: </span>${preferentialTickets.length} Tickets x ${pricePreferential} COP (${totalPreferentialTickets} COP)`;
        } else if (selectedChair.dataset.ispreferential === "false") {
            generalTickets.push({
                row: selectedChair.dataset.row,
                column: selectedChair.dataset.column,
                price: priceGeneral,
            });

            totalGeneralTickets = +(priceGeneral * generalTickets.length);

            generalPriceSummaryElement.innerHTML = `<span class="tittle-span">General: </span>${generalTickets.length} Tickets x ${priceGeneral} COP (${totalGeneralTickets} COP)`;
        }

        selectedChair.classList = 'chair selected';
        selectedChair.dataset.status = 'selected';
    } else if (selectedChair.dataset.status === 'selected') {

        if (selectedChair.dataset.ispreferential === "true") {

            preferentialTickets = preferentialTickets.filter(ticket => (ticket.row !== selectedChair.dataset.row) || ((ticket.row === selectedChair.dataset.row) && (ticket.column !== selectedChair.dataset.column)));

            totalPreferentialTickets = totalPreferentialTickets - pricePreferential;

            preferentialPriceSummaryElement.innerHTML = `<span class="tittle-span">Preferential: </span>${preferentialTickets.length} Tickets x ${pricePreferential} COP (${totalPreferentialTickets} COP)`;
        } else if (selectedChair.dataset.ispreferential === "false") {

            generalTickets = generalTickets.filter(ticket => (ticket.row !== selectedChair.dataset.row) || ((ticket.row === selectedChair.dataset.row) && (ticket.column !== selectedChair.dataset.column)));

            totalGeneralTickets = totalGeneralTickets - priceGeneral;

            generalPriceSummaryElement.innerHTML = `<span class="tittle-span">General: </span>${generalTickets.length} Tickets x ${priceGeneral} COP (${totalGeneralTickets} COP)`;
        }

        selectedChair.classList = 'chair available';
        selectedChair.dataset.status = 'available';
    }

    totalTickets = totalGeneralTickets + totalPreferentialTickets;

    totalPriceElement.innerHTML = `<span>Total: ${totalTickets} COP</span>`;

    if (generalTickets.length === 0 && preferentialTickets.length === 0) {
        addTicketsToCartButtonElement.disabled = true;
        addTicketsToCartButtonElement.style.opacity = '0.5';
    } else {
        addTicketsToCartButtonElement.disabled = false;
        addTicketsToCartButtonElement.style.opacity = '1';
    }
}

async function addTicketsToCart() {
    const csrfToken = addTicketsToCartButtonElement.dataset.csrf;
    const showId = addTicketsToCartButtonElement.dataset.showid;
    const generalTicketProductId = addTicketsToCartButtonElement.dataset.generalticketproductid;
    const preferentialTicketProductId = addTicketsToCartButtonElement.dataset.preferentialticketproductid;
    let response;
    try {
        response = await fetch(`/movies/shows/${showId}`, {
            method: 'POST',
            body: JSON.stringify({
                showId: showId,
                generalTickets: generalTickets,
                preferentialTickets: preferentialTickets,
                generalTicketProductId: generalTicketProductId,
                preferentialTicketProductId: preferentialTicketProductId,
                _csrf: csrfToken,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        alert('Something went wrong!');
        return;
    }
    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }
    const responseData = await response.json();
    // alert(responseData.message);

    cartBadgeElements.forEach(cartBadgeElement => {
        cartBadgeElement.textContent = +cartBadgeElement.textContent + (generalTickets.length + preferentialTickets.length);
    });
    window.location.href = "/cart";
}

chairsElements.forEach(chairsElement => {
    if (chairsElement.dataset.status !== 'unavailable' && chairsElement.dataset.status !== 'pending') {
        chairsElement.dataset.status = 'available';
        chairsElement.classList = 'chair available';
    }
    chairsElement.addEventListener('click', selectChair);
});
addTicketsToCartButtonElement.addEventListener('click', addTicketsToCart);