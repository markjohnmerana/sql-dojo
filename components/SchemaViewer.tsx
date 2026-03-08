'use client'

import { useState } from 'react'
import { Copy, Check, Database, ChevronDown, ChevronUp } from 'lucide-react'
import { SCHEMA_SQL } from '@/lib/problems'

const TABLES = [
  {
    name: 'employees',
    color: 'text-dojo-blue',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'name', type: 'TEXT', pk: false },
      { name: 'department_id', type: 'INTEGER', pk: false, fk: 'departments.id' },
      { name: 'salary', type: 'NUMERIC(10,2)', pk: false },
      { name: 'hire_date', type: 'DATE', pk: false },
      { name: 'manager_id', type: 'INTEGER', pk: false, fk: 'employees.id' },
      { name: 'email', type: 'TEXT', pk: false },
      { name: 'status', type: 'TEXT', pk: false },
    ],
  },
  {
    name: 'departments',
    color: 'text-dojo-purple',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'name', type: 'TEXT', pk: false },
      { name: 'budget', type: 'NUMERIC(12,2)', pk: false },
      { name: 'location', type: 'TEXT', pk: false },
      { name: 'created_at', type: 'TIMESTAMP', pk: false },
    ],
  },
  {
    name: 'orders',
    color: 'text-dojo-orange',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'customer_id', type: 'INTEGER', pk: false, fk: 'customers.id' },
      { name: 'employee_id', type: 'INTEGER', pk: false, fk: 'employees.id' },
      { name: 'total_amount', type: 'NUMERIC(10,2)', pk: false },
      { name: 'status', type: 'TEXT', pk: false },
      { name: 'order_date', type: 'TIMESTAMP', pk: false },
      { name: 'shipped_date', type: 'TIMESTAMP', pk: false },
    ],
  },
  {
    name: 'customers',
    color: 'text-dojo-green',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'name', type: 'TEXT', pk: false },
      { name: 'email', type: 'TEXT', pk: false },
      { name: 'city', type: 'TEXT', pk: false },
      { name: 'country', type: 'TEXT', pk: false },
      { name: 'tier', type: 'TEXT', pk: false },
      { name: 'joined_at', type: 'TIMESTAMP', pk: false },
    ],
  },
  {
    name: 'products',
    color: 'text-dojo-yellow',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'name', type: 'TEXT', pk: false },
      { name: 'category', type: 'TEXT', pk: false },
      { name: 'price', type: 'NUMERIC(10,2)', pk: false },
      { name: 'stock_qty', type: 'INTEGER', pk: false },
      { name: 'supplier_id', type: 'INTEGER', pk: false },
      { name: 'created_at', type: 'TIMESTAMP', pk: false },
    ],
  },
]

export default function SchemaViewer() {
  const [expanded, setExpanded] = useState<string | null>('employees')
  const [copied, setCopied] = useState(false)
  const [showSQL, setShowSQL] = useState(false)

  function copySchema() {
    navigator.clipboard.writeText(SCHEMA_SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-dojo-text">Database Schema</h2>
          <p className="text-xs text-dojo-dim font-mono mt-0.5">5 tables · all problems use these</p>
        </div>
        <button
          onClick={copySchema}
          className="flex items-center gap-1.5 text-xs font-mono bg-dojo-surface border border-dojo-border px-3 py-2 rounded-lg hover:border-dojo-red/50 transition-colors text-dojo-dim hover:text-dojo-text"
        >
          {copied ? <Check size={12} className="text-dojo-green" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy SQL'}
        </button>
      </div>

      {/* Tables */}
      {TABLES.map(table => (
        <div key={table.name} className="bg-dojo-surface border border-dojo-border rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === table.name ? null : table.name)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Database size={14} className={table.color} />
              <span className={`font-mono font-semibold text-sm ${table.color}`}>{table.name}</span>
              <span className="text-xs text-dojo-muted font-mono">{table.columns.length} cols</span>
            </div>
            {expanded === table.name
              ? <ChevronUp size={14} className="text-dojo-dim" />
              : <ChevronDown size={14} className="text-dojo-dim" />
            }
          </button>

          {expanded === table.name && (
            <div className="border-t border-dojo-border">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-dojo-border">
                    <th className="text-left px-4 py-2 text-dojo-dim font-medium">column</th>
                    <th className="text-left px-4 py-2 text-dojo-dim font-medium">type</th>
                    <th className="text-left px-4 py-2 text-dojo-dim font-medium">notes</th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map(col => (
                    <tr key={col.name} className="border-b border-dojo-border/40 last:border-0">
                      <td className="px-4 py-2">
                        <span className={col.pk ? 'text-dojo-yellow' : 'text-dojo-text'}>{col.name}</span>
                      </td>
                      <td className="px-4 py-2 text-dojo-blue">{col.type}</td>
                      <td className="px-4 py-2">
                        {col.pk && <span className="text-dojo-yellow">PK</span>}
                        {'fk' in col && col.fk && (
                          <span className="text-dojo-purple">→ {col.fk}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {/* Setup instructions */}
      <div className="bg-dojo-surface border border-dojo-border rounded-xl p-4">
        <button
          onClick={() => setShowSQL(!showSQL)}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="text-sm font-medium text-dojo-text">Setup Instructions</span>
          {showSQL ? <ChevronUp size={14} className="text-dojo-dim" /> : <ChevronDown size={14} className="text-dojo-dim" />}
        </button>
        {showSQL && (
          <div className="mt-3 pt-3 border-t border-dojo-border text-xs text-dojo-dim space-y-2 animate-slide-up">
            <p>1. Go to your Supabase project → SQL Editor</p>
            <p>2. Paste the copied schema SQL and run it</p>
            <p>3. This creates all 5 tables with seed data</p>
            <p>4. Done! The app will now persist your progress</p>
            <div className="mt-3 p-3 bg-dojo-bg rounded-lg">
              <p className="text-dojo-blue mb-1">Also run this for the todos table:</p>
              <pre className="text-dojo-green text-xs leading-relaxed overflow-x-auto">{`CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  date TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS problem_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(problem_id, date)
);

-- Enable RLS (optional but recommended)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_attempts ENABLE ROW LEVEL SECURITY;

-- Allow all for anon key (single user app)
CREATE POLICY "allow_all_todos" ON todos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_attempts" ON problem_attempts FOR ALL USING (true) WITH CHECK (true);`}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
