// Isolated test harness. This server refuses remote databases and never sends email.
import {createServer} from 'node:http';
import nodemailer from 'nodemailer';
if(!/^postgres(?:ql)?:\/\/[^/]+@127\.0\.0\.1:55432\//.test(process.env.DATABASE_URL||''))throw Error('Cloud tests require the isolated localhost:55432 database.');
const mails=[];
nodemailer.createTransport=()=>({sendMail:async message=>{mails.push(message);return {accepted:message.to,rejected:[]};},close(){}});
const {appHandler}=await import('../scripts/dev.mjs');
createServer((req,res)=>{
 if(req.url==='/_test/mail'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(mails));}
 return appHandler(req,res);
}).listen(3002,'127.0.0.1',()=>console.log('Isolated cloud test server: http://localhost:3002'));
