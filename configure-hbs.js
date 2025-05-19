import hbs from 'hbs';
import { __dirname } from './app.js';
import fs from 'fs';
import path from 'path';

export const configureHbs = () => {
    hbs.registerHelper('compare', function (v1, operator, v2, options) {
        console.log(v1)
        function compareHelper(v1, operator, v2) {
            switch (operator) {
                case '==':
                    return (v1 == v2);
                case '===':
                    return (v1 === v2);
                case '!=':
                    return (v1 != v2);
                case '!==':
                    return (v1 !== v2);
                case '<':
                    return (v1 < v2);
                case '<=':
                    return (v1 <= v2);
                case '>':
                    return (v1 > v2);
                case '>=':
                    return (v1 >= v2);
                case '&&':
                    return (v1 && v2);
                case '||':
                    return (v1 || v2);
                default:
                    return false;
            }
        }

        if (compareHelper(v1, operator, v2)) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    hbs.registerHelper('ifArrayOne', function(array, options) {
        if(array && array.length > 1) {
            return options.fn(this);
        } else if(array && array.length === 0) {
            return options.inverse(this);
        }
    })

    hbs.registerHelper('getLength', function(array) {
        return array.length;
    })

    hbs.registerHelper('fullName', function (fname, lname) {
        return fname +  ' ' + lname;
    })

    hbs.registerHelper('pathActive', function(pathname, path) {
        if(pathname === path) {
            return 'myinfo-button-active';
        }
    })

    hbs.registerHelper('footerActive', function(pathname, path) {
        if(pathname === path) {
            return 'footer-button-active';
        }
    })

    hbs.registerHelper('detectMode', function (mode) {
        if (mode === 'dark') {
            return 'dark';
        } else {
            return 'light';
        }
    })

    hbs.registerHelper("isChecked", function (mode) {
        if (mode === 'dark') {
            return 'checked';
        } else {
            return ''
        }
    })

    hbs.registerHelper('getDate', function (dateString) {
        if(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
        } else {
            return 'ულიმიტო';
        }
    })

    hbs.registerHelper('toDate', function(dateString) {
        const date = new Date(dateString);

        // Extract day, month, and year
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getUTCFullYear();
    
        // Format the date as dd.mm.yyyy
        return `${day}.${month}.${year}`;
    })

    hbs.registerHelper('notEmpty', function(products, options) {
        if(!products) {
            return options.inverse(this);
        }
        if (products.length > 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    })
}

export const registerPartials = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            registerPartials(filePath); // Recursively register partials
        } else if (file.endsWith('.hbs')) {
            const partialName = path.relative(path.join(__dirname, 'src/views/partials'), filePath)
                .replace(/\\/g, '/') // Normalize for Windows
                .replace('.hbs', ''); // Remove .hbs extension
            console.log('Registering partial:', partialName); // Debugging
            const content = fs.readFileSync(filePath, 'utf8');
            hbs.registerPartial(partialName, content); // Register partial
        }
    });
}