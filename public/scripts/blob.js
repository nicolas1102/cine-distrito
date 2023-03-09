const blob = document.getElementById('blob');

window.onpointermove = event => {
    const { clientX, clientY } = event;

    
    blob.animate({
        left: `${clientX}px`,
        top: `${clientY + window.scrollY}px`
    }, { duration: 15000, fill: "forwards" });
}