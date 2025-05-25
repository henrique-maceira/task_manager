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
    // Verificar se uma tarefa foi selecionada e se há dias disponíveis
    if (
      (selectedTask || (customTask && customTaskTime > 0)) &&
      totalAvailableDays > 0
    ) {
      const taskTime = selectedTask
        ? selectedTask.avgTime
        : parseFloat(customTaskTime);
      
      // Horas totais por semana
      const hoursPerWeek = totalAvailableDays * hoursPerDay;
      
      // Semanas necessárias (arredondadas para cima)
      const weeksNeeded = Math.ceil(taskTime / hoursPerWeek);
      
      // Dias totais necessários
      const daysNeeded = Math.ceil(taskTime / hoursPerDay);
      
      // Tempo real em semanas (considerando dias disponíveis)
      const realWeeks = Math.ceil(daysNeeded / totalAvailableDays);
      
      // Data de conclusão estimada
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

  // Atualizar cálculo quando os valores mudarem
  useEffect(() => {
    if (currentStep === 4) {
      calculateResult();
    }
  }, [selectedTask, customTask, customTaskTime, availableDays, hoursPerDay]);

  // Função para lidar com a seleção de dias
  const handleDayToggle = (day) => {
    setAvailableDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  // Função para avançar etapa
  const nextStep = () => {
    // Verificação para cada etapa
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

  // Função para voltar etapa
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Função para recomeçar
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Planejador de Tempo para Metas
            </h1>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>

          {/* Barra de progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>

          {/* Etapa 1: Seleção de tarefa */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <CheckSquare className="inline mr-2 h-5 w-5" />
                Selecione sua tarefa
              </h2>
              
              <div className="flex space-x-4 mb-4">
                <button
                  className={`px-4 py-2 rounded-md ${
                    taskType === "predefined" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setTaskType("predefined")}
                >
                  Tarefas pré-definidas
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    taskType === "custom" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setTaskType("custom")}
                >
                  Tarefa personalizada
                </button>
              </div>

              {taskType === "predefined" ? (
                <div className="grid grid-cols-1 gap-2">
                  {predefinedTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedTask?.id === task.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex justify-between items-center">
                        <span>{task.name}</span>
                        <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-md">
                          {task.avgTime}h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="customTask"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome da tarefa
                    </label>
                    <input
                      type="text"
                      id="customTask"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Aprender a cozinhar"
                      value={customTask}
                      onChange={(e) => setCustomTask(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="customTaskTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tempo estimado (em horas)
                    </label>
                    <input
                      type="number"
                      id="customTaskTime"
                      min="1"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: 20"
                      value={customTaskTime}
                      onChange={(e) => setCustomTaskTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={nextStep}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={
                    (taskType === "predefined" && !selectedTask) ||
                    (taskType === "custom" && (!customTask || !customTaskTime))
                  }
                >
                  Próximo <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Etapa 2: Dias disponíveis */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <Calendar className="inline mr-2 h-5 w-5" />
                Selecione os dias disponíveis
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                      availableDays[day]
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => handleDayToggle(day)}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="pt-4 flex space-x-4">
                <button
                  onClick={prevStep}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Voltar
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={totalAvailableDays === 0}
                >
                  Próximo <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
              {totalAvailableDays === 0 && (
                <p className="text-red-500 text-sm mt-2">
                  Selecione pelo menos um dia disponível
                </p>
              )}
            </div>
          )}

          {/* Etapa 3: Horas por dia */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <Clock className="inline mr-2 h-5 w-5" />
                Quantas horas por dia?
              </h2>
              <div>
                <label
                  htmlFor="hoursPerDay"
                  className="block text-sm font-medium text-gray-700"
                >
                  Horas dedicadas por dia
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  id="hoursPerDay"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                  className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">1h</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {hoursPerDay}h por dia
                  </span>
                  <span className="text-xs text-gray-500">12h</span>
                </div>
              </div>
              <div className="pt-4 flex space-x-4">
                <button
                  onClick={prevStep}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Voltar
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Calcular <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Etapa 4: Resultado */}
          {currentStep === 4 && result && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Seu plano de ação
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800 text-lg mb-2">
                  {result.taskName}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tempo total</p>
                    <p className="font-semibold">{result.totalHours}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dias por semana</p>
                    <p className="font-semibold">{result.daysPerWeek}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Horas por dia</p>
                    <p className="font-semibold">{result.hoursPerDay}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dias necessários</p>
                    <p className="font-semibold">{result.daysNeeded}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckSquare className="h-5 w-5 text-green-600" />
                  <h3 className="font-bold text-green-800">Conclusão prevista</h3>
                </div>
                <p>
                  Com {result.hoursPerDay} horas por dia, em {result.daysPerWeek} dias
                  por semana, você completará sua meta em aproximadamente{" "}
                  <strong>{result.weeksNeeded} semanas</strong>.
                </p>
                <p className="mt-2">
                  Data estimada para conclusão:{" "}
                  <strong>{result.estimatedEndDate}</strong>
                </p>
              </div>

              <button
                onClick={restart}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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