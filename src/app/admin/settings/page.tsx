import { getSiteContent } from './actions';
import { SettingsClient } from './SettingsClient';

export const metadata = {
  title: 'Configurações do Site - Admin',
};

export default async function SettingsPage() {
  const content = await getSiteContent();

  return (
    <div>
      <header className="mb-xl">
        <h1 className="font-h2 text-h2 text-on-surface">Seções do Site</h1>
        <p className="text-on-surface-variant font-body-md">
          Gerencie a visibilidade, a ordem e os textos das seções do seu portfólio.
        </p>
      </header>
      
      <SettingsClient initialContent={content} />
    </div>
  );
}
