let generalTickets = [];
let preferentialTickets = [];
const chairsElements = document.querySelectorAll('.chair');
const generalPriceSummaryElement = document.querySelector('#general-price-summary');
const preferentialPriceSummaryElement = document.querySelector('#preferential-price-summary');
const totalPriceElement = document.querySelector('#tickets-total-price');
const priceGeneral = +chairsElements[0].dataset.price;
const pricePreferential = +chairsElements[41].dataset.price;
let totalGeneralTickets = 0;
let totalPreferentialTickets = 0;
let totalTickets = 0;


function selectChair(event) {
    const selectedChair = event.target;

    if (selectedChair.dataset.status !== 'unavailable') {
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
    }
}


chairsElements.forEach(chairsElement => {
    chairsElement.addEventListener('click', selectChair);
});