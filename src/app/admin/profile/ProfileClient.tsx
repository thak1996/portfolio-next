'use client';

import { useState, useTransition } from 'react';
import { updateProfileAction } from './actions';
import { useRouter } from 'next/navigation';

export default function ProfileClient({ initialEmail }: { initialEmail: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('currentPassword', currentPassword);
    if (newPassword) formData.append('newPassword', newPassword);

    startTransition(async () => {
      const result = await updateProfileAction(null, formData);
      if (result.success) {
        setSuccessMsg('Perfil atualizado com sucesso!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        router.refresh();
      } else {
        setError(result.error || 'Erro ao atualizar o perfil.');
      }
    });
  }

  return (
    <form onSubmit={handleSave} className="bg-surface border border-white/5 p-lg rounded-2xl flex flex-col gap-md">
      {error && (
        <div className="p-sm rounded-xl border border-error/20 bg-error/10 text-error font-body-md flex items-center gap-xs mb-sm">
          <span className="material-symbols-outlined text-[20px]">warning</span>
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-sm rounded-xl border border-secondary/20 bg-secondary/10 text-secondary font-body-md flex items-center gap-xs mb-sm">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-on-surface-variant mb-xs">
          E-mail de Acesso
        </label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
        />
      </div>

      <div className="h-px bg-white/10 my-xs" />
      
      <div>
        <label className="block text-sm font-bold text-on-surface-variant mb-xs">
          Nova Senha (opcional)
        </label>
        <input 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Deixe em branco para não alterar"
          className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
        />
      </div>

      {newPassword && (
        <div>
          <label className="block text-sm font-bold text-on-surface-variant mb-xs">
            Confirmar Nova Senha
          </label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={!!newPassword}
            placeholder="Repita a nova senha"
            className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
          />
        </div>
      )}

      <div className="h-px bg-white/10 my-xs" />

      <div>
        <label className="block text-sm font-bold text-on-surface-variant mb-xs">
          Senha Atual (Obrigatório para salvar)
        </label>
        <input 
          type="password" 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          placeholder="Digite sua senha atual"
          className="w-full bg-surface-container border border-white/10 rounded-xl px-sm py-xs text-on-surface focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex justify-end mt-sm">
        <button 
          type="submit" 
          disabled={isPending || !currentPassword}
          className="flex items-center gap-2 bg-primary text-on-primary px-lg py-sm rounded-xl font-bold hover:bg-primary-fixed transition-colors shadow-lg active:scale-95 disabled:opacity-50"
        >
          {isPending ? (
            <span className="material-symbols-outlined animate-spin">autorenew</span>
          ) : (
            <span className="material-symbols-outlined">save</span>
          )}
          Salvar Alterações
        </button>
      </div>
    </form>
  );
}
