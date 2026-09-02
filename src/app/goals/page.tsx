import React from "react";
import styles from "./page.module.css";
import Card from "@/components/Card";
import { getGoals, addGoal } from "@/actions/goals";

export default async function GoalsPage() {
  const goals = await getGoals();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Metas e Objetivos</h1>
      </header>

      <div className={styles.grid}>
        <div className={styles.column}>
          <Card title="Nova Meta">
            <form action={addGoal} className={styles.form}>
              <input name="title" placeholder="Título (ex: Comprar carro)" required className={styles.input} />
              <input name="targetAmount" type="number" step="0.01" placeholder="Valor Alvo (R$)" required className={styles.input} />
              <button type="submit" className={styles.button}>Criar Meta</button>
            </form>
          </Card>
        </div>

        <div className={styles.column}>
          {goals.length === 0 ? (
            <p className={styles.empty}>Você ainda não possui metas criadas.</p>
          ) : (
            goals.map((g) => {
              const percentage = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              return (
                <Card key={g.id} title={g.title}>
                  <div className={styles.goalInfo}>
                    <div className={styles.amounts}>
                      <span>R$ {g.currentAmount.toFixed(2)}</span>
                      <span className={styles.target}>/ R$ {g.targetAmount.toFixed(2)}</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className={styles.percentage}>{percentage}% Concluído</span>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
