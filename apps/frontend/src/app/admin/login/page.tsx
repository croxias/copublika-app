'use client';
import { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { Button } from '@/components/ui/Button';
import { Input, Label, Alert } from '@/components/ui/Input';
const emptySubscribe = () => () => {};
const getServerClient = () => false;
const getBrowserClient = () => true;

export default function AdminLoginPage(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [loading,setLoading]=useState(false); const [demoLoading,setDemoLoading]=useState(false); const [error,setError]=useState(''); const isClient=useSyncExternalStore(emptySubscribe,getBrowserClient,getServerClient); const {signIn}=useAuth();
  useEffect(()=>{document.title='Masuk — CoPublika Admin'},[]);
  const demoEnabled=isClient&&process.env.NEXT_PUBLIC_COPUBLIKA_DEMO_MODE==='true';
 const submit=async(e:React.FormEvent)=>{e.preventDefault();setLoading(true);setError('');const result=await signIn(email, password);if(result.error){setError('Email atau kata sandi salah.');setLoading(false);return}window.location.href='/admin/dashboard'};
 const demo=async()=>{setDemoLoading(true);try{const response=await fetch('/api/admin/demo-login',{method:'POST'});if(response.ok)window.location.href='/admin/dashboard';else setError('Akses demo tidak tersedia.')}catch{setError('Akses demo tidak tersedia.')}finally{setDemoLoading(false)}};
 return <main className="cp-login"><section className="cp-login-panel"><Link href="/" className="cp-login-brand"><Image src="/logo-black.png" alt="CoPublika" width={190} height={40} priority /></Link><div className="cp-login-inner"><div className="cp-section-kicker">ADMINISTRATION / SECURE ENTRY</div><h1>Selamat datang<br/><em>kembali.</em></h1><p className="cp-login-lede">Ruang kerja untuk menjaga kualitas komunitas riset, dari pendaftar hingga publikasi.</p>{error&&<Alert className="cp-alert-error">{error}</Alert>}<form onSubmit={submit} className="cp-login-form"><div><Label htmlFor="email">Email kerja</Label><Input id="email" type="email" autoComplete="email" required placeholder="nama@copublika.id" value={email} onChange={e=>setEmail(e.target.value)}/></div><div><Label htmlFor="password">Kata sandi</Label><Input id="password" type="password" autoComplete="current-password" required placeholder="Masukkan kata sandi" value={password} onChange={e=>setPassword(e.target.value)}/></div><div className="cp-login-meta"><label><input type="checkbox"/> Ingat perangkat ini</label><span>Pemulihan belum tersedia</span></div><Button type="submit" disabled={loading} size="lg">{loading?'Memverifikasi…':'Masuk ke panel →'}</Button></form>{demoEnabled&&<div className="cp-demo-login"><div><strong>Mode demo aktif</strong><p>Gunakan preview sintetis untuk mengeksplorasi UI. Perubahan hanya tersimpan di localStorage browser.</p></div><Button variant="outline" onClick={demo} disabled={demoLoading}>{demoLoading?'Menyiapkan…':'Masuk demo'}</Button></div>}<Link href="/" className="cp-login-back">← Kembali ke website</Link></div></section><aside className="cp-login-aside"><div className="cp-login-aside-top"><span className="cp-aside-mark">CP</span><span>CoPublika / Operations</span></div><div className="cp-login-quote"><span className="cp-quote-mark">“</span><blockquote>Riset yang baik membutuhkan sistem yang dapat dipercaya.</blockquote><p>Panel administrasi CoPublika</p></div><div className="cp-login-aside-foot">SCOPUS-READY RESEARCH COMMUNITY<br/><span>Yogyakarta · Indonesia</span></div></aside></main>;
}
