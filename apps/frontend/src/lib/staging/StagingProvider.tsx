'use client';
import {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {cloneSeed} from './seed';
import {STAGING_STORAGE_KEY,id,now} from './types';
import type {StagingStore,StagingState,StagingApplicant,StagingBatch,StagingProject,StagingBlog,StagingEvent,StagingHeroSlide,StagingSiteConfig,StagingAboutSection,LandingResearchHighlight} from './types';
const Context=createContext<StagingStore|null>(null);

function loadStoredState(): StagingState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw=window.localStorage.getItem(STAGING_STORAGE_KEY);
    if (!raw) return null;
    const parsed=JSON.parse(raw) as StagingState;
    return {...parsed,applicants:parsed.applicants.map((a,i)=>({...a,email:a.email||`${a.name.toLowerCase().replace(/\s+/g,'.')}@sandbox.copublika.id`,phone:a.phone||`+62 811 20${String(i+1).padStart(4,'0')}`,category:a.category||'Non-STEM',memberId:a.memberId||undefined,programStudy:a.programStudy||a.expertise,scholarUrl:a.scholarUrl||`https://scholar.google.com/citations?user=${a.scholarId}`,affiliation:a.affiliation||a.institution,verificationState:a.verificationState||'pending',verificationNote:a.verificationNote||'Verifikasi admin.',audit:a.audit||[]})),projects:parsed.projects.map(p=>({...p,requiredExpertise:p.requiredExpertise||'Keahlian sintetis',targetJournal:p.targetJournal||'Journal Sandbox',methodology:p.methodology||'Metodologi eksploratif'}))};
  } catch {
    return null;
  }
}

const EMPTY_STATE:StagingState={applicants:[],batches:[],projects:[],blogs:[],events:[],activity:[],heroSlides:[],siteConfig:null,aboutSections:[],landingResearch:[]};

