import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path:path.resolve(process.cwd(),'.env')});
dotenv.config({path:path.resolve(here,'../../.env')});
const dataPath=path.resolve(here,'../data/site.json');
const seedPath=path.resolve(here,'../data/site.seed.json');
const uploadsDir=path.resolve(here,'../uploads');
const PORT=Number(process.env.PORT||4000);
const origin=process.env.SITE_ORIGIN||'http://localhost:5173';
const prod=process.env.NODE_ENV==='production';
if(!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD.includes('replace-with')) {
  console.error('Set secure ADMIN_PASSWORD and SESSION_SECRET in .env before running SPG. See .env.example');
  process.exit(1);
}
const app=express();
app.disable('x-powered-by');
app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}));
app.use(express.json({limit:'200kb'}));
app.use(cookieParser());
app.use('/api/admin',rateLimit({windowMs:15*60*1000,limit:120,standardHeaders:'draft-7',legacyHeaders:false}));
const loginLimit=rateLimit({windowMs:15*60*1000,limit:8,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Too many login attempts. Please try again later.'}});
const sha=(value)=>crypto.createHmac('sha256',process.env.SESSION_SECRET).update(value).digest('hex');
function token(){const exp=Date.now()+12*60*60*1000;const val=`${exp}.${crypto.randomBytes(24).toString('hex')}`;return `${val}.${sha(val)}`;}
function authenticated(req){const t=req.cookies.spg_admin;if(typeof t!=='string')return false;const i=t.lastIndexOf('.');if(i<0)return false;const payload=t.slice(0,i),sig=t.slice(i+1),expected=sha(payload);if(sig.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;const exp=Number(payload.split('.')[0]);return Number.isFinite(exp)&&exp>Date.now();}
function requireAdmin(req,res,next){if(!authenticated(req))return res.status(401).json({error:'Please sign in as an administrator.'});next();}
function sameOrigin(req,res,next){const requestOrigin=req.get('origin');if(requestOrigin && requestOrigin!==origin)return res.status(403).json({error:'Invalid request origin.'});next();}
async function readData(){try{return JSON.parse(await fs.readFile(dataPath,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;return JSON.parse(await fs.readFile(seedPath,'utf8'));}}
let pending=Promise.resolve();
function writeData(data){pending=pending.catch(()=>{}).then(async()=>{await fs.mkdir(path.dirname(dataPath),{recursive:true});const tmp=dataPath+'.tmp';await fs.writeFile(tmp,JSON.stringify(data,null,2));await fs.rename(tmp,dataPath);});return pending;}
const isText=(v,max=1000)=>typeof v==='string'&&v.length<=max;
const clean=(v,max=1000)=>String(v??'').trim().slice(0,max);
const validMedia=(s)=>typeof s==='string'&&s.length<1500&&(s.startsWith('/images/')||s.startsWith('/uploads/')||s.startsWith('/videos/')||/^https:\/\//.test(s));
app.get('/api/public',async(req,res,next)=>{try{const data=await readData();res.set('Cache-Control','no-store').json({site:data.site,properties:data.properties.filter(p=>p.published).sort((a,b)=>a.sortOrder-b.sortOrder)});}catch(e){next(e);}});
app.post('/api/admin/login',sameOrigin,loginLimit,(req,res)=>{const supplied=String(req.body?.password||'');const actual=process.env.ADMIN_PASSWORD;if(supplied.length!==actual.length||!crypto.timingSafeEqual(Buffer.from(supplied),Buffer.from(actual)))return res.status(401).json({error:'Incorrect password.'});res.cookie('spg_admin',token(),{httpOnly:true,secure:prod,sameSite:'lax',maxAge:12*60*60*1000,path:'/'}).json({ok:true});});
app.post('/api/admin/logout',sameOrigin,(req,res)=>{res.clearCookie('spg_admin',{path:'/'}).json({ok:true});});
app.get('/api/admin/me',(req,res)=>res.json({authenticated:authenticated(req)}));
app.get('/api/admin/content',requireAdmin,async(req,res,next)=>{try{res.json(await readData());}catch(e){next(e);}});
app.put('/api/admin/site',sameOrigin,requireAdmin,async(req,res,next)=>{try{const data=await readData();const incoming=req.body;if(!incoming||typeof incoming!=='object'||Array.isArray(incoming))return res.status(400).json({error:'Invalid content.'});const keys=Object.keys(data.site);const nextSite={...data.site};for(const key of keys){if(Object.hasOwn(incoming,key)){if(!isText(incoming[key],key.endsWith('Text')?3000:1500))return res.status(400).json({error:`Invalid ${key}`});nextSite[key]=clean(incoming[key],key.endsWith('Text')?3000:1500);}}if(nextSite.heroImage&&!validMedia(nextSite.heroImage))return res.status(400).json({error:'Use a valid image URL or uploaded image path.'});if(nextSite.whatsapp && !/^\d{10,15}$/.test(nextSite.whatsapp))return res.status(400).json({error:'Use international WhatsApp number with digits only, e.g. 91...'});data.site=nextSite;await writeData(data);res.json({ok:true,site:data.site});}catch(e){next(e);}});
app.put('/api/admin/properties/:id',sameOrigin,requireAdmin,async(req,res,next)=>{try{const data=await readData();const p=data.properties.find(x=>x.id===req.params.id);if(!p)return res.status(404).json({error:'Property not found.'});const input=req.body||{};for(const key of ['name','subtitle','location','description','rateLabel','rateNote','stayOptions','occupancyLabel','houseRules','eligibility','video']){if(Object.hasOwn(input,key)){if(!isText(input[key],4000))return res.status(400).json({error:`Invalid ${key}`});p[key]=clean(input[key],4000);}}if(Object.hasOwn(input,'amenities')){if(!Array.isArray(input.amenities)||input.amenities.length>30||input.amenities.some(x=>!isText(x,200)))return res.status(400).json({error:'Invalid amenities.'});p.amenities=input.amenities.map(x=>clean(x,200)).filter(Boolean);}if(Object.hasOwn(input,'images')){if(!Array.isArray(input.images)||input.images.length>20||!input.images.every(validMedia))return res.status(400).json({error:'Invalid images.'});p.images=input.images;}if(typeof input.published==='boolean')p.published=input.published;await writeData(data);res.json({ok:true,property:p});}catch(e){next(e);}});
app.post('/api/admin/properties',sameOrigin,requireAdmin,async(req,res,next)=>{try{const data=await readData();const id=crypto.randomUUID();const p={id,slug:`property-${id.slice(0,8)}`,name:'New property',subtitle:'In preparation',location:'Mumbai',description:'',rateLabel:'',rateNote:'',stayOptions:'',occupancyLabel:'',houseRules:'',eligibility:'',images:[],amenities:[],published:false,sortOrder:data.properties.length+1};data.properties.push(p);await writeData(data);res.status(201).json({ok:true,property:p});}catch(e){next(e);}});
const upload=multer({storage:multer.diskStorage({destination:async(req,file,cb)=>{try{await fs.mkdir(uploadsDir,{recursive:true});cb(null,uploadsDir);}catch(e){cb(e);}},filename:(req,file,cb)=>{const map={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/avif':'.avif'};cb(null,crypto.randomUUID()+(map[file.mimetype]||'.bin'));}}),fileFilter:(req,file,cb)=>{if(!['image/jpeg','image/png','image/webp','image/avif'].includes(file.mimetype))return cb(new Error('Use JPEG, PNG, WebP or AVIF images.'));cb(null,true);},limits:{fileSize:6*1024*1024,files:1}});
app.post('/api/admin/upload',sameOrigin,requireAdmin,upload.single('image'),(req,res)=>{if(!req.file)return res.status(400).json({error:'No image uploaded.'});res.json({url:`/uploads/${req.file.filename}`});});
app.use('/uploads',express.static(uploadsDir,{immutable:true,maxAge:'7d',index:false}));
app.get('/api/health',(req,res)=>res.json({ok:true}));
const clientDist=path.resolve(here,'../../client/dist');
app.use(express.static(clientDist));
app.get('*',(req,res,next)=>{
  if(req.path.startsWith('/api')||req.path.startsWith('/uploads'))return next();
  res.sendFile(path.resolve(clientDist,'index.html'),(err)=>{if(err)next();});
});
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({error:err.code==='LIMIT_FILE_SIZE'?'Image too large (maximum 6 MB).':err.message==='Use JPEG, PNG, WebP or AVIF images.'?err.message:'An unexpected server error occurred.'});});
app.listen(PORT,()=>console.log(`SPG API listening on http://localhost:${PORT}`));
