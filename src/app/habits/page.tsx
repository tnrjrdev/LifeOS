import React from "react";
import styles from "./page.module.css";
import Card from "@/components/Card";
import { getHabits, getTasks, addHabit, addTask, toggleTaskStatus } from "@/actions/habits";

export default async function HabitsPage() {
  const habits = await getHabits();
  const tasks = await getTasks();

  const pending = tasks.filter(t => t.status === 'pending');
  const completed = tasks.filter(t => t.status === 'completed');

  return (
    <div className={styles.container}>
      <header className={`${styles.header} animate-in`}>
        <div>
          <h1>Hábitos & Tarefas</h1>
          <p className={styles.subtitle}>Construa sua rotina e mantenha o foco</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.pill} style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)' }}>
            ✓ {completed.length} concluídas
          </div>
          <div className={styles.pill} style={{ background: 'var(--accent-amber-dim)', color: 'var(--accent-amber)' }}>
            ◷ {pending.length} pendentes
          </div>
        </div>
      </header>

      <div className={`${styles.grid} animate-in stagger-1`}>
        {/* Left column: forms */}
        <div className={styles.column}>
          <Card title="Novo Hábito" accent="blue">
            <form action={addHabit} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nome do Hábito</label>
                <input name="name" placeholder="Ex: Beber 2L de água, Meditar 10min..." required className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Frequência</label>
                <select name="frequency" className={styles.input}>
                  <option value="daily">📅 Diário</option>
                  <option value="weekly">📆 Semanal</option>
                </select>
              </div>
              <button type="submit" className={`${styles.button} ${styles.buttonBlue}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Adicionar Hábito
              </button>
            </form>
          </Card>

          <Card title="Nova Tarefa" accent="purple">
            <form action={addTask} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>O que fazer?</label>
                <input name="title" placeholder="Ex: Pagar conta de luz..." required className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Prioridade</label>
                <select name="priority" className={styles.input}>
                  <option value="low">🟢 Baixa</option>
                  <option value="medium">🟡 Média</option>
                  <option value="high">🔴 Alta</option>
                </select>
              </div>
              <button type="submit" className={styles.button}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Adicionar Tarefa
              </button>
            </form>
          </Card>
        </div>

        {/* Right column: lists */}
        <div className={styles.column}>
          {/* Habits */}
          <Card title={`Seus Hábitos`} subtitle={`${habits.length} rastreados`} accent="blue">
            {habits.length === 0 ? (
              <div className={styles.empty}>
                <span>🌱</span>
                <p>Crie seu primeiro hábito ao lado!</p>
              </div>
            ) : (
              <div className={styles.habitList}>
                {habits.map(h => (
                  <div key={h.id} className={styles.habitRow}>
                    <div className={styles.habitDot}></div>
                    <div className={styles.habitInfo}>
                      <span className={styles.habitName}>{h.name}</span>
                      <span className={styles.habitFreq}>{h.frequency === 'daily' ? 'Diário' : 'Semanal'}</span>
                    </div>
                    <div className={styles.streakBadge}>🔥 <b>{h.streak}</b> dias</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Pending Tasks */}
          <Card title="Tarefas Pendentes" subtitle={`${pending.length} para fazer`} accent="purple">
            {pending.length === 0 ? (
              <div className={styles.empty}>
                <span>🎉</span>
                <p>Tudo feito! Sem tarefas pendentes.</p>
              </div>
            ) : (
              <div className={styles.taskList}>
                {pending.map(t => (
                  <form key={t.id} action={toggleTaskStatus.bind(null, t.id, t.status)} className={styles.taskRow}>
                    <button type="submit" className={styles.checkBtn} title="Marcar como concluído">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                    <span className={styles.taskTitle}>{t.title}</span>
                    <span className={`${styles.pTag} ${styles[`p_${t.priority}`]}`}>
                      {t.priority === 'high' ? 'Alta' : t.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </form>
                ))}
              </div>
            )}
          </Card>

          {/* Completed Tasks */}
          {completed.length > 0 && (
            <Card title="Concluídas" subtitle={`${completed.length} feitas`} accent="green">
              <div className={styles.taskList}>
                {completed.map(t => (
                  <form key={t.id} action={toggleTaskStatus.bind(null, t.id, t.status)} className={`${styles.taskRow} ${styles.taskRowDone}`}>
                    <button type="submit" className={`${styles.checkBtn} ${styles.checkBtnDone}`} title="Desmarcar">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                    <span className={styles.taskTitleDone}>{t.title}</span>
                  </form>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
