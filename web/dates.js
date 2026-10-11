export function validDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;}
export function validBreak(start,end){return validDate(start)&&validDate(end)&&end>=start&&(Date.parse(end)-Date.parse(start))/86400000<=365;}
