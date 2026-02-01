const fs = require('fs');
const path = 'c:\\Users\\admin\\Desktop\\work\\projects\\tarang thermodynamics\\src\\pages\\HeatTransfer.tsx';
console.log('Reading file...');
let content = fs.readFileSync(path, 'utf8');

const startMarker = 'const Cp = 4186; // J/kgK (Water)';
const endMarker = 'const qRadiation = radiationParams.emissivity * sigma * (Math.pow(radiationParams.tempSurface, 4) - Math.pow(radiationParams.tempSurr, 4));';

console.log('Searching for markers...');
const start = content.indexOf(startMarker);
console.log('Start index:', start);

if (start !== -1) {
    const end = content.indexOf(endMarker, start);
    console.log('End index:', end);

    if (end !== -1) {
        const toDeleteLength = (end + endMarker.length) - start;
        console.log('Deleting ' + toDeleteLength + ' chars');
        const newContent = content.substring(0, start) + content.substring(end + endMarker.length);
        fs.writeFileSync(path, newContent);
        console.log('Successfully deleted duplicate block.');
    } else {
        console.log('End marker not found.');
    }
} else {
    console.log('Start marker not found.');
}
