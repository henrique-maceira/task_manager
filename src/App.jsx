import { useState, useEffect } from "react";
import { Clock, Calendar, CheckSquare, ArrowRight } from "lucide-react";

export default function TimeManagementApp() {
  // Dados de tarefas pré-definidas com tempos médios em horas
  const predefinedTasks = [
    { id: 1, name: "Construir um aplicativo móvel", avgTime: 80 },
    { id: 2, name: "Desenvolver um site", avgTime: 40 },
    { id: 3, name: "Aprender a tocar violão (básico)", avgTime: 30 },
    { id: 4, name: "Aprender uma nova linguagem de programação", avgTime: 60 },
    { id: 5, name: "Escrever um e-book", avgTime: 50 },
    { id: 6, name: "Aprender fotografia", avgTime: 35 },
    { id: 7, name: "Criar uma loja online", avgTime: 25 },
  ];

  // Estados
  const [selectedTask, setSelectedTask] = useState(null);
  const [customTask, setCustomTask] = useState("");
  const [customTaskTime, setCustomTaskTime] = useState("");
  const [availableDays, setAvailableDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [taskType, setTaskType] = useState("predefined");

  // Calcular número total de dias disponíveis por semana
  const totalAvailableDays = Object.values(availableDays).filter(
    (day) => day
  ).length;

  // Função para calcular o resultado
  const calculateResult = () => {
    if (
      (selectedTask || (customTask && customTaskTime > 0)) &&
      totalAvailableDays > 0
    ) {
      const taskTime = selectedTask
        ? selectedTask.avgTime
        : parseFloat(customTaskTime);
      
      const hoursPerWeek = totalAvailableDays * hoursPerDay;
      const weeksNeeded = Math.ceil(taskTime / hoursPerWeek);
      const daysNeeded = Math.ceil(taskTime / hoursPerDay);
      const realWeeks = Math.ceil(daysNeeded / totalAvailableDays);
      
      const today = new Date();
      const daysToAdd = realWeeks * 7;
      const estimatedEndDate = new Date(today);
      estimatedEndDate.setDate(today.getDate() + daysToAdd);
      
      setResult({
        taskName: selectedTask ? selectedTask.name : customTask,
        totalHours: taskTime,
        daysPerWeek: totalAvailableDays,
        hoursPerDay: hoursPerDay,
        daysNeeded: daysNeeded,
        weeksNeeded: weeksNeeded,
        estimatedEndDate: estimatedEndDate.toLocaleDateString("pt-BR"),
      });

      setCurrentStep(4);
    }
  };

  useEffect(() => {
    if (currentStep === 4) {
      calculateResult();
    }
  }, [selectedTask, customTask, customTaskTime, availableDays, hoursPerDay]);

  const handleDayToggle = (day) => {
    setAvailableDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if ((taskType === "predefined" && selectedTask) || 
          (taskType === "custom" && customTask && customTaskTime > 0)) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (totalAvailableDays > 0) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      calculateResult();
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const restart = () => {
    setSelectedTask(null);
    setCustomTask("");
    setCustomTaskTime("");
    setAvailableDays({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
    setHoursPerDay(1);
    setResult(null);
    setCurrentStep(1);
    setTaskType("predefined");
  };

  return (
    <div className="app-container">
      <div className="main-card">
        <div className="card-content">
          <div className="header">
            <h1 className="title">
              Planejador de Tempo para Metas
            </h1>
            <Clock style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>

          {/* Etapa 1: Seleção de tarefa */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="section-title">
                <CheckSquare />
                Selecione sua tarefa
              </h2>
              
              <div className="button-tabs">
                <button
                  className={`tab-button ${taskType === "predefined" ? "active" : "inactive"}`}
                  onClick={() => setTaskType("predefined")}
                >
                  Tarefas pré-definidas
                </button>
                <button
                  className={`tab-button ${taskType === "custom" ? "active" : "inactive"}`}
                  onClick={() => setTaskType("custom")}
                >
                  Tarefa personalizada
                </button>
              </div>

              {taskType === "predefined" ? (
                <div className="task-grid">
                  {predefinedTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`task-card ${selectedTask?.id === task.id ? "selected" : ""}`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <span>{task.name}</span>
                      <span className="task-badge">
                        {task.avgTime}h
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">
                      Nome da tarefa
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Aprender a cozinhar"
                      value={customTask}
                      onChange={(e) => setCustomTask(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Tempo estimado (em horas)
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      placeholder="Ex: 20"
                      value={customTaskTime}
                      onChange={(e) => setCustomTaskTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div style={{ paddingTop: '1rem' }}>
                <button
                  onClick={nextStep}
                  className="btn btn-primary btn-full"
                  disabled={
                    (taskType === "predefined" && !selectedTask) ||
                    (taskType === "custom" && (!customTask || !customTaskTime))
                  }
                >
                  Próximo <ArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* Etapa 2: Dias disponíveis */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="section-title">
                <Calendar />
                Selecione os dias disponíveis
              </h2>
              <div className="days-grid">
                {Object.entries({
                  monday: "Segunda",
                  tuesday: "Terça",
                  wednesday: "Quarta",
                  thursday: "Quinta",
                  friday: "Sexta",
                  saturday: "Sábado",
                  sunday: "Domingo",
                }).map(([day, label]) => (
                  <div
                    key={day}
                    className={`day-card ${availableDays[day] ? "selected" : ""}`}
                    onClick={() => handleDayToggle(day)}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="button-group">
                <button onClick={prevStep} className="btn btn-secondary">
                  Voltar
                </button>
                <button
                  onClick={nextStep}
                  className="btn btn-primary"
                  disabled={totalAvailableDays === 0}
                >
                  Próximo <ArrowRight />
                </button>
              </div>
              {totalAvailableDays === 0 && (
                <p className="error-message">
                  Selecione pelo menos um dia disponível
                </p>
              )}
            </div>
          )}

          {/* Etapa 3: Horas por dia */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="section-title">
                <Clock />
                Quantas horas por dia?
              </h2>
              <div className="form-group">
                <label className="form-label">
                  Horas dedicadas por dia
                </label>
                <div className="range-container">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                    className="range-input"
                  />
                  <div className="range-labels">
                    <span className="range-min-max">1h</span>
                    <span className="range-value">
                      {hoursPerDay}h por dia
                    </span>
                    <span className="range-min-max">12h</span>
                  </div>
                </div>
              </div>
              <div className="button-group">
                <button onClick={prevStep} className="btn btn-secondary">
                  Voltar
                </button>
                <button onClick={nextStep} className="btn btn-primary">
                  Calcular <ArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* Etapa 4: Resultado */}
          {currentStep === 4 && result && (
            <div className="space-y-6">
              <h2 className="section-title">
                Seu plano de ação
              </h2>
              <div className="result-card">
                <h3 className="result-title">
                  {result.taskName}
                </h3>
                <div className="result-grid">
                  <div className="result-item">
                    <p>Tempo total</p>
                    <p>{result.totalHours}h</p>
                  </div>
                  <div className="result-item">
                    <p>Dias por semana</p>
                    <p>{result.daysPerWeek}</p>
                  </div>
                  <div className="result-item">
                    <p>Horas por dia</p>
                    <p>{result.hoursPerDay}h</p>
                  </div>
                  <div className="result-item">
                    <p>Dias necessários</p>
                    <p>{result.daysNeeded}</p>
                  </div>
                </div>
              </div>

              <div className="completion-card">
                <div className="completion-header">
                  <CheckSquare style={{ width: '1.25rem', height: '1.25rem', color: '#16a34a' }} />
                  <h3 className="completion-title">Conclusão prevista</h3>
                </div>
                <p>
                  Com {result.hoursPerDay} horas por dia, em {result.daysPerWeek} dias
                  por semana, você completará sua meta em aproximadamente{" "}
                  <strong>{result.weeksNeeded} semanas</strong>.
                </p>
                <p>
                  Data estimada para conclusão:{" "}
                  <strong>{result.estimatedEndDate}</strong>
                </p>
              </div>

              <button
                onClick={restart}
                className="btn btn-primary btn-full"
              >
                Planejar nova meta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}