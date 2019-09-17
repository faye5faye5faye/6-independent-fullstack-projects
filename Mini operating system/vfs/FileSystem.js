// FileSystem.js
// =============
const moment = require('moment');



const obj = require('./init.json'); 

class FileSystem {
    constructor() {
        /*    Params: obj representing the virtual file system */
        this.obj = obj; 
    }

    find(path) {
        /*    Params:  query path.
         *    Example:
         *       /path/to/this/file
         *       ['', 'path', 'to', 'this', 'file']
         */
        let curr = this.obj['fs']; 

        path.forEach((elem) => {
            if(elem === ''){
                curr = curr['/']; 
            }else if (curr.hasOwnProperty('files')){
                
                if(curr['files'].hasOwnProperty(elem)){
                    curr = curr['files'][elem]; 
                }else{
                    curr = null; 
                }
                
            }

        }); 
        return curr; 
    }

    traverseAndList(path){
        /* Params:
         *    A list of directoies destructured from the path.
         */
        const arr = []; 
        const curr = this.find(path); 
        if(curr !== null){
            if(curr.hasOwnProperty('files')){
                for(const e in curr['files']){
                    arr.push(e); 
                }
            }
        }
        return arr; 
    }

    makeDirectory(path, dirName) {
        /* Params:
         *    A list of directoies destructured from the path,
         *    the directory name that is going to create
         *    Example:
         *       /path/to/this/file
         *       ['', 'path', 'to', 'this', 'file']
         */
        const curr = this.find(path);
        if(curr && curr.hasOwnProperty('files')){
            if(!curr['files'].hasOwnProperty(dirName)){
                const obj = {}; 
                obj['permission'] = "drwxr--r--"; 
                obj['hard-links'] = 1; 
                obj['owner-name'] = 'root'; 
                obj['owner-group'] = 'root'; 
                obj['last-modified'] = moment().format('MMM DD HH:mm'); 
                obj['size'] = 6; 
                obj['files'] = {}; 
                curr['files'][dirName] = obj; 
                return 0; 
            }
            return 1;
        }
        return 2; 
    }

    cat(path) {
        /* Params:
         *    A list of directoies destructured from the path.
         *    Example:
         *       /path/to/this/file
         *       ['', 'path', 'to', 'this', 'file']
         */
        const curr = this.find(path); 
        let content; 
        if(curr !== null){
            if(!curr.hasOwnProperty('files')){
                content = curr['content']; 
                return content; 
            }else{
                return 'cat: It is not a file'; 
            }
        }else{
            return 'cat: No such file or directory';
        }
    }

    // dfs
    tree(path){
        const curr = this.find(path); 
        if(curr !== null && curr.hasOwnProperty('files')){
            const output = this.helper(curr, 0); 
            const arr = output.split('\n'); 

            const newArr = arr.filter((elem)=>{if(elem !== ''){return true;}})
                              .reduce((acc, elem) => {
                                const buffer = elem.split(' '); 
                                const obj = {}; 
                                
                                obj['level'] = buffer[0]; 
                                obj['name'] = buffer[1]; 
                                acc.push(obj);
                                return acc;
                            }, []); 

            return newArr; 
        }else{
            return []; 
        }
    }

    // helper function for function tree
    helper(obj, level){
        if(!obj.hasOwnProperty('files')){
            return ''; 
        }

        let buffer = '';  

        for(const e in obj['files']){
            buffer += level + ' ' + e + '\n'; 
            buffer += this.helper(obj['files'][e], level + 1);
        }

        return buffer; 
    }

    write(path, content) {
        /* Params:
         *    A list of directoies destructured from the path,
         *    and the content ready to be written to the file
         *    Example:
         *       /path/to/this/file
         *       ['', 'path', 'to', 'this', 'file']
         */
        const dir = path.slice(0, -1); 
        const file = path[path.length - 1]; 

        const curr = this.find(dir); 
        if(curr !== null){
            if(curr.hasOwnProperty('files')){
                let flag = false; 
                for(const e in curr['files']){
                    console.log(e); 
                    if(e === file && curr['files'][e]['permission'][0] === '-'){
                        curr['files'][e]['content'] = content;  
                        flag = true; 
                    }
                }

                if(!flag){
                    const newFile = {}; 
                    newFile['permission'] = "-rwxr--r--"; 
                    newFile['hard-links'] = 1; 
                    newFile['owner-name'] = 'root'; 
                    newFile['owner-group'] = 'root'; 
                    newFile['last-modified'] = moment().format('MMM DD HH:mm'); 
                    newFile['size'] = 'root'; 
                    newFile['content'] = content; 
                    curr['files'][file] = newFile; 
                }
            }
            // to tell the function calling write() that the file is updated/created successfully
            return true; 
        }
        // to tell the function sth wrong happens
        return false; 
    }
}





module.exports = {
    FileSystem, 
}; 


