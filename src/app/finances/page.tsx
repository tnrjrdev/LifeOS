import React from "react";
import styles from "./page.module.css";
import Card from "@/components/Card";
import { getTransactions, getBalance, addTransaction } from "@/actions/finances";

const categories = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Educação', 'Renda', 'Investimento', 'Outros'];

export default async function FinancesPage() {
  const transactions = await getTransactions();
  const balance = await getBalance();

  const income = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

  return (
    <div className={styles.container}>
      <header className={`${styles.header} animate-in`}>
        <div>
          <h1>Finanças</h1>
          <p className={styles.subtitle}>Controle suas receitas e despesas</p>
        </div>
      </header>

      {/* Stat cards */}
      <div className={`${styles.statsRow} animate-in stagger-1`}>
        <div className={`${styles.statCard} ${styles.statBalance}`}>
          <p className={styles.statLabel}>Saldo Total</p>
          <p className={`${styles.statAmount} ${balance >= 0 ? styles.positive : styles.negative}`}>
            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`${styles.statCard} ${styles.statIncome}`}>
          <p className={styles.statLabel}>↑ Total Receitas</p>
          <p className={`${styles.statAmount} ${styles.positive}`}>
            R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`${styles.statCard} ${styles.statExpense}`}>
          <p className={styles.statLabel}>↓ Total Despesas</p>
          <p className={`${styles.statAmount} ${styles.negative}`}>
            R$ {expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className={`${styles.grid} animate-in stagger-2`}>
        {/* Form */}
        <Card title="Nova Transação" accent="purple">
          <form action={addTransaction} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Descrição</label>
              <input name="description" placeholder="Ex: Conta de luz, Salário..." required className={styles.input} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Valor (R$)</label>
              <input name="amount" type="number" step="0.01" min="0.01" placeholder="0,00" required className={styles.input} />
            </div>
            <div className={styles.row2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Tipo</label>
                <select name="type" className={styles.input}>
                  <option value="expense">💸 Despesa</option>
                  <option value="income">💰 Receita</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Categoria</label>
                <select name="category" className={styles.input}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className={styles.button}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Adicionar Transação
            </button>
          </form>
        </Card>

        {/* History */}
        <Card title="Histórico" subtitle={`${transactions.length} transações`} accent="blue">
          <div className={styles.historyList}>
            {transactions.length === 0 ? (
              <div className={styles.emptyState}>
                <span>📋</span>
                <p>Nenhuma transação registrada ainda.</p>
              </div>
            ) : (
              transactions.map((t) => (
                <div key={t.id} className={styles.txRow}>
                  <div className={`${styles.txIcon} ${t.type === 'income' ? styles.iconIncome : styles.iconExpense}`}>
                    {t.type === 'income' ? '↑' : '↓'}
                  </div>
                  <div className={styles.txInfo}>
                    <span className={styles.txDesc}>{t.description}</span>
                    <span className={styles.txMeta}>{t.category} · {new Date(t.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <span className={t.type === 'income' ? styles.txAmountIncome : styles.txAmountExpense}>
                    {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
