const fs=require('node:fs');const ts=require('typescript');const assert=require('node:assert/strict');const Module=require('node:module');
const m=new Module('spoken-name');m._compile(ts.transpileModule(fs.readFileSync('app/lib/spokenBusinessName.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,'spoken-name.js');
for(const [input,city,expected] of [
 ['Curis 360 Physiotherapy (Banashankari)','Bangalore','Curis 360 Physiotherapy'],
 ['Ayurveda Soudha (Doddanekundi)','Bangalore','Ayurveda Soudha'],
 ['Swastya Physio Clinic (Kalyan Nagar)','Bangalore','Swastya Physio Clinic'],
 ['IISE Institute (Rajajinagar)','Bangalore','IISE Institute'],
 ['Harvey Overseas (Koramangala 6th Block)','Bangalore','Harvey Overseas'],
 ['Clinic - Bangalore','Bangalore','Clinic'],['Clinic, Bangalore','Bangalore','Clinic'],
 ['Bangalore Dental Care','Bangalore','Bangalore Dental Care'],['A & B Clinic','','A & B Clinic'],['','','your business']
])assert.equal(m.exports.spokenBusinessName(input,city),expected);
console.log('10 spoken business-name checks passed');
