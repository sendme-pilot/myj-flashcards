import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTags } from '../hooks/useTags';

export function TagManagementPage() {
  const { user, logout } = useAuth();
  const { grouped, loading, add, remove } = useTags();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;
    setSubmitting(true);
    await add(name, category);
    setName('');
    setCategory('');
    setSubmitting(false);
  };

  const inputClass =
    'w-full px-4 py-2 border border-gold/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 text-stone-800 placeholder:text-stone-400';

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-gold/20 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-gold">標籤管理</h1>
          <p className="text-xs text-stone-400">{user?.displayName ?? user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-sm text-gold hover:text-gold/80 transition">
            返回管理後台
          </Link>
          <button onClick={logout} className="text-sm text-stone-500 hover:text-stone-800 transition">
            登出
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-4 bg-cream/50 p-6 rounded-2xl border border-gold/20">
          <h3 className="text-lg font-semibold text-stone-800">新增標籤</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className={inputClass}
              placeholder="標籤名稱"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="分類"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 rounded-lg bg-gold text-white font-medium hover:bg-gold/90 transition disabled:opacity-50"
          >
            {submitting ? '新增中…' : '新增標籤'}
          </button>
        </form>

        {loading ? (
          <p className="text-center text-stone-400">載入中…</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-center text-stone-400">尚無標籤，請新增第一個標籤</p>
        ) : (
          Object.entries(grouped).map(([category, tags]) => (
            <section key={category}>
              <h2 className="text-md font-semibold text-stone-700 mb-3 border-b border-gold/20 pb-1">
                {category}
                <span className="text-xs text-stone-400 ml-2">({tags.length} 個)</span>
              </h2>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-gold/15"
                  >
                    <span className="font-medium text-stone-800">{tag.name}</span>
                    <button
                      onClick={() => remove(tag.id)}
                      className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      刪除
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
