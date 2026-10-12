// Per-tab drafts stay local and are isolated by account, day, exercise and set.
export function draftKey(scope,date,id,index){return `form-draft:${scope}:${date}:${id}:${index}`;}
export function readDraft(storage,key){try{return JSON.parse(storage.getItem(key))||null;}catch{return null;}}
export function writeDraft(storage,key,data){try{storage.setItem(key,JSON.stringify(data));}catch{}}
export function clearDraft(storage,key){try{storage.removeItem(key);}catch{}}
