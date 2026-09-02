import styles from "./page.module.css";
import Card from "@/components/Card";
import { getBalance, getTransactions } from "@/actions/finances";
import { getHabits, getTasks } from "@/actions/habits";
import { getGoals } from "@/actions/goals";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function Home() {
  const [balance, transactions, habits, tasks, goals] = await Promise.all([
    getBalance(),
    getTransactions(),
    getHabits(),
    getTasks(),
    getGoals(),
  ]);

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedToday = tasks.filter(t => t.status === 'completed');

  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const monthlyExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const recentTransactions = transactions.slice(0, 5);
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high').slice(0, 3);
  const displayTasks = [...highPriorityTasks, ...pendingTasks.filter(t => t.priority !== 'high')].slice(0, 4);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={`${styles.header} animate-in`}>
        <div>
          <h1 className={styles.greeting}>{getGreeting()} 👋</h1>
          <p className={styles.subgreeting}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statPill}>
            <span className={styles.statPillDot} style={{ background: 'var(--accent-green)' }}></span>
            {completedToday.length} tarefas feitas
          </div>
          <div className={styles.statPill}>
            <span className={styles.statPillDot} style={{ background: 'var(--accent-amber)' }}></span>
            {pendingTasks.length} pendentes
          </div>
        </div>
      </header>

      {/* Stats Row */}
      <div className={`${styles.statsRow} animate-in stagger-1`}>
        <div className={styles.statCard}>
          <div className={styles.statCardIcon} style={{ background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>
            <p className={styles.statCardLabel}>Saldo Total</p>
            <p className={styles.statCardValue} style={{ color: balance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              R$ {Math.abs(balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardIcon} style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <div>
            <p className={styles.statCardLabel}>Receitas</p>
            <p className={styles.statCardValue}>R$ {monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardIcon} style={{ background: 'var(--accent-red-dim)', color: 'var(--accent-red)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
            </svg>
          </div>
          <div>
            <p className={styles.statCardLabel}>Despesas</p>
            <p className={styles.statCardValue}>R$ {monthlyExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardIcon} style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <div>
            <p className={styles.statCardLabel}>Metas Ativas</p>
            <p className={styles.statCardValue}>{goals.length}</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className={`${styles.mainGrid} animate-in stagger-2`}>
        {/* Tasks */}
        <Card title="Tarefas Prioritárias" subtitle={`${pendingTasks.length} pendentes`} accent="purple">
          {displayTasks.length === 0 ? (
            <div className={styles.emptyState}>
              <span>🎉</span>
              <p>Tudo em dia! Sem tarefas pendentes.</p>
            </div>
          ) : (
            <div className={styles.taskList}>
              {displayTasks.map(task => (
                <div key={task.id} className={styles.taskItem}>
                  <div className={styles.taskDot} style={{
                    background: task.priority === 'high' ? 'var(--accent-red)' :
                                task.priority === 'medium' ? 'var(--accent-amber)' : 'var(--accent-green)'
                  }} />
                  <span className={styles.taskTitle}>{task.title}</span>
                  <span className={`${styles.priorityTag} ${styles[`priority_${task.priority}`]}`}>
                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Habits */}
        <Card title="Hábitos" subtitle={`${habits.length} rastreados`} accent="blue">
          {habits.length === 0 ? (
            <div className={styles.emptyState}>
              <span>🌱</span>
              <p>Crie seus primeiros hábitos!</p>
            </div>
          ) : (
            <div className={styles.habitList}>
              {habits.slice(0, 4).map(habit => (
                <div key={habit.id} className={styles.habitItem}>
                  <div className={styles.habitInfo}>
                    <span className={styles.habitName}>{habit.name}</span>
                    <span className={styles.habitFreq}>{habit.frequency === 'daily' ? 'Diário' : 'Semanal'}</span>
                  </div>
                  <div className={styles.streakBadge}>
                    🔥 <span>{habit.streak}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card title="Transações Recentes" subtitle="Últimas movimentações" accent="green">
          {recentTransactions.length === 0 ? (
            <div className={styles.emptyState}>
              <span>💳</span>
              <p>Nenhuma transação ainda.</p>
            </div>
          ) : (
            <div className={styles.transactionList}>
              {recentTransactions.map(t => (
                <div key={t.id} className={styles.transactionRow}>
                  <div className={styles.transactionIcon} style={{
                    background: t.type === 'income' ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
                    color: t.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)',
                  }}>
                    {t.type === 'income' ? '↑' : '↓'}
                  </div>
                  <div className={styles.transactionInfo}>
                    <span className={styles.transactionDesc}>{t.description}</span>
                    <span className={styles.transactionDate}>{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <span className={t.type === 'income' ? styles.amountIncome : styles.amountExpense}>
                    {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Goals */}
        <Card title="Progresso das Metas" accent="amber">
          {goals.length === 0 ? (
            <div className={styles.emptyState}>
              <span>🎯</span>
              <p>Defina suas primeiras metas!</p>
            </div>
          ) : (
            <div className={styles.goalList}>
              {goals.slice(0, 3).map(goal => {
                const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div key={goal.id} className={styles.goalItem}>
                    <div className={styles.goalHeader2}>
                      <span className={styles.goalTitle2}>{goal.title}</span>
                      <span className={styles.goalPct}>{pct}%</span>
                    </div>
                    <div className={styles.goalBar}>
                      <div className={styles.goalFill} style={{ width: `${pct}%` }} />
                    </div>
                    <div className={styles.goalAmounts}>
                      <span>R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span className={styles.goalTarget}>de R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
