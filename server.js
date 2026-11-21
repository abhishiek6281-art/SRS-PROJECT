const express=require('express');
const path=require('path');
const app=express();
const PORT=process.env.PORT||3000;
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.get('/api/health',(_req,res)=>res.json({ok:true,app:'PillPing CareCircle'}));
app.get('/api/state',(_req,res)=>res.json(store.state));
app.post('/api/doses/:id/confirm',(req,res)=>{
 const dose=store.state.doses.find(d=>d.id===Number(req.params.id));
 if(!dose)return res.status(404).json({error:'Dose not found'});
 if(dose.status!=='taken'){dose.status='taken';dose.takenAt=new Date().toISOString();const med=store.state.medications.find(m=>m.id===dose.medicationId);if(med)med.inventory=Math.max(0,med.inventory-1);}
 res.json({ok:true,dose});
});
app.post('/api/doses/:id/snooze',(req,res)=>{
 const dose=store.state.doses.find(d=>d.id===Number(req.params.id));
 if(!dose)return res.status(404).json({error:'Dose not found'});
 dose.snoozedUntil=new Date(Date.now()+15*60000).toISOString();res.json({ok:true,dose});
});
app.post('/api/medications',(req,res)=>{
 const x=req.body||{};
 if(!x.name||!x.dosage||!x.times?.length)return res.status(400).json({error:'Medicine, dosage and reminder time are required'});
 const id=Math.max(0,...store.state.medications.map(m=>m.id))+1;
 const med={id,patientId:Number(x.patientId)||1,name:x.name,dosage:x.dosage,frequency:x.frequency||'Custom',food:x.food||'As directed',inventory:Number(x.inventory)||0,times:x.times.join(',')};
 store.state.medications.push(med);
 x.times.forEach((time,i)=>store.state.doses.push({id:Math.max(0,...store.state.doses.map(d=>d.id))+1,patientId:med.patientId,medicationId:id,scheduledAt:new Date(new Date().toDateString()+' '+time).toISOString(),status:'pending',takenAt:null,snoozedUntil:null}));
 res.status(201).json(med);
});
const store={state:{patients:[
{id:1,name:'Margaret Wilson',age:72,caregiver:'Emily Wilson',phone:'+911234567890'},
{id:2,name:'Robert Wilson',age:76,caregiver:'Daniel Wilson',phone:'+919876543210'}],
medications:[
{id:1,patientId:1,name:'Metformin',dosage:'500 mg',frequency:'Morning & Night',food:'With food',inventory:18,times:'08:00,20:00'},
{id:2,patientId:1,name:'Amlodipine',dosage:'5 mg',frequency:'Morning',food:'With water',inventory:12,times:'10:00'},
{id:3,patientId:1,name:'Aspirin',dosage:'75 mg',frequency:'Afternoon',food:'After food',inventory:4,times:'13:00'},
{id:4,patientId:1,name:'Vitamin D',dosage:'1000 IU',frequency:'Night',food:'After food',inventory:22,times:'21:00'},
{id:5,patientId:2,name:'Metformin',dosage:'500 mg',frequency:'Morning & Night',food:'With food',inventory:16,times:'08:00,20:00'},
{id:6,patientId:2,name:'Losartan',dosage:'50 mg',frequency:'Morning',food:'With water',inventory:9,times:'10:00'},
{id:7,patientId:2,name:'Atorvastatin',dosage:'10 mg',frequency:'Night',food:'After food',inventory:3,times:'21:00'},
{id:8,patientId:2,name:'Calcium',dosage:'500 mg',frequency:'Afternoon',food:'With food',inventory:14,times:'13:00'}],doses:[]}};
let did=1;
for(const m of store.state.medications){for(const t of m.times.split(',')){const [h,min]=t.split(':').map(Number);const at=new Date();at.setHours(h,min,0,0);store.state.doses.push({id:did++,patientId:m.patientId,medicationId:m.id,scheduledAt:at.toISOString(),status:'pending',takenAt:null,snoozedUntil:null});}}
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,()=>console.log(`PillPing listening on ${PORT}`));