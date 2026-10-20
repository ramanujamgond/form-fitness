import {test} from 'node:test';
import assert from 'node:assert/strict';
import {betterAuth} from 'better-auth';
import {memoryAdapter} from 'better-auth/adapters/memory';
import {generateKeyPair,exportJWK,SignJWT} from 'jose';
import {hashPassword} from 'better-auth/crypto';
import {googleAuthOptions,googleConfigured} from '../server/google.js';
import {accountPanel} from '../web/accounts.js';

const origin='http://localhost:3000',env={GOOGLE_CLIENT_ID:'test.apps.googleusercontent.com',GOOGLE_CLIENT_SECRET:'test-only-secret'};
test('Google login is advertised only when both server credentials are configured',()=>{
 assert.equal(googleConfigured({}),false);
 assert.equal(googleConfigured({GOOGLE_CLIENT_ID:env.GOOGLE_CLIENT_ID}),false);
 assert.equal(googleConfigured(env),true);
 const props={cloudReady:true,emailReady:true,mode:'signin'};
 assert.ok(!accountPanel(props).includes('data-action="googlelogin"'));
 assert.ok(accountPanel({...props,googleReady:true}).includes('data-action="googlelogin"'));
 assert.ok(accountPanel({...props,mode:'signup',emailReady:false,googleReady:true}).includes('data-action="googlelogin"'));
 assert.ok(!accountPanel({...props,mode:'forgot',googleReady:true}).includes('data-action="googlelogin"'));
});

test('real OAuth callback links matching verified accounts, preserves PIN, isolates new users, and rejects unverified emails',async()=>{
 const db={user:[],account:[],session:[],verification:[]};
 const now=new Date();
 db.user.push({id:'existing-user',name:'Existing name',email:'existing@example.com',emailVerified:true,createdAt:now,updatedAt:now});
 const password=await hashPassword('012345');
 db.account.push({id:'pin-account',accountId:'existing-user',providerId:'credential',userId:'existing-user',password,createdAt:now,updatedAt:now});
 const auth=betterAuth({baseURL:origin,basePath:'/api/auth',secret:'test-secret-that-is-at-least-32-characters',database:memoryAdapter(db),...googleAuthOptions(env),emailAndPassword:{enabled:true,minPasswordLength:6,requireEmailVerification:true},rateLimit:{enabled:false},advanced:{database:{validateSchema:false}}});
 const {privateKey,publicKey}=await generateKeyPair('RS256');
 const jwk={...await exportJWK(publicKey),kid:'test-key',alg:'RS256',use:'sig'};
 let identity={sub:'google-existing',email:'existing@example.com',email_verified:true,name:'Google name'};
 const originalFetch=globalThis.fetch;
 globalThis.fetch=async(input,init)=>{
  const url=String(input instanceof Request?input.url:input);
  if(url==='https://oauth2.googleapis.com/token'){
   assert.ok(String(init.body).includes('code_verifier='),'OAuth must use PKCE');
   const id_token=await new SignJWT(identity).setProtectedHeader({alg:'RS256',kid:'test-key'}).setIssuer('https://accounts.google.com').setAudience(env.GOOGLE_CLIENT_ID).setIssuedAt().setExpirationTime('5m').sign(privateKey);
   return Response.json({access_token:'test-access',token_type:'Bearer',expires_in:300,id_token});
  }
  if(url==='https://www.googleapis.com/oauth2/v3/certs')return Response.json({keys:[jwk]});
  throw Error('Unexpected external request in isolated test: '+url);
 };
 const post=(path,body,cookie='')=>auth.handler(new Request(origin+'/api/auth/'+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,Cookie:cookie},body:JSON.stringify(body)}));
 const cookies=res=>res.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
 const login=async()=>{
  const start=await post('sign-in/social',{provider:'google',callbackURL:origin+'/',newUserCallbackURL:origin+'/',errorCallbackURL:origin+'/?flow=google',disableRedirect:true});
  assert.equal(start.status,200);
  const url=new URL((await start.json()).url);
  assert.equal(url.searchParams.get('redirect_uri'),origin+'/api/auth/callback/google');
  const callback=await auth.handler(new Request(origin+'/api/auth/callback/google?code=test-code&state='+encodeURIComponent(url.searchParams.get('state')),{headers:{Cookie:cookies(start)}}));
  return callback;
 };
 try{
  const linked=await login();
  assert.equal(linked.status,302);
  assert.equal(linked.headers.get('location'),origin+'/');
  const session=await auth.api.getSession({headers:new Headers({Cookie:cookies(linked)})});
  assert.equal(session.user.id,'existing-user');
  assert.equal(session.user.name,'Existing name');
  assert.equal(db.user.length,1,'Matching email must never create a duplicate user');
  assert.ok(db.account.some(a=>a.providerId==='google'&&a.userId==='existing-user'));
  const pin=await post('sign-in/email',{email:'existing@example.com',password:'012345'});
  assert.equal(pin.status,200,'The original PIN must still work');
  assert.equal((await pin.json()).user.id,'existing-user');
  identity={sub:'google-new',email:'new@example.com',email_verified:true,name:'New user'};
  const created=await login();
  assert.equal(created.headers.get('location'),origin+'/');
  const newSession=await auth.api.getSession({headers:new Headers({Cookie:cookies(created)})});
  assert.notEqual(newSession.user.id,'existing-user');
  assert.equal(newSession.user.email,'new@example.com');
  assert.equal(db.user.length,2);
  identity={sub:'google-unverified',email:'existing@example.com',email_verified:false,name:'Unverified'};
  const denied=await login();
  assert.ok(denied.headers.get('location').includes('error=account_not_linked'));
  assert.ok(!db.account.some(a=>a.accountId==='google-unverified'));
  db.user.push({id:'pending-user',name:'Unverified local signup',email:'pending@example.com',emailVerified:false,createdAt:now,updatedAt:now});
  identity={sub:'google-pending',email:'pending@example.com',email_verified:true,name:'Pending'};
  const pending=await login();
  assert.ok(pending.headers.get('location').includes('error=account_not_linked'),'Unverified local accounts must verify first');
  // State cannot be forged to bypass the OAuth exchange.
  const forged=await auth.handler(new Request(origin+'/api/auth/callback/google?code=test-code&state=forged'));
  assert.equal(forged.status,302);
  assert.ok(!db.account.some(a=>a.accountId==='google-pending'));
 }finally{globalThis.fetch=originalFetch;}
});
