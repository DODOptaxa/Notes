function createColorPicker(containerInput, defaultColor = '#ffffff', callback) {
    let containers = [];

    if (typeof containerInput === 'string') {
        containers = document.querySelectorAll(containerInput);
    } else if (containerInput instanceof Element) {
        containers = [containerInput];
    } else if (containerInput instanceof HTMLCollection || Array.isArray(containerInput) || containerInput instanceof NodeList) {
        containers = [...containerInput];
    }

    if (!containers.length) return;

    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    containers.forEach(container => {
        const wrapper = document.createElement("div");
        wrapper.className = "color-picker-wrapper";

        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.className = "color-input";
        colorInput.value = defaultColor;
        colorInput.title = defaultColor;

        colorInput.addEventListener("input", () => {
            colorInput.title = colorInput.value; 
            if (typeof callback === 'function') {
                callback(colorInput.value); 
            }
        });

        colorInput.addEventListener("click", (e) => {
            e.stopPropagation(); 
        });

        colorInput.addEventListener("touchstart", (e) => {
            e.preventDefault(); 
            e.stopPropagation(); 
            if (isIOS()) {
 
                colorInput.focus();
                setTimeout(() => colorInput.click(), 0); 
            }
        });

        wrapper.appendChild(colorInput);
        container.appendChild(wrapper);
    });
}