export function StagingProvider({children,enabled=true}:{children:React.ReactNode;enabled?:boolean}){const [state,setState]=useState<StagingState>(()=>enabled?cloneSeed():EMPTY_STATE);const [hydrated,setHydrated]=useState(true);
 // Client-only hydration prevents localStorage from changing the server-rendered tree.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{if(!enabled){setHydrated(true);return}const stored=loadStoredState();if(stored)setState(stored);setHydrated(true)},[enabled]);
 useEffect(()=>{if(enabled&&hydrated)window.localStorage.setItem(STAGING_STORAGE_KEY,JSON.stringify(state))},[state,hydrated,enabled]);
 const log=useCallback((action:string,entity:string,detail:string)=>{if(enabled)setState(s=>({...s,activity:[{id:id('ACT'),action,entity,detail,at:now()},...s.activity].slice(0,40)}))},[enabled]);
 const mutate=useCallback(<K extends keyof StagingState>(key:K,fn:(items:StagingState[K])=>StagingState[K],detail:string)=>{if(!enabled)return;setState(s=>({...s,[key]:fn(s[key])}));log('Perubahan sandbox',String(key),detail)},[enabled,log]);
 const value=useMemo<StagingStore>(()=>({ ...state,reset:()=>{if(!enabled)return;setState(()=>{const seed=cloneSeed();return {...seed,activity:[{id:id('ACT'),action:'Sandbox direset',entity:'System',detail:'Data kembali ke seed sintetis',at:now()},...seed.activity].slice(0,40)}})},
 addApplicant:v=>mutate('applicants',xs=>[...xs,{...v,email:v.email||'belum-diisi@sandbox.copublika.id',phone:v.phone||'Belum diisi',category:v.category||'Non-STEM',programStudy:v.programStudy||v.expertise,scholarUrl:v.scholarUrl||`https://scholar.google.com/citations?user=${v.scholarId}`,affiliation:v.affiliation||v.institution,verificationState:v.verificationState||'pending',verificationNote:v.verificationNote||'Verifikasi admin.',audit:v.audit||[],id:id('APP'),submittedAt:new Date().toISOString().slice(0,10),status:'pending'} as StagingApplicant],'Pendaftar sintetis ditambahkan'),updateApplicant:(x,v)=>mutate('applicants',xs=>xs.map(a=>a.id===x?{...a,...v}:a),'Pendaftar diperbarui'),removeApplicant:x=>mutate('applicants',xs=>xs.filter(a=>a.id!==x),'Pendaftar diarsipkan/dihapus'),
 addBatch:v=>mutate('batches',xs=>[...xs,{...v,id:id('BAT')} as StagingBatch],'Batch sintetis ditambahkan'),updateBatch:(x,v)=>mutate('batches',xs=>xs.map(a=>a.id===x?{...a,...v}:a),'Batch diperbarui'),removeBatch:x=>mutate('batches',xs=>xs.filter(a=>a.id!==x),'Batch dihapus'),
 addProject:v=>mutate('projects',xs=>[...xs,{...v,id:id('PRO'),updatedAt:now().slice(0,10)} as StagingProject],'Proyek sintetis ditambahkan'),updateProject:(x,v)=>mutate('projects',xs=>xs.map(a=>a.id===x?{...a,...v,updatedAt:now().slice(0,10)}:a),'Proyek diperbarui'),
 addBlog:v=>mutate('blogs',xs=>[...xs,{...v,id:id('BLO'),updatedAt:now().slice(0,10)} as StagingBlog],'Blog sintetis ditambahkan'),updateBlog:(x,v)=>mutate('blogs',xs=>xs.map(a=>a.id===x?{...a,...v,updatedAt:now().slice(0,10)}:a),'Blog diperbarui'),
 addEvent:v=>mutate('events',xs=>[...xs,{...v,id:id('EVE')} as StagingEvent],'Event sintetis ditambahkan'),updateEvent:(x,v)=>mutate('events',xs=>xs.map(a=>a.id===x?{...a,...v}:a),'Event diperbarui'),
 addHeroSlide:v=>mutate('heroSlides',xs=>[...xs,{...v,id:id('SLD')} as StagingHeroSlide],'Slide hero ditambahkan'),updateHeroSlide:(x,v)=>mutate('heroSlides',xs=>xs.map(a=>a.id===x?{...a,...v}:a),'Slide hero diperbarui'),removeHeroSlide:x=>mutate('heroSlides',xs=>xs.filter(a=>a.id!==x),'Slide hero dihapus'),
 updateSiteConfig:v=>mutate('siteConfig',()=>v,'Konfigurasi situs diperbarui'),
 addAboutSection:v=>mutate('aboutSections',xs=>[...xs,{...v,id:id('ABT')} as StagingAboutSection],'Section about ditambahkan'),updateAboutSection:(x,v)=>mutate('aboutSections',xs=>xs.map(a=>a.id===x?{...a,...v}:a),'Section about diperbarui'),removeAboutSection:x=>mutate('aboutSections',xs=>xs.filter(a=>a.id!==x),'Section about dihapus'),
 addLandingResearch:v=>mutate('landingResearch',xs=>[...xs,{...v,id:id('LRH')} as LandingResearchHighlight],'Highlight riset landing ditambahkan'),updateLandingResearch:(x,v)=>mutate('landingResearch',xs=>xs.map(a=>a.id===x?{...a,...v}:a),'Highlight riset landing diperbarui'),removeLandingResearch:x=>mutate('landingResearch',xs=>xs.filter(a=>a.id!==x),'Highlight riset landing dihapus') }),[state,mutate,enabled]); return <Context.Provider value={value}>{hydrated?children:<div aria-busy="true">Memuat preview sandbox…</div>}</Context.Provider>}
export const useStaging=()=>{const value=useContext(Context);if(!value)throw new Error('useStaging must be used inside StagingProvider');return value};
export const useOptionalStaging=()=>useContext(Context);
export default StagingProvider;
