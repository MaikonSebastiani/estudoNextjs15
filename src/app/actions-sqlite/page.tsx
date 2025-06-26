import { FormSQLite } from '@/components/FormSQLite';

export default function ActionsSQLitePage() {
  return (
    <main className="p-4 w-full flex flex-col items-center justify-center">
      <h1>Server Action + SQLite</h1>
      <FormSQLite />
    </main>
  );
}
