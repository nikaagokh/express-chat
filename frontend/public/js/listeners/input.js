export const inputListener = () => {
    document.querySelectorAll('.input-wrapper').forEach(inputWrapper => {
        const parent = inputWrapper.parentElement;
        parent.style.paddingTop = '0.5rem';

        const input = inputWrapper.querySelector('input');
        const groupAppend = inputWrapper.querySelector('.input-meta-left, .input-meta-right');

        if (!groupAppend) {
            input.style.paddingLeft = '1rem';
        }

        let label;
        const placeholder = input.placeholder;
        label = document.createElement('label');
        label.classList.add('input-floating');
        if(!groupAppend) {
            label.classList.add('input-floating-left');
        }
        label.textContent = placeholder;
        inputWrapper.insertBefore(label, input.nextSibling);
        input.addEventListener('focus', () => {
            input.placeholder = '';
            label.style.display = 'block';
        })

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.placeholder = placeholder;
                label.style.display = 'none';
            }
        })
       

        const mandatory = inputWrapper.getAttribute('mandatory-input');
        console.log(mandatory);
        console.log(typeof mandatory);
        if (mandatory !== null) {
            if(mandatory.length === 0) {
                input.addEventListener('blur', () => {
                    console.log(input.value);
                    if (input.value === '') {
                        input.classList.add('border-error');
                    } else {
                        input.classList.remove('border-error');
                    }
                })
    
                input.addEventListener('input', () => {
                    console.log(input.value);
                    if (input.value === '') {
                        input.classList.add('border-error');
                    } else {
                        input.classList.remove('border-error');
                    }
                })
            } else {
                const length = Number(mandatory);
                const errorText = document.createElement('div');
                errorText.classList.add('input-error-text');
                errorText.textContent = `* აუცილებელია მინიმუმ ${length} სიმბოლო`;
                errorText.style.display = 'none';
                inputWrapper.appendChild(errorText);
                input.addEventListener('blur', () => {
                    if (input.value.length < length) {
                        input.classList.add('border-error');
                        errorText.style.display = 'block';
                    } else {
                        input.classList.remove('border-error');
                        errorText.style.display = 'none';
                    }
                })
    
                input.addEventListener('input', () => {
                    console.log(input.value);
                    if (input.value.length < length) {
                        input.classList.add('border-error');
                        errorText.style.display = 'block';
                    } else {
                        input.classList.remove('border-error');
                        errorText.style.display = 'none';
                    }
                })
            }
        }
    })
}