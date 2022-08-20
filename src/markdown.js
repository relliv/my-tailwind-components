const fs = require("fs")
const path = require("path")

/**
 * Get array of file/folder list from a target directory
 * 
 * @param dirPath 
 * @param fileArray 
 * @returns Array
 * 
 * @source https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js
 */
function getAllFiles(dirPath, fileArray, depth = 0) {
    files = fs.readdirSync(dirPath);

    fileArray = fileArray || [];

    files.forEach(function (file) {
        // ignore this file
        if (file !== 'markdown.js') {
            // get each path
            fileArray.push({
                name: file,
                path: './' + path.join('./src/', dirPath, file).replace(/\\/g, '/'),
                depth: depth
            });
    
            // also get sub-folders and contents
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                fileArray = getAllFiles(dirPath + "/" + file, fileArray, depth + 1);
            }
        }
    })

    return fileArray;
}

/**
 * Update readme content tree
 * 
 * @param newData 
 */
function updateList(newData) {
    fs.readFile('./../README.md', 'utf8', (err, data) => {
        if (err) {
            console.error(err);

            return;
        }

        if (data) {
            const match = data.match('<!-- TABLE_START -->((.|\n|\s|\r)*)<!-- TABLE_END -->');

            if (match && match[1]) {
                data = data.replace(match[1], `\n\n${newData}\n`);

                new Promise(function (resolve, reject) {
                    fs.writeFile('./../README.md', data, 'utf8', function (err) {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });
            }
        }
    });
}
const baseDemoUrl = 'https://egoistdeveloper.github.io/my-tailwind-components/';

const folderTree = getAllFiles('./').map((x) => {
    return `${'\t'.repeat(x.depth)}- [${x.name}](${x.path}) ⚡ [demo](${baseDemoUrl}/${x.path})`;
}).join('\n');

updateList(folderTree);

console.log(folderTree);